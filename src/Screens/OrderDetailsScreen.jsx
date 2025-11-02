import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import Ionicons from "react-native-vector-icons/Ionicons";
import BASE_URL from "../Config/api";
import LinearGradient from "react-native-linear-gradient";

const OrderDetailsScreen = ({ route, navigation }) => {
  const { order_id } = route.params;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  const fetchOrderDetails = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/orders/details/${order_id}`);
      setOrder(res.data);
    } catch (error) {
      console.error("Error fetching order details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.loader}>
        <Text style={{ color: "#555" }}>No order details found.</Text>
      </View>
    );
  }

  const firstItem = order.items?.[0]?.product;

  return (
    <ScrollView style={styles.container}
     contentContainerStyle={{ paddingBottom: 30 }}
  showsVerticalScrollIndicator={false}
  nestedScrollEnabled={true}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Details</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Order Summary */}
      <View style={styles.card}>
        <LinearGradient
          colors={["#4CAF50", "#81C784"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.orderHeader}
        >
          <Text style={styles.orderId}>Order ID: {order.order_id}</Text>
          <Text style={styles.status}>{order.status.toUpperCase()}</Text>
        </LinearGradient>

   

        <View style={styles.orderInfo}>
          <Text style={styles.infoText}>
            <Text style={styles.infoLabel}>Placed On: </Text>
            {new Date(order.created_at).toLocaleString()}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.infoLabel}>Payment Status: </Text>
            {order.status.toUpperCase()}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.infoLabel}>Order Total: </Text>₹{order.order_total}
          </Text>
        </View>
      </View>

      {/* Product List */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Items</Text>
        {order.items?.map((item) => (
          <View key={item.id} style={styles.itemRow}>
            <Image
              source={{
                uri: item.product?.model_image || "https://via.placeholder.com/100",
              }}
              style={styles.productImage}
            />
            <View style={styles.itemInfo}>
              <Text style={styles.productName}>{item.product?.model_name}</Text>
              <Text style={styles.productDesc}>{item.product?.segment}</Text>
              <Text style={styles.productPrice}>
                ₹{item.price} × {item.quantity}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Delivery Address */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Delivery Address</Text>
        <Text style={styles.addressText}>{order.full_name}</Text>
        <Text style={styles.addressText}>{order.phone}</Text>
        <Text style={styles.addressText}>
          {order.address_line1}, {order.address_line2}
        </Text>
        <Text style={styles.addressText}>
          {order.village}, {order.district}, {order.state} - {order.pincode}
        </Text>
        {order.landmark ? (
          <Text style={styles.addressText}>Landmark: {order.landmark}</Text>
        ) : null}
      </View>

      {/* Footer */}
      <View style={styles.footerCard}>
        <View style={styles.footerRow}>
          <Text style={styles.footerLabel}>Subtotal</Text>
          <Text style={styles.footerValue}>₹{order.amount}</Text>
        </View>
        <View style={styles.footerRow}>
          <Text style={styles.footerLabel}>Delivery</Text>
          <Text style={styles.footerValue}>Free</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.footerRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>₹{order.order_total}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.reorderButton}
        onPress={() => alert("Reorder feature coming soon!")}
      >
        <LinearGradient
          colors={["#4CAF50", "#81C784"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.reorderGradient}
        >
          <Ionicons name="repeat" size={18} color="#fff" />
          <Text style={styles.reorderText}>Reorder</Text>
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default OrderDetailsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9F9F9" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
  },
  headerTitle: { fontSize: 20, fontWeight: "700" },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 10,
    marginBottom: 15,
    elevation: 3,
  },
  orderHeader: {
    padding: 10,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderId: { color: "#fff", fontWeight: "600", fontSize: 14 },
  status: { color: "#fff", fontWeight: "bold" },
  orderInfo: { marginTop: 10 },
  infoLabel: { fontWeight: "600", color: "#444" },
  infoText: { color: "#555", fontSize: 13, marginVertical: 2 },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
    color: "#222",
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e0e0e0",
    paddingBottom: 10,
  },
  productImage: { width: 70, height: 70, borderRadius: 10, marginRight: 12 },
  itemInfo: { flex: 1 },
  productName: { fontSize: 15, fontWeight: "600", color: "#222" },
  productDesc: { color: "#777", fontSize: 13 },
  productPrice: { color: "#4CAF50", fontWeight: "700", marginTop: 4 },

  addressText: { fontSize: 13, color: "#444", marginVertical: 2 },

  footerCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 10,
    marginBottom: 15,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  footerLabel: { color: "#444", fontSize: 14 },
  footerValue: { color: "#444", fontSize: 14 },
  divider: { height: 1, backgroundColor: "#e0e0e0", marginVertical: 8 },
  totalLabel: { fontSize: 16, fontWeight: "700" },
  totalValue: { fontSize: 16, fontWeight: "700", color: "#4CAF50" },

  reorderButton: { alignItems: "center", marginBottom: 25 },
  reorderGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 25,
  },
  reorderText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
    marginLeft: 6,
  },
});
