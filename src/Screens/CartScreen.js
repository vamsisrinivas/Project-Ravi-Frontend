

// // src/Screens/CartScreen.js
// import React, { useEffect, useState, useContext } from "react";
// import {
//   View,
//   Text,
//   Image,
//   FlatList,
//   TouchableOpacity,
//   StyleSheet,
//   ActivityIndicator,
//   SafeAreaView,
//   Alert,
// } from "react-native";
// import Ionicons from "react-native-vector-icons/Ionicons";
// import { AuthContext } from "../Context/AuthContext";
// import axios from "axios";
// import BASE_URL from "../Config/api";

// export default function CartScreen({ navigation }) {
//   const { user } = useContext(AuthContext);
//   const [cartItems, setCartItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [wishlist, setWishlist] = useState([]); // ❤️ track wishlist items

//   useEffect(() => {
//     fetchCart();
//   }, []);

//   const fetchCart = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(`${BASE_URL}/api/cart/${user.customer_id}`);
//       if (res.data.success) {
//         setCartItems(res.data.data);
//       }
//     } catch (error) {
//       console.error("Error fetching cart:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Wishlist toggle handler
//   const toggleWishlist = async (productId) => {
//     try {
//       const isWishlisted = wishlist.includes(productId);

//       if (isWishlisted) {
//         // Remove from wishlist
//         await axios.delete(`${BASE_URL}/api/wishlist/delete/${user.customer_id}/${productId}`);
//         setWishlist((prev) => prev.filter((id) => id !== productId));
//         Alert.alert("Removed from Wishlist ❤️‍🔥");
//       } else {
//         // Add to wishlist
//         await axios.post(`${BASE_URL}/api/wishlist/add`, {
//           customer_id: user.customer_id,
//           model_id: productId,
//         });
//         setWishlist((prev) => [...prev, productId]);
//         Alert.alert("Added to Wishlist ❤️");
//       }
//     } catch (err) {
//       console.error("Wishlist error:", err.message);
//       Alert.alert("❌ Failed to update wishlist");
//     }
//   };

//   // ✅ Increase quantity
//   const increaseQty = async (id) => {
//     try {
//       setCartItems((prev) =>
//         prev.map((item) =>
//           item.id === id ? { ...item, quantity: item.quantity + 1 } : item
//         )
//       );
//       await axios.put(`${BASE_URL}/api/cart/increment/${id}`);
//     } catch (err) {
//       console.error("Error incrementing quantity:", err.message);
//       Alert.alert("❌ Failed to increase quantity");
//       fetchCart();
//     }
//   };

//   // ✅ Decrease quantity
//   const decreaseQty = async (id) => {
//     try {
//       setCartItems((prev) =>
//         prev.map((item) =>
//           item.id === id && item.quantity > 1
//             ? { ...item, quantity: item.quantity - 1 }
//             : item
//         )
//       );
//       await axios.put(`${BASE_URL}/api/cart/decrement/${id}`);
//     } catch (err) {
//       console.error("Error decrementing quantity:", err.message);
//       Alert.alert("❌ Failed to decrease quantity");
//       fetchCart();
//     }
//   };

//   // ✅ Remove from cart
//   const removeItem = async (id) => {
//     try {
//       setCartItems((prev) => prev.filter((item) => item.id !== id));
//       await axios.delete(`${BASE_URL}/api/cart/delete/${id}`);
//       Alert.alert("🗑️ Item removed from cart!");
//       fetchCart();
//     } catch (err) {
//       console.error("Error deleting item:", err.message);
//       Alert.alert("❌ Failed to remove item. Please try again.");
//     }
//   };

//   // ✅ Totals
//   const itemAmount = cartItems.reduce(
//     (sum, item) => sum + parseFloat(item.product.price) * item.quantity,
//     0
//   );
//   const discount = cartItems.reduce(
//     (sum, item) =>
//       sum +
//       (parseFloat(item.product.price) *
//         item.quantity *
//         parseFloat(item.product.discount_percent)) /
//         100,
//     0
//   );
//   const totalAmount = itemAmount - discount;

//   // ✅ Render each cart item
//   const renderItem = ({ item }) => {
//     const isWishlisted = wishlist.includes(item.product.model_id);

//     return (
//       <View style={styles.card}>
//         {/* Product image */}
//         <TouchableOpacity
//           activeOpacity={0.9}
//           onPress={() =>
//             navigation.navigate("ProductDetailPage", { product: item.product })
//           }
//         >
//           <Image source={{ uri: item.product.model_image }} style={styles.image} />
//         </TouchableOpacity>

