import React, { useEffect, useState, useContext, useMemo, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { AuthContext } from "../Context/AuthContext";
import axios from "axios";
import BASE_URL from "../Config/api";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useFocusEffect } from "@react-navigation/native";
import RazorpayCheckout from 'react-native-razorpay';
import { useCart } from "../Context/CartContext";


export default function CheckoutScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const customer_id = user?.customer_id;
  const [cartItems, setCartItems] = useState([]);
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(true);

  const { clearCartCount } = useCart();


  useEffect(() => {
    if (customer_id) {
      fetchCart();
      fetchDefaultAddress(customer_id);
    }
  }, [customer_id]);

  // ✅ Fetch Cart Items
  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/cart/${customer_id}`);
      if (res.data.success) {
        setCartItems(res.data.data);
      }
    } catch (err) {
      console.error("Cart fetch error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Prevent showing checkout if cart is empty
  useEffect(() => {
    if (!loading && cartItems.length === 0) {
      console.log("Please add items before checkout.")
      // Alert.alert("Empty Cart", "Please add items before checkout.");
      // navigation.replace("Cart"); // 👈 Redirect user
    }
  }, [loading, cartItems]);

  // ✅ Fetch Default Shipping Address
  const fetchDefaultAddress = async (id) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/addresses/customer/${id}/defaults`);

      if (res.data.success) {
        const shipping = res.data.data?.shipping;
        if (shipping) {
          setAddress(shipping);
        } else {
          setAddress(null);
        }
      } else {
        setAddress(null);
      }
    } catch (err) {
      console.error("Address fetch error:", err.message);
      setAddress(null);
    }
  };


  // ✅ Re-fetch every time Checkout screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (customer_id) fetchDefaultAddress(customer_id);
    }, [customer_id])
  );


  // ✅ Quantity Handlers
  const increaseQty = async (id) => {
    try {
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
      await axios.put(`${BASE_URL}/api/cart/increment/${id}`);
    } catch (err) {
      console.error("Increase qty error:", err.message);
    }
  };

  const decreaseQty = async (id) => {
    try {
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === id && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      );
      await axios.put(`${BASE_URL}/api/cart/decrement/${id}`);
    } catch (err) {
      console.error("Decrease qty error:", err.message);
    }
  };

  // ✅ Remove Item
  const removeItem = async (id) => {
    try {
      setCartItems((prev) => prev.filter((item) => item.id !== id));
      await axios.delete(`${BASE_URL}/api/cart/delete/${id}`);
      await fetchCart(); // ✅ refresh UI instantly
      Alert.alert("🗑️ Removed", "Item removed from checkout.");
    } catch (err) {
      console.error("Remove item error:", err.message);
    }
  };



  // ✅ Dynamic Totals (Auto Recalculate)
  const { itemAmount, discount, totalAmount, gst, grandTotal } = useMemo(() => {
    const itemAmount = cartItems.reduce(
      (sum, item) => sum + parseFloat(item.product.price) * item.quantity,
      0
    );
    const discount = cartItems.reduce(
      (sum, item) =>
        sum +
        (parseFloat(item.product.price) *
          item.quantity *
          parseFloat(item.product.discount_percent || 0)) /
        100,
      0
    );
    const totalAmount = itemAmount - discount;
    const gst = totalAmount * 0;
    const grandTotal = totalAmount + gst;
    return { itemAmount, discount, totalAmount, gst, grandTotal };
  }, [cartItems]);

  const handlePayNow = async () => {
    if (!cartItems.length) {
      Alert.alert("Cart Empty", "Add items to cart before payment.");
      return;
    }

    if (!address) {
      Alert.alert("No Address", "Please select a shipping address.");
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ Create order on backend
      const orderResponse = await axios.post(`${BASE_URL}/api/orders/create-order`, {
        customer_id,
        address_id: address.id,
        items: cartItems.map(item => ({
          id: item.product.id,
          price: item.product.price,
          quantity: item.quantity
        })),
        order_total: grandTotal
      });

      const { order_id, razorpayOrder } = orderResponse.data;

      if (!RazorpayCheckout) {
        Alert.alert("Error", "Razorpay module is not loaded.");
        console.error("RazorpayCheckout is null. Did you install and link the module correctly?");
        return;
      }

      // 2️⃣ Razorpay Checkout Options
      const options = {
        description: "RV-AGRIHUB Order Payment",
        image: "https://your-logo-url.com/logo.png",
        currency: "INR",
        key: "rzp_test_RX082JQF5LtgWu", // Replace with your Razorpay Key
        amount: razorpayOrder.amount, // in paise
        order_id: razorpayOrder.id,
        name: "RV-AGRIHUB",
        prefill: {
          email: user?.email || "customer@example.com",
          contact: address.phone,
          name: address.full_name,
        },
        theme: { color: "#1a8e55" },
      };

      // 3️⃣ Open Razorpay Checkout safely
      await RazorpayCheckout.open(options)
        .then(async (paymentData) => {
          console.log("Payment Success:", paymentData);

          // 4️⃣ Verify payment on backend
          const verifyResponse = await axios.post(`${BASE_URL}/api/orders/verify-payment`, {
            order_id,
            razorpay_order_id: paymentData.razorpay_order_id,
            razorpay_payment_id: paymentData.razorpay_payment_id,
            razorpay_signature: paymentData.razorpay_signature,
          });

          if (verifyResponse.data.success) {
            // ✅ Clear backend cart
            await axios.delete(`${BASE_URL}/api/cart/clear/${customer_id}`);

            // ✅ Reset cart items in local state
            setCartItems([]);

            // ✅ Reset global cart count (if context exists)
            if (typeof clearCart === "function") clearCart();

            navigation.navigate("Home", {
              screen: "PaymentSuccess",
              params: {
                order_id,
                razorpay_order_id: paymentData.razorpay_order_id,
                amount: grandTotal.toFixed(2),
              },
            });


            // // ✅ Navigate to Success Screen
            // navigation.replace("PaymentSuccess", {
            //   order_id,
            //   razorpay_order_id: paymentData.razorpay_order_id,
            //   amount: grandTotal.toFixed(2),
            // });
          }


        })
        .catch((err) => {
          console.log("Payment cancelled or failed:", err);
          Alert.alert("Payment Cancelled", "Payment was not completed.");
        });

    } catch (error) {
      console.error("Error in handlePayNow:", error.message);
      Alert.alert("Error", "Something went wrong during payment.");
    } finally {
      setLoading(false);
    }
  };



  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#1a8e55" />
      </View>
    );
  }

  // ✅ Prevent rendering if no items
  if (!cartItems.length) {
    return null;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f9f9f9" }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Checkout</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Summary */}
        <View style={styles.summaryBox}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Item Amount</Text>
            <Text style={styles.value}>₹{itemAmount.toFixed(2)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Discount</Text>
            <Text style={styles.value}>- ₹{discount.toFixed(2)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Total (After Discount)</Text>
            <Text style={styles.value}>₹{totalAmount.toFixed(2)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>GST (8%)</Text>
            <Text style={styles.value}>₹{gst.toFixed(2)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.totalLabel}>Total Payable</Text>
            <Text style={styles.totalValue}>₹{grandTotal.toFixed(2)}</Text>
          </View>
        </View>

        {/* Address */}
        {/* <View style={styles.addressBox}>
          <View style={styles.addressHeader}>
            <Text style={styles.sectionTitle}>Delivery Address</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Profile", { screen: "DeliveryAddress" })}>
              <Text style={styles.changeText}>Change</Text>
            </TouchableOpacity>
          </View>
          {address ? (
            <View style={styles.addressContent}>
              <Text style={styles.name}>{address.full_name}</Text>
              <Text style={styles.phone}>{address.phone}</Text>
              <Text style={styles.addressText}>
                {address.address_line1}, {address.address_line2},{" "}
                {address.village}, {address.district}, {address.state},{" "}
                {address.pincode}
              </Text>
            </View>
          ) : (
            <Text style={{ color: "#777", marginTop: 5 }}>
              No shipping address found.
            </Text>
          )}
        </View> */}

        {/* Address Section */}
        <View style={styles.addressBox}>
          <View style={styles.addressHeader}>
            <Text style={styles.sectionTitle}>Delivery Address</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("Profile", { screen: "DeliveryAddress" })}
            >
              <Text style={styles.changeText}>Change</Text>
            </TouchableOpacity>
          </View>

          {address ? (
            <View style={styles.addressCard}>
              <View style={styles.addressRow}>
                <Ionicons name="location-outline" size={22} color="#2E7D32" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{address.full_name}</Text>
                  <Text style={styles.phone}>{address.phone}</Text>
                  <Text style={styles.addressText}>
                    {address.address_line1}
                    {address.address_line2 ? `, ${address.address_line2}` : ""},{" "}
                    {address.village}, {address.district}, {address.state} -{" "}
                    {address.pincode}
                  </Text>
                </View>
              </View>
              <View style={styles.defaultBadge}>
                <Ionicons name="checkmark-circle" size={16} color="#fff" />
                <Text style={styles.defaultBadgeText}>Default</Text>
              </View>
            </View>
          ) : (
            <View style={styles.noAddressBox}>
              <Ionicons name="alert-circle-outline" size={20} color="#777" />
              <Text style={styles.noAddressText}>No shipping address found.</Text>
            </View>
          )}
        </View>


        {/* Items */}
        <View style={styles.itemsBox}>
          <Text style={styles.sectionTitle}>
            Items in Order ({cartItems.length})
          </Text>

          {cartItems.map((item) => (
            <View key={item.id} style={styles.itemCard}>
              <Image
                source={{ uri: item.product.model_image }}
                style={styles.itemImage}
              />

              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.product.model_name}</Text>
                <Text style={styles.itemDesc}>{item.product.segment}</Text>

                <View style={styles.priceRow}>
                  <Text style={styles.itemPrice}>₹{item.product.price}</Text>
                  <Text style={styles.off}>
                    {item.product.discount_percent}% OFF
                  </Text>
                </View>

                <View style={styles.qtyRow}>
                  <TouchableOpacity onPress={() => decreaseQty(item.id)}>
                    <Ionicons
                      name="remove-circle-outline"
                      size={22}
                      color="#1a8e55"
                    />
                  </TouchableOpacity>
                  <Text style={styles.qtyText}>{item.quantity}</Text>
                  <TouchableOpacity onPress={() => increaseQty(item.id)}>
                    <Ionicons
                      name="add-circle-outline"
                      size={22}
                      color="#1a8e55"
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => removeItem(item.id)}
                    style={styles.removeBtn}
                  >
                    <Ionicons name="trash-outline" size={20} color="#ff4d4d" />
                    <Text style={styles.removeText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Pay Button */}
      <TouchableOpacity style={styles.payNowButton} onPress={handlePayNow}>
        <Text style={styles.payNowText}>
          Pay Now ₹{grandTotal.toFixed(2)}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 100 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },
  headerTitle: { flex: 1, textAlign: "center", fontSize: 18, fontWeight: "600" },

  summaryBox: {
    backgroundColor: "#fff",
    margin: 12,
    borderRadius: 10,
    padding: 15,
    elevation: 3,
  },
  row: { flexDirection: "row", justifyContent: "space-between", marginVertical: 4 },
  label: { fontSize: 15, color: "#444" },
  value: { fontSize: 15, fontWeight: "500", color: "#000" },
  divider: { height: 1, backgroundColor: "#ddd", marginVertical: 8 },
  totalLabel: { fontSize: 16, fontWeight: "700", color: "#000" },
  totalValue: { fontSize: 16, fontWeight: "700", color: "#1a8e55" },

  addressBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginVertical: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  addressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#333",
  },
  changeText: {
    fontSize: 15,
    color: "#2E7D32",
    fontWeight: "600",
  },
  addressCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    position: "relative",
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 18,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#030303ff",
  },
  phone: {
    fontSize: 17,
    color: "#020202ff",
    marginVertical: 2,
  },
  addressText: {
    fontSize: 16,
    color: "#0f0f0fff",
    lineHeight: 25,
  },
  defaultBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2E7D32",
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 8,
    alignSelf: "flex-start",
    position: "absolute",
    top: 10,
    right: 10,
  },
  defaultBadgeText: {
    fontSize: 14,
    color: "#fff",
    marginLeft: 3,
    fontWeight: "600",
  },
  noAddressBox: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  noAddressText: {
    color: "#777",
    fontSize: 14,
    marginLeft: 5,
  },

  itemsBox: {
    backgroundColor: "#fff",
    margin: 12,
    borderRadius: 10,
    padding: 15,
    elevation: 3,
  },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    backgroundColor: "#fdfdfd",
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  itemImage: {
    width: 90,
    height: 90,
    borderRadius: 10,
    resizeMode: "contain",
    backgroundColor: "#ffffffff",
  },
  itemInfo: { flex: 1, marginLeft: 40 },
  itemName: { fontSize: 15, fontWeight: "600", color: "#000" },
  itemDesc: { fontSize: 13, color: "#777", marginBottom: 4 },
  priceRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  itemPrice: { fontWeight: "600", color: "#000", fontSize: 14 },
  off: { color: "red", fontSize: 12 },
  qtyRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  qtyText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1a8e55",
    marginHorizontal: 6,
  },
  removeBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 20,
  },
  removeText: {
    color: "#ff4d4d",
    fontSize: 13,
    marginLeft: 3,
    fontWeight: "600",
  },

  payNowButton: {
    backgroundColor: "#1a8e55",
    paddingVertical: 16,
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  payNowText: { color: "#fff", fontSize: 17, fontWeight: "700" },
});
