
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
  TextInput,
  FlatList,
} from "react-native";
import { AuthContext } from "../Context/AuthContext";
import axios from "axios";
import BASE_URL from "../Config/api";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useFocusEffect } from "@react-navigation/native";
import RazorpayCheckout from "react-native-razorpay";
import { useCart } from "../Context/CartContext";

export default function CheckoutScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const customer_id = user?.customer_id;
  const [cartItems, setCartItems] = useState([]);
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const { clearCartCount } = useCart();

  // Coupons
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponDiscountAmount, setCouponDiscountAmount] = useState(0);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // Payment authoritative values returned by server when creating order
  const [serverOrder, setServerOrder] = useState(null); // { order_id, razorpayOrder, finalAmount }

  // Fetch cart and address
  useEffect(() => {
    if (customer_id) {
      fetchCart();
      fetchDefaultAddress(customer_id);
      fetchAvailableCoupons();
    }
  }, [customer_id]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/cart/${customer_id}`);
      if (res.data.success) setCartItems(res.data.data || []);
    } catch (err) {
      console.error("Cart fetch error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchDefaultAddress = async (id) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/addresses/customer/${id}/defaults`);
      if (res.data.success) {
        setAddress(res.data.data?.shipping || null);
      }
    } catch (err) {
      console.error("Address fetch error:", err.message);
      setAddress(null);
    }
  };

  // Fetch active coupons from backend
  const fetchAvailableCoupons = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/coupons/all`); // endpoint expected
      if (res.data.success) {
        setAvailableCoupons(res.data.coupons || []);
      }
    } catch (err) {
      console.error("Fetch coupons error:", err.message);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (customer_id) fetchDefaultAddress(customer_id);
    }, [customer_id])
  );

  const increaseQty = async (id) => {
    // ✅ Update UI instantly
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );

    // ✅ Async update backend (no fetchCart)
    try {
      await axios.put(`${BASE_URL}/api/cart/increment/${id}`);
    } catch (err) {
      console.error("Increase qty error:", err.message);
    }
  };

  const decreaseQty = async (id) => {
    // ✅ Update UI instantly
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );

    // ✅ Async update backend (no fetchCart)
    try {
      await axios.put(`${BASE_URL}/api/cart/decrement/${id}`);
    } catch (err) {
      console.error("Decrease qty error:", err.message);
    }
  };


  const removeItem = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/cart/delete/${id}`);
      await fetchCart();
      Alert.alert("Removed", "Item removed from cart.");
    } catch (err) {
      console.error("Remove item error:", err.message);
    }
  };

  if (isRedirecting) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#1a8e55" />
        <Text style={{ marginTop: 10, color: "#1a8e55", fontWeight: "600" }}>
          Redirecting to success screen...
        </Text>
      </View>
    );
  }

  // Product discount and totals (local calculation)
  const {
    itemAmount, // sum of product prices * qty
    productDiscountAmount, // sum of per-product percentage discounts
    subtotalAfterProductDiscount, // itemAmount - productDiscountAmount
    gstAmount,
    localGrandTotal, // preliminary local total before coupon
  } = useMemo(() => {
    const itemAmount = cartItems.reduce(
      (sum, item) => sum + parseFloat(item.product.price) * item.quantity,
      0
    );

    const productDiscountAmount = cartItems.reduce((sum, item) => {
      const pct = parseFloat(item.product.discount_percent || 0);
      return sum + ((parseFloat(item.product.price) * item.quantity * pct) / 100);
    }, 0);

    const subtotalAfterProductDiscount = itemAmount - productDiscountAmount;
    const gstAmount = subtotalAfterProductDiscount * 0; // change if needed
    const localGrandTotal = subtotalAfterProductDiscount + gstAmount - couponDiscountAmount;

    return {
      itemAmount,
      productDiscountAmount,
      subtotalAfterProductDiscount,
      gstAmount,
      localGrandTotal,
    };
  }, [cartItems, couponDiscountAmount]);

  // Apply coupon by calling backend /api/coupons/apply
  const applyCoupon = async (code = couponCodeInput) => {
    if (!code || !code.trim()) return Alert.alert("Enter coupon code");

    try {
      setIsApplyingCoupon(true);
      // send order_total so backend can validate min_order_amount etc.
      const res = await axios.post(`${BASE_URL}/api/coupons/apply`, {
        coupon_code: code.trim(),
        customer_id,
        order_total: subtotalAfterProductDiscount, // backend uses pre-coupon amount to validate
      });

      if (res.data.success) {
        // backend should return discount number and coupon details
        setAppliedCoupon(res.data.coupon_details || { coupon_code: code.trim() });
        setCouponDiscountAmount(Number(res.data.discount || 0));
        setCouponCodeInput("");
        Alert.alert("Coupon applied", res.data.message || "Coupon applied");
      } else {
        // backend returned failure (invalid/expired/min order)
        setAppliedCoupon(null);
        setCouponDiscountAmount(0);
        Alert.alert("Coupon error", res.data.message || "Cannot apply coupon");
      }
    } catch (err) {
      console.error("Apply coupon error:", err.message);
      Alert.alert("Error", "Failed to apply coupon");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  // Remove coupon locally (does not touch backend yet)
  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscountAmount(0);
    setCouponCodeInput("");
    Alert.alert("Coupon removed", "Coupon removed from order");
  };

  // Create order on server BEFORE opening Razorpay.
  // This ensures server-final amount and razorpayOrder.amount are authoritative.
  const createServerOrder = async () => {
    // Build items payload expected by backend
    const itemsPayload = cartItems.map((item) => ({
      id: item.product.id,
      price: Number(item.product.price),
      quantity: item.quantity,
      discount_percent: Number(item.product.discount_percent || 0), // ✅ send product discount
    }));

    try {
      setLoading(true);
      const payload = {
        customer_id,
        address_id: address.id,
        items: itemsPayload,
        coupon_code: appliedCoupon?.coupon_code || null,
        delivery_charge: 0,
      };

      const res = await axios.post(`${BASE_URL}/api/orders/create-order`, payload);

      if (res.data.success) {
        // server must return razorpayOrder (amount in paise) and finalAmount (number)
        setServerOrder({
          order_id: res.data.order_id,
          razorpayOrder: res.data.razorpayOrder,
          finalAmount: Number(res.data.finalAmount ?? res.data.order_total ?? 0),
        });

        return {
          ok: true,
          order_id: res.data.order_id,
          razorpayOrder: res.data.razorpayOrder,
          finalAmount: Number(res.data.finalAmount ?? res.data.order_total ?? 0),
        };
      } else {
        Alert.alert("Order error", res.data.message || "Failed to create order");
        return { ok: false, message: res.data.message };
      }
    } catch (err) {
      console.error("Create order error:", err.message);
      Alert.alert("Error", "Failed to create order on server");
      return { ok: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Pay Now: create server order, then open Razorpay using server's razorpayOrder.amount
  const handlePayNow = async () => {
    if (!cartItems.length) {
      return Alert.alert("Cart Empty", "Add items before checkout.");
    }
    if (!address) {
      return Alert.alert("No Address", "Please select shipping address.");
    }

    // 1) Create order on server to get authoritative amount (paise)
    const created = await createServerOrder();
    if (!created.ok) return;

    const { order_id, razorpayOrder, finalAmount } = created;

    // 2) Use server razorpayOrder.amount (paise) — MUST match Pay button display
    const serverAmountPaise = razorpayOrder?.amount;
    if (!serverAmountPaise) {
      Alert.alert("Payment Error", "Server did not return payment amount.");
      return;
    }

    const options = {
      description: "RV-AGRIHUB Order Payment",
      image: "https://your-logo-url.com/logo.png",
      currency: "INR",
      key: process.env.RAZORPAY_KEY || "rzp_test_RX082JQF5LtgWu", // replace with actual key from config/env in production
      amount: serverAmountPaise,
      order_id: razorpayOrder.id,
      name: "RV-AGRIHUB",
      prefill: {
        email: user?.email || "customer@example.com",
        contact: address.phone,
        name: address.full_name,
      },
      theme: { color: "#1a8e55" },
    };

    try {
      const paymentData = await RazorpayCheckout.open(options);
      // paymentData: { razorpay_payment_id, razorpay_order_id, razorpay_signature }
      // 3) Verify payment on server
      const verifyRes = await axios.post(`${BASE_URL}/api/orders/verify-payment`, {
        order_id,
        razorpay_order_id: paymentData.razorpay_order_id,
        razorpay_payment_id: paymentData.razorpay_payment_id,
        razorpay_signature: paymentData.razorpay_signature,
      });

   if (verifyRes.data.success) {
  try {
    setIsRedirecting(true); // ✅ instantly hide checkout UI

    // 🧹 Clear cart on server + locally
    await axios.delete(`${BASE_URL}/api/cart/clear/${customer_id}`);
    setCartItems([]);
    clearCartCount?.();

        setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: "Home",
            state: {
              routes: [
                {
                  name: "PaymentSuccess",
                  params: {
                    order_id,
                    razorpay_order_id: paymentData.razorpay_order_id,
                    amount: Number(finalAmount).toFixed(2),
                  },
                },
              ],
            },
          },
        ],
      });
    }, 300); 
 } catch (clearErr) {
    console.error("Error clearing cart:", clearErr.message);
  }
      } else {
        Alert.alert("Verification failed", verifyRes.data.message || "Payment verification failed");
      }
    } catch (err) {
      // Razorpay cancelled or error
      console.log("Payment error/cancel:", err);
      Alert.alert("Payment Cancelled", "Payment not completed.");
    }
  };

  // Pay button label: if serverOrder exists, show server final amount; otherwise show local estimate
  const displayedPayAmount = serverOrder
    ? Number(serverOrder.finalAmount).toFixed(2)
    : Number(localGrandTotal || 0).toFixed(2);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#1a8e55" />
      </View>
    );
  }

  if (!cartItems.length) return null;

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
            <Text style={styles.label}>Items Total</Text>
            <Text style={styles.value}>₹{itemAmount.toFixed(2)}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Product Discount</Text>
            <Text style={styles.value}>- ₹{productDiscountAmount.toFixed(2)}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Subtotal</Text>
            <Text style={styles.value}>₹{subtotalAfterProductDiscount.toFixed(2)}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>GST</Text>
            <Text style={styles.value}>₹{gstAmount.toFixed(2)}</Text>
          </View>


          <View style={{ marginTop: 10 }}>
            {appliedCoupon ? (
              <View style={styles.couponAppliedBox}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <Text style={{ fontWeight: "700" }}>{appliedCoupon.coupon_code}</Text>
                  <TouchableOpacity onPress={removeCoupon}>
                    <Text style={{ color: "red" }}>Remove</Text>
                  </TouchableOpacity>
                </View>
                <Text style={{ marginTop: 6, color: "#444" }}>
                  {appliedCoupon.description || "Coupon applied"}
                </Text>
                <View style={[styles.row, { marginTop: 8 }]}>
                  <Text style={styles.label}>Coupon Discount</Text>
                  <Text style={[styles.value, { color: "#2E7D32" }]}>- ₹{couponDiscountAmount.toFixed(2)}</Text>
                </View>
              </View>
            ) : (
              <>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <TextInput
                    placeholder="Enter coupon code"
                    value={couponCodeInput}
                    onChangeText={setCouponCodeInput}
                    style={styles.couponInput}
                  />
                  <TouchableOpacity onPress={() => applyCoupon(couponCodeInput)} style={styles.couponButton} disabled={isApplyingCoupon}>
                    <Text style={{ color: "#fff", fontWeight: "700" }}>{isApplyingCoupon ? "..." : "Apply"}</Text>
                  </TouchableOpacity>
                </View>

                {/* quick pick coupons list (if any) */}
                {availableCoupons.length > 0 && (
                  <View style={{ marginTop: 10 }}>
                    <Text style={{ fontWeight: "700", marginBottom: 6 }}>Available Coupons</Text>
                    <FlatList
                      data={availableCoupons}
                      horizontal
                      keyExtractor={(c) => String(c.id)}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={styles.couponChip}
                          onPress={() => applyCoupon(item.coupon_code)}
                        >
                          <Text style={{ fontWeight: "700" }}>{item.coupon_code}</Text>
                          <Text style={{ fontSize: 12 }}>{item.discount_type === "percentage" ? `${item.discount_value}%` : `₹${item.discount_value}`}</Text>
                        </TouchableOpacity>
                      )}
                    />
                  </View>
                )}
              </>
            )}
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.totalLabel}>Total Payable</Text>
            <Text style={styles.totalValue}>₹{displayedPayAmount}</Text>
          </View>
        </View>

        {/* Items */}
        <View style={styles.itemsBox}>
          <Text style={styles.sectionTitle}>Items ({cartItems.length})</Text>

          {/* {cartItems.map((item) => (
            <View key={item.id} style={styles.itemCard}>
              <Image source={{ uri: item.product.model_image }} style={styles.itemImage} />
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.product.model_name}</Text>
                <Text style={styles.itemDesc}>{item.product.segment}</Text>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 6 }}>
                  <Text style={styles.itemPrice}>₹{item.product.price} x {item.quantity}</Text>
                  <Text style={{ color: "#ff4d4d" }}>{item.product.discount_percent}% OFF</Text>
                </View>
              </View>
            </View>
          ))} */}

          {cartItems.map((item) => (
            <View key={item.id} style={styles.cartCard}>
              {/* Product Image */}
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() =>
                  navigation.navigate("ProductDetailPage", { product: item.product })
                }
                style={styles.imageContainer}
              >
                <Image
                  source={{ uri: item.product.model_image }}
                  style={styles.image}
                />
              </TouchableOpacity>

              {/* Product Details */}
              <View style={styles.details}>
                <Text style={styles.name} numberOfLines={1}>
                  {item.product.model_name}
                </Text>
                <Text style={styles.segment}>{item.product.segment}</Text>
                <Text style={styles.price}>₹ {item.product.price}</Text>

                <View style={styles.qtyRow}>
                  <TouchableOpacity onPress={() => decreaseQty(item.id)}>
                    <Ionicons name="remove-circle-outline" size={24} color="#548c5c" />
                  </TouchableOpacity>
                  <Text style={styles.qty}>{item.quantity}</Text>
                  <TouchableOpacity onPress={() => increaseQty(item.id)}>
                    <Ionicons name="add-circle-outline" size={24} color="#548c5c" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Remove Button */}
              <View style={styles.iconColumn}>
                <TouchableOpacity onPress={() => removeItem(item.id)}>
                  <Ionicons name="trash-outline" size={22} color="red" />
                </TouchableOpacity>
              </View>
            </View>
          ))}

        </View>
      </ScrollView>

      {/* Pay Button */}
      <TouchableOpacity style={styles.payNowButton} onPress={handlePayNow}>
        <Text style={styles.payNowText}>Pay ₹{displayedPayAmount}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// Styles (mostly reused)
