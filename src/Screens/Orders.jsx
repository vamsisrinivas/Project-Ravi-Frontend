// import React, { useContext, useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   Image,
//   StyleSheet,
//   ActivityIndicator,
//   SafeAreaView,
//   TouchableOpacity,
// } from "react-native";
// import axios from "axios";
// import Ionicons from "react-native-vector-icons/Ionicons";
// import SearchwithCart from "../Components/SearchwithCart";
// import BASE_URL from "../Config/api";
// import { AuthContext } from "../Context/AuthContext";
// import GoHomeButton from "../Components/GoHomeButton";
// import { useNavigation } from "@react-navigation/native";


// const OrderStatusBar = ({ status }) => {
//   const steps = ["Pending", "Processing", "Shipped", "Delivered"];
//   const activeIndex = steps.findIndex((s) => s.toLowerCase() === status.toLowerCase());

//   return (
//     <View style={styles.statusContainer}>
//       {steps.map((step, index) => (
//         <View key={index} style={styles.statusStep}>
//           <View
//             style={[
//               styles.statusCircle,
//               index <= activeIndex ? styles.statusActive : styles.statusInactive,
//             ]}
//           />
//           {index < steps.length - 1 && (
//             <View
//               style={[
//                 styles.statusLine,
//                 index < activeIndex ? styles.statusActive : styles.statusInactive,
//               ]}
//             />
//           )}
//           <Text
//             style={[
//               styles.statusLabel,
//               index <= activeIndex
//                 ? styles.statusTextActive
//                 : styles.statusTextInactive,
//             ]}
//           >
//             {step}
//           </Text>
//         </View>
//       ))}
//     </View>
//   );
// };

// const Orders = () => {
//   const [query, setQuery] = useState('');
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);

//   const { user } = useContext(AuthContext);
//   const customer_id = user?.customer_id;
//   const navigation = useNavigation();
//   const LIMIT = 10; // 10 orders per page

//   // ✅ Fetch orders from API
//   // const fetchOrders = async (pageNumber = 1, isRefresh = false) => {
//   //   if (!customer_id) return;
//   //   if (!hasMore && !isRefresh) return;

//   //   if (pageNumber === 1 && !isRefresh) setLoading(true);
//   //   if (isRefresh) setRefreshing(true);

//   //   try {
//   //     const res = await axios.get(
//   //       `${BASE_URL}/api/orders/customer/${customer_id}?page=${pageNumber}&limit=${LIMIT}`
//   //     );

//   //     // Stop fetching more if we got less than LIMIT
//   //     if (res.data.length < LIMIT) setHasMore(false);
//   //     else setHasMore(true);

//   //     if (pageNumber === 1) {
//   //       setOrders(res.data);
//   //     } else {
//   //       setOrders((prev) => [...prev, ...res.data]);
//   //     }
//   //   } catch (error) {
//   //     console.error("Error fetching orders:", error);
//   //   } finally {
//   //     setLoading(false);
//   //     setRefreshing(false);
//   //   }
//   // };

//   const fetchOrders = async (pageNumber = 1, isRefresh = false) => {
//   if (!customer_id) return;
//   if (!hasMore && !isRefresh) return;

//   if (pageNumber === 1 && !isRefresh) setLoading(true);
//   if (isRefresh) setRefreshing(true);

//   try {
//     const res = await axios.get(
//       `${BASE_URL}/api/orders/customer/${customer_id}?page=${pageNumber}&limit=${LIMIT}`
//     );

//     // Stop fetching more if less than LIMIT
//     if (res.data.length < LIMIT) setHasMore(false);
//     else setHasMore(true);

//     let newOrders = res.data;

//     // Merge with existing orders and deduplicate by order_id
//     if (pageNumber > 1) {
//       const merged = [...orders, ...newOrders];
//       const seen = new Set();
//       newOrders = merged.filter((o) => {
//         if (seen.has(o.order_id)) return false;
//         seen.add(o.order_id);
//         return true;
//       });
//     }

//     if (pageNumber === 1) {
//       setOrders(newOrders);
//     } else {
//       setOrders(newOrders);
//     }
//   } catch (error) {
//     console.error("Error fetching orders:", error);
//   } finally {
//     setLoading(false);
//     setRefreshing(false);
//   }
// };


//   useEffect(() => {
//     if (customer_id) fetchOrders(1);
//   }, [customer_id]);

//   // ✅ Load more orders for pagination
//   const loadMoreOrders = () => {
//     if (!hasMore || loading || refreshing) return;
//     const nextPage = page + 1;
//     setPage(nextPage);
//     fetchOrders(nextPage);
//   };