//         {/* Details */}
//         <View style={styles.details}>
//           <Text style={styles.name}>{item.product.model_name}</Text>
//           <Text style={styles.price}>₹ {item.product.price}</Text>

//           <View style={styles.qtyRow}>
//             <TouchableOpacity onPress={() => decreaseQty(item.id)}>
//               <Ionicons name="remove-circle-outline" size={24} color="#548c5c" />
//             </TouchableOpacity>

//             <Text style={styles.qty}>{item.quantity}</Text>

//             <TouchableOpacity onPress={() => increaseQty(item.id)}>
//               <Ionicons name="add-circle-outline" size={24} color="#548c5c" />
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Wishlist + Delete Icons */}
//         <View style={styles.iconColumn}>
//           <TouchableOpacity onPress={() => toggleWishlist(item.product.model_id)}>
//             <Ionicons
//               name={isWishlisted ? "heart" : "heart-outline"}
//               size={24}
//               color={isWishlisted ? "red" : "#777"}
//               style={{ marginBottom: 8 }}
//             />
//           </TouchableOpacity>

//           <TouchableOpacity onPress={() => removeItem(item.id)}>
//             <Ionicons name="trash-outline" size={22} color="red" />
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   };

//   if (loading) {
//     return (
//       <View style={styles.loader}>
//         <ActivityIndicator size="large" color="#548c5c" />
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={24} color="#000" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>My Cart</Text>
//         <View style={{ width: 24 }} />
//       </View>

//       {/* Cart List */}
//       <FlatList
//         data={cartItems}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={renderItem}
//         contentContainerStyle={{ padding: 15 }}
//         ListEmptyComponent={
//           <View style={styles.emptyContainer}>
//             <Ionicons name="cart-outline" size={60} color="#ccc" />
//             <Text style={styles.emptyText}>Your cart is empty</Text>
//           </View>
//         }
//       />

//       {/* Totals */}
//       {cartItems.length > 0 && (
//         <View style={styles.totalsContainer}>
//           <View style={styles.row}>
//             <Text style={styles.label}>Item Amount</Text>
//             <Text style={styles.value}>₹{itemAmount.toFixed(2)}</Text>
//           </View>
//           <View style={styles.row}>
//             <Text style={styles.label}>Discount</Text>
//             <Text style={styles.value}>- ₹{discount.toFixed(2)}</Text>
//           </View>
//           <View style={styles.row}>
//             <Text style={styles.totalLabel}>Total Amount</Text>
//             <Text style={styles.totalValue}>₹{totalAmount.toFixed(2)}</Text>
//           </View>

//           <TouchableOpacity
//             style={styles.checkoutButton}
//             onPress={() => navigation.navigate("Checkout")}
//           >
//             <Text style={styles.checkoutText}>Proceed to Checkout</Text>
//           </TouchableOpacity>
//         </View>
//       )}
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#fff" },
//   loader: { flex: 1, justifyContent: "center", alignItems: "center" },

//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#fff",
//     paddingHorizontal: 15,
//     paddingVertical: 12,
//     justifyContent: "space-between",
//   },
//   headerTitle: { fontSize: 22, fontWeight: "700", color: "#222" },

//   card: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#fff",
//     padding: 12,
//     borderRadius: 12,
//     marginBottom: 12,
//     shadowColor: "#000",
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 4,
//   },
//   image: {
//     width: 95,
//     height: 95,
//     borderRadius: 10,
//     marginRight: 10,
//     resizeMode: "contain",
//     backgroundColor: "#f8f8f8",
//   },
//   details: { flex: 1 },
//   name: { fontSize: 14, fontWeight: "700", color: "#000" },
//   price: { fontSize: 13, fontWeight: "600", color: "#0a0a0a", marginTop: 4 },
//   qtyRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
//   qty: { marginHorizontal: 10, fontSize: 16, fontWeight: "600", color: "#333" },
//   iconColumn: { alignItems: "center", justifyContent: "center" },

//   totalsContainer: {
//     padding: 12,
//     borderTopWidth: 1,
//     borderColor: "#eee",
//     backgroundColor: "#fff",
//   },
//   row: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginVertical: 2,
//   },
//   label: { fontSize: 14, color: "#333" },
//   value: { fontSize: 14, fontWeight: "600" },
//   totalLabel: { fontSize: 16, fontWeight: "700", color: "#000" },
//   totalValue: { fontSize: 16, fontWeight: "700", color: "#000" },
//   checkoutButton: {
//     backgroundColor: "#548c5c",
//     padding: 12,
//     borderRadius: 10,
//     marginTop: 10,
//     alignItems: "center",
//   },
//   checkoutText: { color: "#fff", fontSize: 16, fontWeight: "600" },

