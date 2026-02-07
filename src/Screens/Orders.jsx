
import React, { useContext, useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  Animated, LayoutAnimation, Platform, UIManager
} from "react-native";
import axios from "axios";
import Ionicons from "react-native-vector-icons/Ionicons";
import SearchwithCart from "../Components/SearchwithCart";
import GoHomeButton from "../Components/GoHomeButton";
import BASE_URL from "../Config/api";
import { AuthContext } from "../Context/AuthContext";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import { CheckCircle, Package, Truck, Home, Clock } from "lucide-react-native";

const OrderStatusBar = ({ deliverystatus,status, refund_status }) => {
  const steps = [
    { key: "orderplaced", label: "Placed", icon: CheckCircle },
    { key: "processing", label: "Processing", icon: Package },
    { key: "shipped", label: "Shipped", icon: Truck },
    { key: "delivered", label: "Delivered", icon: Home },
  ];

  // const activeIndex = steps.findIndex(
  //   (step) => step.key === (deliverystatus?.toLowerCase?.() || "orderplaced")
  // );
   // ✅ DEFINE FIRST
  const isCancelled =
    deliverystatus?.toLowerCase() === "cancelled" ||
    status?.toLowerCase() === "cancelled" ||
    status?.toLowerCase() === "refunded" ||
    refund_status?.toLowerCase() === "processed";

  const activeIndex = isCancelled
    ? 0
    : steps.findIndex(
        (step) =>
          step.key === (deliverystatus?.toLowerCase?.() || "orderplaced")
      );

  const progress = useRef(new Animated.Value(0)).current;

  // useEffect(() => {
  //   Animated.timing(progress, {
  //     toValue: (activeIndex / (steps.length - 1)) * 100,
  //     duration: 700,
  //     useNativeDriver: false,
  //   }).start();
  // }, [activeIndex]);

    useEffect(() => {
    Animated.timing(progress, {
      toValue: isCancelled
        ? 0
        : (activeIndex / (steps.length - 1)) * 100,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, [activeIndex, isCancelled]);

  const progressWidth = progress.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.container}>
      {/* Progress Line (background + animated fill) */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBackground} />
        <Animated.View
          style={[
            styles.progressFill,
            {
              width: progressWidth,
            },
          ]}
        >
          <LinearGradient
            colors={["#4CAF50", "#81C784"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      </View>

      {/* Step Circles + Labels */}
      <View style={styles.stepsContainer}>
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index <= activeIndex;

          return (
            <View key={step.key} style={styles.step}>
              <View
                style={[
                  styles.iconCircle,
                  isActive ? styles.iconActive : styles.iconInactive,
                ]}
              >
                <Icon
                  size={18}
                  color={isActive ? "#fff" : "#888"}
                  strokeWidth={2}
                />
              </View>
              <Text
                style={[
                  styles.label,
                  isActive ? styles.labelActive : styles.labelInactive,
                ]}
              >
                {step.label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};


const Orders = () => {
  const [query, setQuery] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const { user } = useContext(AuthContext);
  const customer_id = user?.customer_id;
  const navigation = useNavigation();
  const LIMIT = 10;

  // ✅ Status background/text map
  const statusStyles = {
    paid: { backgroundColor: "#C8E6C9", color: "#256029" },
    cancelled: { backgroundColor: "#FFCDD2", color: "#C62828" },
    refunded: { backgroundColor: "#E1BEE7", color: "#6A1B9A" },
    OrderPlaced: { backgroundColor: "#FFCDD2", color: "#85e607ff" },
    processing: { backgroundColor: "#FFE0B2", color: "#EF6C00" },
    shipped: { backgroundColor: "#BBDEFB", color: "#0D47A1" },
    delivered: { backgroundColor: "#C8E6C9", color: "#256029" },
  };

  // ✅ Fetch orders
  const fetchOrders = async (pageNumber = 1, isRefresh = false) => {
    if (!customer_id) return;
    if (!hasMore && !isRefresh) return;

    if (pageNumber === 1 && !isRefresh) setLoading(true);
    if (isRefresh) setRefreshing(true);

    try {
      const res = await axios.get(
        `${BASE_URL}/api/orders/customer/${customer_id}?page=${pageNumber}&limit=${LIMIT}`
      );

      if (res.data.length < LIMIT) setHasMore(false);
      else setHasMore(true);

      if (pageNumber === 1) {
        setOrders(res.data);
      } else {
        // Avoid duplicates
        setOrders((prev) => {
          const existingIds = new Set(prev.map((o) => o.order_id));
          const newOrders = res.data.filter((o) => !existingIds.has(o.order_id));
          return [...prev, ...newOrders];
        });
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // useEffect(() => {
  //   if (customer_id) fetchOrders(1);
  // }, [customer_id]);


  useFocusEffect(
    React.useCallback(() => {
      if (customer_id) {
        fetchOrders(1, true);   // 🔥 force refresh
      }
    }, [customer_id])
  );


  const loadMoreOrders = () => {
    if (!hasMore || loading || refreshing) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchOrders(nextPage);
  };

  const onRefresh = () => {
    setPage(1);
    setHasMore(true);
    fetchOrders(1, true);
  };


  //   // Enable LayoutAnimation on Android
  // if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental && !global._IS_FABRIC_ENABLED) {
  //   UIManager.setLayoutAnimationEnabledExperimental(true);
  // }

  // const toggleExpand = (orderId) => {
  //  if (Platform.OS === "android" && !global._IS_FABRIC_ENABLED) {
  //     LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  //   }
  //   setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  // };

  // Detect New Architecture (Fabric)
  const isFabric = !!global?.nativeFabricUIManager;

  // Enable LayoutAnimation on Android only (Old Architecture)
  if (
    Platform.OS === "android" &&
    UIManager.setLayoutAnimationEnabledExperimental &&
    !isFabric
  ) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  const toggleExpand = (orderId) => {
    if (Platform.OS === "android" && !isFabric) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  const getDisplayStatus = (order) => {
    const delivery = order?.deliverystatus?.toLowerCase();
    const refund = order?.refund_status?.toLowerCase();
    const status = order?.status?.toLowerCase();

    if (delivery === "cancelled") {
      return refund === "processed" ? "REFUNDED" : "CANCELLED";
    }

    if (status === "paid") return "PAID";

    return status?.toUpperCase() || "ORDER PLACED";
  };



  const renderItem = ({ item }) => {
    const isExpanded = expandedOrderId === item.order_id;
    const displayStatus = getDisplayStatus(item);
    const statusKey = displayStatus.toLowerCase();

    return (
      <View style={styles.orderCard}>
        {/* Header (Order ID + Status) */}
        <TouchableOpacity
          style={styles.orderHeader}
          onPress={() => toggleExpand(item.order_id)}
          activeOpacity={0.8}
        >
          <Text style={styles.orderId}>Order ID: {item.order_id}</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {/* <Text
            style={[
              styles.status,
              statusStyles[item.status?.toLowerCase()] || statusStyles.OrderPlaced,
              { color: statusStyles[item.status?.toLowerCase()]?.color || "#C62828" },
            ]}
          >
            {item.status.toUpperCase()}
          </Text> */}


            <Text
              style={[
                styles.status,
                statusStyles[statusKey] || statusStyles.cancelled,
                { color: statusStyles[statusKey]?.color || "#C62828" },
              ]}
            >
              {displayStatus}
            </Text>

            <Ionicons
              name={isExpanded ? "chevron-up" : "chevron-down"}
              size={20}
              color="#4CAF50"
              style={{ marginLeft: 6 }}
            />
          </View>
        </TouchableOpacity>

        {/* Expanded Content */}
        {isExpanded && (
          <View style={{ marginTop: 5 }}>
            {/* ✅ Product Items List */}
            {item.items?.map((it) => (
              <View key={`${item.order_id}-${it.id}`} style={styles.itemRow}>
                {/* Product Image */}
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("Home", {
                      screen: "ProductDetailPage",
                      params: { product: it.product },
                    })
                  }
                  activeOpacity={0.8}
                >
                  <Image
                    source={{
                      uri:
                        it.product?.model_image ||
                        "https://via.placeholder.com/100x100.png?text=No+Image",
                    }}
                    style={styles.itemImage}
                  />
                </TouchableOpacity>

                {/* Product Info */}
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.productName} numberOfLines={1}>
                    {it.product?.model_name || "Unnamed Product"}
                  </Text>
                  <Text style={styles.segment}>
                    {it.product?.segment || "General"}
                  </Text>
                  <Text style={styles.price}>
                    ₹{it.price} × {it.quantity}
                  </Text>
                </View>
              </View>
            ))}

            {/* ✅ Delivery Status Bar */}
            {/* <OrderStatusBar deliverystatus={item.deliverystatus} /> */}
            <OrderStatusBar
  deliverystatus={item.deliverystatus}
  status={item.status}
  refund_status={item.refund_status}
/>


            {/* ✅ Order Footer */}
            <View style={styles.footer}>
              <Text style={styles.amount}>Total: ₹{item.order_total}</Text>
              <TouchableOpacity
                style={styles.detailsButton}
                onPress={() =>
                  navigation.navigate("Home", {
                    screen: "OrderDetails",
                    params: { order_id: item.order_id },
                  })
                }
              >
                <Ionicons name="receipt-outline" size={18} color="#fff" />
                <Text style={styles.detailsText}>View Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };


  if (loading && page === 1)
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <GoHomeButton />
        <Text style={styles.headerText}>My Orders</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Search */}
      <SearchwithCart
        searchValue={query}
        onSearchChange={setQuery}
        onCartPress={() => navigation.navigate("Home", { screen: "CartScreen" })}
      />

      {orders.length === 0 ? (
        <Text style={styles.emptyText}>No orders found.</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.order_id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
          onEndReached={loadMoreOrders}
          onEndReachedThreshold={0.5}
          refreshing={refreshing}
          onRefresh={onRefresh}
          ListFooterComponent={loading && page > 1 ? <ActivityIndicator color="#4CAF50" /> : null}
        />
      )}
    </SafeAreaView>
  );
};

export default Orders;

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    marginBottom: 6,
    paddingHorizontal: 8,
  },
  progressContainer: {
    position: "absolute",
    top: 16, // aligns with icon center
    left: 35,
    right: 35,
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#E0E0E0",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  stepsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  step: {
    alignItems: "center",
    flex: 1,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  iconActive: {
    backgroundColor: "#4CAF50",
  },
  iconInactive: {
    backgroundColor: "#E0E0E0",
  },
  label: {
    fontSize: 11,
    textAlign: "center",
  },
  labelActive: {
    color: "#4CAF50",
    fontWeight: "600",
  },
  labelInactive: {
    color: "#888",
  },

  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 5, justifyContent: "space-between", paddingVertical: 2 },
  headerText: { fontSize: 20, fontWeight: "bold" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { textAlign: "center", marginTop: 40, color: "#777" },
  orderCard: { backgroundColor: "#fff", borderRadius: 12, padding: 12, marginBottom: 15, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  orderHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  orderId: { fontWeight: "600", color: "#030303ff" },
  status: { padding: 5, borderRadius: 6, fontWeight: "600", fontSize: 12 },
  itemRow: { flexDirection: "row", alignItems: "center", backgroundColor: "#fafafa", padding: 6, borderRadius: 8, marginBottom: 8 },
  image: { width: 80, height: 80, borderRadius: 8, marginRight: 25 },
  productName: { fontWeight: "600", color: "#030303ff", fontSize: 16 },
  price: { color: "#030303ff", fontSize: 15 },
  footer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8 },
  amount: { fontWeight: "700", color: "#000", fontSize: 16 },
  detailsButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#4CAF50", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  detailsText: { color: "#fff", marginLeft: 4, fontWeight: "600" },
  statusContainer: { flexDirection: "row", justifyContent: "space-between", marginVertical: 10 },
  statusStep: { alignItems: "center", flex: 1 },
  statusCircle: { width: 14, height: 14, borderRadius: 7, marginBottom: 3 },
  statusLine: { position: "absolute", top: 7, right: "-50%", height: 3, width: "100%" },
  statusActive: { backgroundColor: "#4CAF50" },
  statusInactive: { backgroundColor: "#ccc" },
  statusLabel: { fontSize: 10, textAlign: "center", color: "#777" },
  statusTextActive: { color: "#4CAF50", fontWeight: "700" },
  statusTextInactive: { color: "#999" },

  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fafafa",
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },

  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: "#f2f2f2",
  },

  productName: {
    fontWeight: "600",
    color: "#222",
    fontSize: 15,
  },

  segment: {
    color: "#777",
    fontSize: 13,
    marginVertical: 2,
  },

  price: {
    color: "#1a8e55",
    fontWeight: "700",
    fontSize: 14,
  },

});