//   // ✅ Pull-to-refresh handler
//   const onRefresh = () => {
//     setPage(1);
//     setHasMore(true);
//     fetchOrders(1, true);
//   };

//   const renderItem = ({ item }) => (
//     <View style={styles.orderCard} key={`order-${item.order_id}`}>
//       <View style={styles.orderHeader}>
//         <Text style={styles.orderId}>Order ID: {item.order_id}</Text>
//         <Text
//           style={[
//             styles.status,
//             item.status === "delivered"
//               ? styles.delivered
//               : item.status === "processing"
//                 ? styles.processing
//                 : item.status === "shipped"
//                   ? styles.shipped
//                   : styles.pending,
//           ]}
//         >
//           {item.status.toUpperCase()}
//         </Text>
//       </View>
// {item.items?.map((it) => (
//   <View key={`${item.order_id}-${it.id}`} style={styles.itemRow}>
//     <TouchableOpacity
//       onPress={() =>
//         navigation.navigate("Home", {
//           screen: "ProductDetailPage",
//           params: { product: it.product },
//         })
//       }
//       activeOpacity={0.9}
//     >
//       <Image
//         source={{ uri: it.product?.model_image || "https://via.placeholder.com/80" }}
//         style={styles.image}
//       />
//     </TouchableOpacity>

//     <View style={{ flex: 1 }}>
//       <Text style={styles.productName}>{it.product?.model_name || "Model Item"}</Text>
//       <Text style={styles.price}>₹ {it.price} × {it.quantity}</Text>
//     </View>
//   </View>
// ))}


//       <OrderStatusBar status={item.status} />

//       <View style={styles.footer}>
//         <Text style={styles.amount}>Total: ₹{item.order_total}</Text>
//         <TouchableOpacity style={styles.detailsButton}>
//           <Ionicons name="receipt-outline" size={18} color="#fff" />
//           <Text style={styles.detailsText}>View Details</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   if (loading && page === 1)
//     return (
//       <View style={styles.loader}>
//         <ActivityIndicator size="large" color="#4CAF50" />
//       </View>
//     );

//   return (
//     <>
//       {/* <View style={{ backgroundColor: "#fff" }}>
//         <SearchwithCart
//           searchValue={query}
//           onSearchChange={setQuery}
//           onCartPress={() => alert("Cart pressed!")}
//         />
//       </View> */}

//       <SafeAreaView style={styles.container}>

//         {/* Header */}
//         <View style={styles.headerRow}>
//           <View style={{ width: 45, alignItems: 'flex-start' }}>
//             <GoHomeButton />
//           </View>
//           <View style={{ flex: 1, alignItems: 'center' }}>
//             <Text style={styles.headerText}>My Orders</Text>
//           </View>
//           <View style={{ width: 40 }} />
//         </View>

//         {/* Search */}
//         <SearchwithCart
//           searchValue={query}
//           onSearchChange={setQuery}
//           onCartPress={() => navigation.navigate("Home", { screen: "CartScreen" })}
//         />
//         {orders.length === 0 ? (
//           <Text style={styles.emptyText}>No orders found.</Text>
//         ) : (
//          <FlatList
//   data={orders}
//   keyExtractor={(item) => `${item.order_id}`}
//   renderItem={renderItem}
//   contentContainerStyle={{ paddingBottom: 100 }}
//   onEndReached={loadMoreOrders}
//   onEndReachedThreshold={0.5}
//   refreshing={refreshing}
//   onRefresh={onRefresh}
//   ListFooterComponent={
//     loading && page > 1 ? <ActivityIndicator color="#4CAF50" /> : null
//   }
// />

//         )}
//       </SafeAreaView>
//     </>
//   );
// };

// export default Orders;

// // ✅ Styles
// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#f9f9f9", padding: 10 },
//   title: { fontSize: 22, fontWeight: "700", marginBottom: 10, color: "#333" },
//   headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5, justifyContent: 'space-between', paddingVertical: 2 },
//   headerText: { fontSize: 20, fontWeight: 'bold' },
//   loader: { flex: 1, justifyContent: "center", alignItems: "center" },
//   emptyText: { textAlign: "center", marginTop: 40, color: "#777" },

//   orderCard: {
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     padding: 12,
//     marginBottom: 15,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   orderHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 10,
//   },
//   orderId: { fontWeight: "600", color: "#030303ff" },
//   status: { padding: 5, borderRadius: 6, fontWeight: "600", fontSize: 12 },
//   paid: { backgroundColor: "#C8E6C9", color: "#256029" },
//   pending: { backgroundColor: "#60a744ff", color: "#dfdb0aff" },