//   emptyContainer: { alignItems: "center", marginTop: 60 },
//   emptyText: { marginTop: 10, fontSize: 16, color: "#777" },
// });









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
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { AuthContext } from "../Context/AuthContext";
// import { WishlistContext } from "../Context/WishlistContext"; // ✅ import global wishlist
import axios from "axios";
import BASE_URL from "../Config/api";
import { useIsFocused } from "@react-navigation/native"; // ✅ add this at top
import GoHomeButton from "../Components/GoHomeButton";

export default function CartScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  // const { wishlist, addToWishlist, removeFromWishlist } = useContext(WishlistContext);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingIds, setPendingIds] = useState([]); // <--- track pending updates
  const isFocused = useIsFocused(); // ✅ track if screen is visible

  // 🔁 Fetch cart every time the screen is focused
  useEffect(() => {
    if (isFocused) {
      fetchCart();
    }
  }, [isFocused]);

  //   // helper to add/remove pending id
  // const setPending = (id, val) => {
  //   setPendingIds((prev) => {
  //     if (val) {
  //       if (prev.includes(id)) return prev;
  //       return [...prev, id];
  //     } else {
  //       return prev.filter((x) => x !== id);
  //     }
  //   });
  // };

  //   // ✅ Fetch Cart Items
  //   const fetchCart = async () => {
  //     try {
  //       setLoading(true);
  //       const res = await axios.get(`${BASE_URL}/api/cart/${user.customer_id}`);
  //       if (res.data.success) setCartItems(res.data.data);
  //     } catch (error) {
  //       console.error("Error fetching cart:", error.message);
  //       Alert.alert("❌ Failed to load cart");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  // // ✅ Increase Quantity
  // const increaseQty = async (id) => {

  //   try {
  //     setCartItems((prev) =>
  //       prev.map((item) =>
  //         item.id === id ? { ...item, quantity: item.quantity + 1 } : item
  //       )
  //     );
  //     await axios.put(`${BASE_URL}/api/cart/increment/${id}`);
  //   } catch (err) {
  //     console.error("Error incrementing quantity:", err.message);
  //     fetchCart();
  //   }
  // };

  // // ✅ Decrease Quantity
  // const decreaseQty = async (id) => {
  //   try {
  //     setCartItems((prev) =>
  //       prev.map((item) =>
  //         item.id === id && item.quantity > 1
  //           ? { ...item, quantity: item.quantity - 1 }
  //           : item
  //       )
  //     );
  //     await axios.put(`${BASE_URL}/api/cart/decrement/${id}`);
  //   } catch (err) {
  //     console.error("Error decrementing quantity:", err.message);
  //     fetchCart();
  //   }
  // };

  // // ✅ Remove Item from Cart
  // const removeItem = async (id) => {
  //   try {
  //     setCartItems((prev) => prev.filter((item) => item.id !== id));
  //     await axios.delete(`${BASE_URL}/api/cart/delete/${id}`);
  //     Alert.alert("🗑️ Removed from cart!");
  //   } catch (err) {
  //     console.error("Error removing item:", err.message);
  //   }
  // };






  // helper to add/remove pending id
  const setPending = (id, val) => {
    setPendingIds((prev) => {
      if (val) {
        if (prev.includes(id)) return prev;
        return [...prev, id];
      } else {
        return prev.filter((x) => x !== id);
      }
    });
  };

  // fetchCart unchanged (kept for completeness)
  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/cart/${user.customer_id}`);
      if (res.data.success) setCartItems(res.data.data);
    } catch (error) {
      console.error("Error fetching cart:", error.message);
      Alert.alert("❌ Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  // Increase Quantity (with pending guard)
  const increaseQty = async (id) => {
    if (pendingIds.includes(id)) return; // already updating
    setPending(id, true);

    // optimistic UI update
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item))
    );

    try {
      await axios.put(`${BASE_URL}/api/cart/increment/${id}`);
      // optionally: we could re-fetch single item or rely on success; we'll keep optimistic UI
    } catch (err) {
      console.error("Error incrementing quantity:", err.message);
      // revert by refetching server state
      await fetchCart();
    } finally {
      setPending(id, false);
    }
  };

  // Decrease Quantity (with pending guard)
  const decreaseQty = async (id) => {
    if (pendingIds.includes(id)) return;
    setPending(id, true);

    // optimistic UI update but guard not to drop below 1
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
      )
    );

    try {
      await axios.put(`${BASE_URL}/api/cart/decrement/${id}`);
    } catch (err) {
      console.error("Error decrementing quantity:", err.message);
      await fetchCart();
    } finally {
      setPending(id, false);
    }
  };

  // Remove Item similar: prevent double tap
  const removeItem = async (id) => {
    if (pendingIds.includes(id)) return;
    setPending(id, true);
    // optimistic removal:
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    try {
      await axios.delete(`${BASE_URL}/api/cart/delete/${id}`);
      Alert.alert("🗑️ Removed from cart!");
    } catch (err) {
      console.error("Error removing item:", err.message);
      await fetchCart();
    } finally {
      setPending(id, false);
    }
  };

  // New: ensure Checkout uses server-confirmed cart
  const handleProceedToCheckout = async () => {
    try {
      setLoading(true);
      await fetchCart(); // refresh from server (wait for it)
      // compute totals again from the up-to-date cartItems
      const itemAmount = cartItems.reduce(
        (sum, item) => sum + parseFloat(item.product.price) * item.quantity,
        0
      );
      const discount = cartItems.reduce(
        (sum, item) =>
          sum +
          (parseFloat(item.product.price) * item.quantity * parseFloat(item.product.discount_percent)) /
          100,
        0
      );
      const totalAmount = itemAmount - discount;

      navigation.navigate("Checkout", {
        itemAmount,
        discount,
        totalAmount,
      });
    } catch (err) {
      console.error("Error preparing checkout:", err.message);
      Alert.alert("❌ Could not prepare checkout. Try again.");
    } finally {
      setLoading(false);
    }
  };



  // ✅ Totals
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

  // ✅ Render Item
  const renderItem = ({ item }) => {
    // const isWishlisted = !!wishlist[item.product.model_id];

    return (
      <View style={styles.card}>
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
            <TouchableOpacity onPress={() => decreaseQty(item.id)} disabled={pendingIds.includes(item.id)} >
              <Ionicons name="remove-circle-outline" size={24} color={pendingIds.includes(item.id) ? "#ccc" : "#548c5c"} />
            </TouchableOpacity>
            <Text style={styles.qty}>{item.quantity}</Text>
            <TouchableOpacity onPress={() => increaseQty(item.id)} disabled={pendingIds.includes(item.id)}>
              <Ionicons name="add-circle-outline" size={24} color={pendingIds.includes(item.id) ? "#ccc" : "#548c5c"} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.iconColumn}>


          <TouchableOpacity onPress={() => removeItem(item.id)}>
            <Ionicons name="trash-outline" size={22} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

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
        {/* <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity> */}
        <View style={{ width: 45, alignItems: 'flex-start' }}>
          <GoHomeButton />
        </View>
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

      {/* Totals */}
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
          {/* 
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={() => navigation.navigate("Checkout", {
              itemAmount,
              discount,
              totalAmount,
            })

            }
          >
            <Text style={styles.checkoutText}>Proceed to Checkout</Text>
          </TouchableOpacity> */}

          <TouchableOpacity style={styles.checkoutButton} onPress={handleProceedToCheckout}>
            <Text style={styles.checkoutText}>Proceed to Checkout</Text>
          </TouchableOpacity>

        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#fff",
    elevation: 4,
  },
  headerTitle: { fontSize: 18, fontWeight: "bold" },
  card: {
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
    resizeMode: "contain", // ✅ fits image perfectly inside card
  },
  details: { flex: 1, marginLeft: 12, justifyContent: "space-between" },
  name: { fontSize: 15, fontWeight: "600", color: "#333" },
  segment: { fontSize: 13, color: "#777", marginVertical: 2 },
  price: { fontSize: 15, color: "#548c5c", fontWeight: "bold" },
  qtyRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  qty: { marginHorizontal: 10, fontSize: 15, color: "#333" },
  // iconColumn: { alignItems: "center", justifyContent: "space-between" },
  iconColumn: {
    justifyContent: "flex-end", // push content to bottom
    alignItems: "center",
    width: 40, // fixed width for alignment
    marginBottom: 20
  },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", marginTop: 80 },
  emptyText: { color: "#888", marginTop: 10, fontSize: 16 },
  totalsContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderTopWidth: 1,
    borderColor: "#eee",
    elevation: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  label: { color: "#666" },
  value: { color: "#333", fontWeight: "600" },
  totalLabel: { fontSize: 16, fontWeight: "bold", color: "#000" },
  totalValue: { fontSize: 16, fontWeight: "bold", color: "#548c5c" },
  checkoutButton: {
    backgroundColor: "#548c5c",
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 10,
  },
  checkoutText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
});