const styles = StyleSheet.create({
  container: { paddingBottom: 120 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { flexDirection: "row", alignItems: "center", padding: 15, borderBottomWidth: 1, borderColor: "#eee", backgroundColor: "#fff" },
  headerTitle: { flex: 1, textAlign: "center", fontSize: 18, fontWeight: "600" },
  summaryBox: { backgroundColor: "#fff", margin: 12, borderRadius: 10, padding: 15, elevation: 3 },
  row: { flexDirection: "row", justifyContent: "space-between", marginVertical: 6 },
  label: { fontSize: 15, color: "#444" },
  value: { fontSize: 15, fontWeight: "500", color: "#000" },
  divider: { height: 1, backgroundColor: "#ddd", marginVertical: 8 },
  totalLabel: { fontSize: 17, fontWeight: "700", color: "#000" },
  totalValue: { fontSize: 17, fontWeight: "700", color: "#1a8e55" },

  couponInput: { flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, paddingHorizontal: 10, height: 40 },
  couponButton: { backgroundColor: "#1a8e55", paddingHorizontal: 15, paddingVertical: 10, borderRadius: 8, marginLeft: 8 },

  couponAppliedBox: { padding: 10, backgroundColor: "#f1fff3", borderRadius: 8, borderWidth: 1, borderColor: "#e0f1e7", marginTop: 8 },

  couponChip: { backgroundColor: "#fff", padding: 10, borderRadius: 8, marginRight: 8, borderWidth: 1, borderColor: "#eee", alignItems: "center", minWidth: 100 },

  itemsBox: { backgroundColor: "#fff", margin: 12, borderRadius: 10, padding: 15, elevation: 3 },
  itemCard: { flexDirection: "row", alignItems: "center", marginVertical: 8 },
  itemImage: { width: 80, height: 80, borderRadius: 8 },
  itemInfo: { marginLeft: 15, flex: 1 },
  itemName: { fontSize: 15, fontWeight: "600" },
  itemDesc: { fontSize: 13, color: "#777" },
  itemPrice: { color: "#000", fontWeight: "700", marginTop: 4 },

  payNowButton: { backgroundColor: "#1a8e55", paddingVertical: 16, alignItems: "center", position: "absolute", bottom: 0, width: "100%" },
  payNowText: { color: "#fff", fontSize: 17, fontWeight: "700" },


  // 🛒 Same card UI as CartScreen
  cartCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    marginBottom: 14,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#fffcfcff",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  details: { flex: 1, marginLeft: 12, justifyContent: "space-between" },
  name: { fontSize: 15, fontWeight: "600", color: "#333" },
  segment: { fontSize: 13, color: "#777", marginVertical: 2 },
  price: { fontSize: 15, color: "#548c5c", fontWeight: "bold" },
  qtyRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  qty: { marginHorizontal: 10, fontSize: 15, color: "#333" },
  iconColumn: {
    justifyContent: "flex-end",
    alignItems: "center",
    width: 40,
    marginBottom: 20,
  },

});