//   itemRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#fafafa",
//     padding: 6,
//     borderRadius: 8,
//     marginBottom: 8,
//   },
//   image: { width: 80, height: 80, borderRadius: 8, marginRight: 25 },
//   productName: { fontWeight: "600", color: "#030303ff", fontSize: 16 },
//   price: { color: "#030303ff", fontSize: 15 },

//   footer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginTop: 8,
//   },
//   amount: { fontWeight: "700", color: "#000", fontSize: 16 },
//   detailsButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#4CAF50",
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 8,
//   },
//   detailsText: { color: "#fff", marginLeft: 4, fontWeight: "600" },

//   // STATUS BAR
//   statusContainer: { flexDirection: "row", justifyContent: "space-between", marginVertical: 10 },
//   statusStep: { alignItems: "center", flex: 1 },
//   statusCircle: { width: 14, height: 14, borderRadius: 7, marginBottom: 3 },
//   statusLine: { position: "absolute", top: 7, right: "-50%", height: 3, width: "100%" },
//   statusActive: { backgroundColor: "#4CAF50" },
//   statusInactive: { backgroundColor: "#ccc" },
//   statusLabel: { fontSize: 10, textAlign: "center", color: "#777" },
//   statusTextActive: { color: "#4CAF50", fontWeight: "700" },
//   statusTextInactive: { color: "#999" },
// });



import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import Ionicons from "react-native-vector-icons/Ionicons";
import SearchwithCart from "../Components/SearchwithCart";
import GoHomeButton from "../Components/GoHomeButton";
import BASE_URL from "../Config/api";
import { AuthContext } from "../Context/AuthContext";
import { useNavigation } from "@react-navigation/native";

// ✅ Progress bar component
const OrderStatusBar = ({ status }) => {
  const steps = ["Pending", "Processing", "Shipped", "Delivered"];
  const activeIndex = steps.findIndex((s) => s.toLowerCase() === status.toLowerCase());

  return (
    <View style={styles.statusContainer}>
      {steps.map((step, index) => (
        <View key={index} style={styles.statusStep}>
          <View
            style={[
              styles.statusCircle,
              index <= activeIndex ? styles.statusActive : styles.statusInactive,
            ]}
          />
          {index < steps.length - 1 && (
            <View
              style={[
                styles.statusLine,
                index < activeIndex ? styles.statusActive : styles.statusInactive,
              ]}
            />
          )}
          <Text
            style={[
              styles.statusLabel,
              index <= activeIndex
                ? styles.statusTextActive
                : styles.statusTextInactive,
            ]}
          >
            {step}
          </Text>
        </View>
      ))}
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

  const { user } = useContext(AuthContext);
  const customer_id = user?.customer_id;
  const navigation = useNavigation();
  const LIMIT = 10;

  // ✅ Status background/text map
  const statusStyles = {
    paid: { backgroundColor: "#C8E6C9", color: "#256029" },
    pending: { backgroundColor: "#FFCDD2", color: "#C62828" },
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

  useEffect(() => {
    if (customer_id) fetchOrders(1);
  }, [customer_id]);

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

  const renderItem = ({ item }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>Order ID: {item.order_id}</Text>
        <Text
          style={[
            styles.status,
            statusStyles[item.status?.toLowerCase()] || statusStyles.pending,
            { color: statusStyles[item.status?.toLowerCase()]?.color || "#C62828" },
          ]}
        >
          {item.status.toUpperCase()}
        </Text>
      </View>

      {item.items?.map((it) => (
        <View key={`${item.order_id}-${it.id}`} style={styles.itemRow}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Home", {
                screen: "ProductDetailPage",
                params: { product: it.product },
              })
            }
            activeOpacity={0.9}
          >
            <Image
              source={{ uri: it.product?.model_image || "https://via.placeholder.com/80" }}
              style={styles.image}
            />
          </TouchableOpacity>

          <View style={{ flex: 1 }}>
            <Text style={styles.productName}>{it.product?.model_name || "Model Item"}</Text>
            <Text style={styles.price}>₹ {it.price} × {it.quantity}</Text>
          </View>
        </View>
      ))}

      <OrderStatusBar status={item.status} />

      <View style={styles.footer}>
        <Text style={styles.amount}>Total: ₹{item.order_total}</Text>
        <TouchableOpacity style={styles.detailsButton}>
          <Ionicons name="receipt-outline" size={18} color="#fff" />
          <Text style={styles.detailsText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

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
  container: { flex: 1, backgroundColor: "#f9f9f9", padding: 10 },
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
});
