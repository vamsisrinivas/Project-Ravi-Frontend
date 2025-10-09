// src/Screens/CartScreen.js
import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { AuthContext } from "../Context/AuthContext";
import axios from "axios";
import BASE_URL from "../Config/api";

export default function CartScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch cart
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/cart/${user.customer_id}`);
      if (res.data.success) {
        setCartItems(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

// Increase quantity
const increaseQty = async (id) => {
  try {
    // Optimistically update UI first
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );

    // Then call API
    await axios.put(`${BASE_URL}/api/cart/increment/${id}`);
  } catch (err) {
    console.error("Error incrementing quantity:", err.message);
    alert("❌ Failed to increase quantity");
    fetchCart(); // rollback if needed
  }
};

// Decrease quantity
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
    console.error("Error decrementing quantity:", err.message);
    alert("❌ Failed to decrease quantity");
    fetchCart(); // rollback if needed
  }
};


// Remove from cart
const removeItem = async (id) => {
  try {
    // remove from UI instantly
    setCartItems((prev) => prev.filter((item) => item.id !== id));

    // call API
    await axios.delete(`${BASE_URL}/api/cart/delete/${id}`);

    alert("🗑️ Item removed from cart!");
    // optional: re-fetch to sync with backend
    fetchCart();
  } catch (err) {
    console.error("Error deleting item:", err.message);
    alert("❌ Failed to remove item. Please try again.");
  }
};




  // Totals
  const itemAmount = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.product.price) * item.quantity,
    0
  );
  const discount = cartItems.reduce(
    (sum, item) =>
      sum +
      (parseFloat(item.product.price) *
        item.quantity *
        parseFloat(item.product.discount_percent)) /
        100,
    0
  );
  const totalAmount = itemAmount - discount;

  const renderItem = ({ item }) => (
    // <View style={styles.card}>
    //   <Image source={{ uri: item.product.model_image }} style={styles.image} />
    //   <View style={styles.details}>
    //     <Text style={styles.name}>{item.product.model_name}</Text>
    //     <Text style={styles.price}>₹ {item.product.price}</Text>
    //     <View style={styles.qtyRow}>
    //       <TouchableOpacity onPress={() => decreaseQty(item.id)}>
    //         <Ionicons name="remove-circle-outline" size={24} color="#548c5c" />
    //       </TouchableOpacity>
    //       <Text style={styles.qty}>{item.quantity}</Text>
    //       <TouchableOpacity onPress={() => increaseQty(item.id)}>
    //         <Ionicons name="add-circle-outline" size={24} color="#548c5c" />
    //       </TouchableOpacity>
    //     </View>
    //   </View>
    //   <TouchableOpacity onPress={() => removeItem(item.id)}>
    //     <Ionicons name="trash-outline" size={22} color="red" />
    //   </TouchableOpacity>
    // </View>
<View style={styles.card}>
  {/* Image Clickable */}
  <TouchableOpacity
    activeOpacity={0.9}
    onPress={() =>
      navigation.navigate("ProductDetailPage", { product: item.product })
    }
  >
    <Image source={{ uri: item.product.model_image }} style={styles.image} />
  </TouchableOpacity>

  {/* Details */}
  <View style={styles.details}>
    <Text style={styles.name}>{item.product.model_name}</Text>
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

  {/* Delete Button */}
  <TouchableOpacity onPress={() => removeItem(item.id)}>
    <Ionicons name="trash-outline" size={22} color="red" />
  </TouchableOpacity>
</View>

  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#548c5c" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
    
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000000ff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Cart</Text>
        <View style={{ width: 24 }} /> 
      </View>

      {/* Cart List */}
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 15 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="cart-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>Your cart is empty</Text>
          </View>
        }
      />

      {/* Totals Section */}
      {cartItems.length > 0 && (
        <View style={styles.totalsContainer}>
          <View style={styles.row}>
            <Text style={styles.label}>Item Amount</Text>
            <Text style={styles.value}>₹{itemAmount.toFixed(2)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Discount</Text>
            <Text style={styles.value}>- ₹{discount.toFixed(2)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>₹{totalAmount.toFixed(2)}</Text>
          </View>

          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={() => navigation.navigate("Checkout")}
          >
            <Text style={styles.checkoutText}>Proceed to Checkout</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingTop: 5,
  },  loader: { flex: 1, justifyContent: "center", alignItems: "center" },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 12,
    justifyContent: "space-between",
  },
//   headerTitle: { fontSize: 18, fontWeight: "700", color: "#fff" },
    headerTitle: {
   fontSize: 22,
    fontWeight: "700",
    color: "#222",
    letterSpacing: 0.5,
  },

  // Cart items
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 4,
  },
  image: { width: 95, height:95, borderRadius: 8,margin:3},
  details: { flex: 1, marginLeft: 12 },
  name: { fontSize: 12, fontWeight: "700", color: "#000000ff" },
  price: { fontSize: 11,fontWeight: "600", color: "#0a0a0aff", marginTop: 3 },
  qtyRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  qty: { marginHorizontal: 10, fontSize: 16, fontWeight: "600", color: "#333" },

  // Totals
  totalsContainer: {
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 2,
  },
  label: { fontSize: 14, color: "#020202ff" },
  value: { fontSize: 14, fontWeight: "600", color: "#070707ff" },
  totalLabel: { fontSize: 16, fontWeight: "700", color: "#000" },
  totalValue: { fontSize: 16, fontWeight: "700", color: "#000" },
  checkoutButton: {
    backgroundColor: "#548c5c",
    padding: 10,
    borderRadius: 10,
    marginTop: 15,
    alignItems: "center",
  },
  checkoutText: { color: "#fff", fontSize: 16, fontWeight: "500" },

  // Empty state
  emptyContainer: { alignItems: "center", marginTop: 50 },
  emptyText: { marginTop: 10, fontSize: 16, color: "#777" },
});
