





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
// // import { WishlistContext } from "../Context/WishlistContext"; // ✅ import global wishlist
// import axios from "axios";
// import BASE_URL from "../Config/api";
// import { useIsFocused } from "@react-navigation/native"; // ✅ add this at top
// import GoHomeButton from "../Components/GoHomeButton";

// export default function CartScreen({ navigation }) {
//   const { user } = useContext(AuthContext);
//   // const { wishlist, addToWishlist, removeFromWishlist } = useContext(WishlistContext);
//   const [cartItems, setCartItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [pendingIds, setPendingIds] = useState([]); // <--- track pending updates
//   const isFocused = useIsFocused(); // ✅ track if screen is visible

//   // 🔁 Fetch cart every time the screen is focused
//   useEffect(() => {
//     if (isFocused) {
//       fetchCart();
//     }
//   }, [isFocused]);

//   // fetchCart unchanged (kept for completeness)
//   // const fetchCart = async () => {
//   //   try {
//   //     setLoading(true);
//   //     const res = await axios.get(`${BASE_URL}/api/cart/${user.customer_id}`);
//   //     if (res.data.success) setCartItems(res.data.data);
//   //   } catch (error) {
//   //     console.error("Error fetching cart:", error.message);
//   //     Alert.alert("❌ Failed to load cart");
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

// const fetchCart = async () => {
//   try {
//     setLoading(true);

//     const res = await axios.get(
//       `${BASE_URL}/api/cart/${user.customer_id}`
//     );

//     if (!res.data.success) return;

//     const items = res.data.data || [];

//     // ✅ show cart immediately
//     setCartItems(items);

//     // 🔥 remove ONLY confirmed out-of-stock items
//     const outOfStockItems = items.filter((item) =>
//       isOutOfStock(item.product)
//     );

//     if (outOfStockItems.length > 0) {
//       await Promise.all(
//         outOfStockItems.map((item) =>
//           axios.delete(`${BASE_URL}/api/cart/delete/${item.id}`)
//         )
//       );

//       Alert.alert(
//         "⚠️ Out of Stock",
//         "Some items were removed because they are no longer available."
//       );

//       const fresh = await axios.get(
//         `${BASE_URL}/api/cart/${user.customer_id}`
//       );

//       if (fresh.data.success) {
//         setCartItems(fresh.data.data);
//       }
//     }
//   } catch (e) {
//     console.error("Cart error:", e.message);
//     Alert.alert("❌ Failed to load cart");
//   } finally {
//     setLoading(false);
//   }
// };





//   // helper to add/remove pending id


//   const setPending = (id, val) => {
//     setPendingIds((prev) => {
//       if (val) {
//         if (prev.includes(id)) return prev;
//         return [...prev, id];
//       } else {
//         return prev.filter((x) => x !== id);
//       }
//     });
//   };


//   // Increase Quantity (with pending guard)
//   const increaseQty = async (id) => {
//     if (pendingIds.includes(id)) return; // already updating
//     setPending(id, true);

//     // optimistic UI update
//     setCartItems((prev) =>
//       prev.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item))
//     );

//     try {
//       await axios.put(`${BASE_URL}/api/cart/increment/${id}`);
//       // optionally: we could re-fetch single item or rely on success; we'll keep optimistic UI
//     } catch (err) {
//       console.error("Error incrementing quantity:", err.message);
//       // revert by refetching server state
//       await fetchCart();
//     } finally {
//       setPending(id, false);
//     }
//   };

//   // Decrease Quantity (with pending guard)
//   const decreaseQty = async (id) => {
//     if (pendingIds.includes(id)) return;
//     setPending(id, true);

//     // optimistic UI update but guard not to drop below 1
//     setCartItems((prev) =>
//       prev.map((item) =>
//         item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
//       )
//     );

//     try {
//       await axios.put(`${BASE_URL}/api/cart/decrement/${id}`);
//     } catch (err) {
//       console.error("Error decrementing quantity:", err.message);
//       await fetchCart();
//     } finally {
//       setPending(id, false);
//     }
//   };

//   // Remove Item similar: prevent double tap
//   const removeItem = async (id) => {
//     if (pendingIds.includes(id)) return;
//     setPending(id, true);
//     // optimistic removal:
//     setCartItems((prev) => prev.filter((item) => item.id !== id));
//     try {
//       await axios.delete(`${BASE_URL}/api/cart/delete/${id}`);
//       Alert.alert("🗑️ Removed from cart!");
//     } catch (err) {
//       console.error("Error removing item:", err.message);
//       await fetchCart();
//     } finally {
//       setPending(id, false);
//     }
//   };

//   // New: ensure Checkout uses server-confirmed cart
//   // const handleProceedToCheckout = async () => {
//   //   try {
//   //     setLoading(true);
//   //     await fetchCart(); // refresh from server (wait for it)
//   //     // compute totals again from the up-to-date cartItems
//   //     const itemAmount = cartItems.reduce(
//   //       (sum, item) => sum + parseFloat(item.product.price) * item.quantity,
//   //       0
//   //     );
//   //     const discount = cartItems.reduce(
//   //       (sum, item) =>
//   //         sum +
//   //         (parseFloat(item.product.price) * item.quantity * parseFloat(item.product.discount_percent)) /
//   //         100,
//   //       0
//   //     );
//   //     const totalAmount = itemAmount - discount;

//   //     navigation.navigate("Checkout", {
//   //       itemAmount,
//   //       discount,
//   //       totalAmount,
//   //     });
//   //   } catch (err) {
//   //     console.error("Error preparing checkout:", err.message);
//   //     Alert.alert("❌ Could not prepare checkout. Try again.");
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

// const handleProceedToCheckout = async () => {
//   try {
//     setLoading(true);

//     const res = await axios.get(
//       `${BASE_URL}/api/cart/${user.customer_id}`
//     );

//     if (!res.data.success) return;

//     const items = res.data.data || [];

//     // 🔐 Final safety check
// const hasOutOfStock = items.some((item) =>
//   isOutOfStock(item.product)
// );



//     if (hasOutOfStock) {
//       Alert.alert(
//         "⚠️ Stock Updated",
//         "Some items went out of stock and were removed."
//       );
//       await fetchCart();
//       return;
//     }

//     const itemAmount = items.reduce(
//       (sum, item) =>
//         sum + Number(item.product.price) * item.quantity,
//       0
//     );

//     const discount = items.reduce(
//       (sum, item) =>
//         sum +
//         (Number(item.product.price) *
//           item.quantity *
//           Number(item.product.discount_percent || 0)) /
//           100,
//       0
//     );

//     navigation.navigate("Checkout", {
//       itemAmount,
//       discount,
//       totalAmount: itemAmount - discount,
//     });
//   } catch (err) {
//     console.error("Checkout error:", err.message);
//     Alert.alert("❌ Could not proceed to checkout");
//   } finally {
//     setLoading(false);
//   }
// };



//   // ✅ SAFE TOTALS (NO CRASH EVER)
//   const itemAmount = cartItems.reduce(
//     (sum, item) =>
//       item.product ? sum + Number(item.product.price) * item.quantity : sum,
//     0
//   );

//   const discount = cartItems.reduce(
//     (sum, item) =>
//       item.product
//         ? sum +
//         (Number(item.product.price) *
//           item.quantity *
//           Number(item.product.discount_percent || 0)) /
//         100
//         : sum,
//     0
//   );

//   const totalAmount = itemAmount - discount;




//   // ✅ Render Item
//   const renderItem = ({ item }) => {
//     // const isWishlisted = !!wishlist[item.product.model_id];
// const outOfStock = isOutOfStock(item.product);


//     // 🚨 PRODUCT MISSING
//     if (!item.product) {
//       return (
//         <View style={styles.card}>
//           <Text style={{ color: "red", fontWeight: "700" }}>
//             Product unavailable
//           </Text>
//           <TouchableOpacity onPress={() => removeItem(item.id)}>
//             <Ionicons name="trash-outline" size={22} color="red" />
//           </TouchableOpacity>
//         </View>
//       );
//     }


//     return (
//       <View style={styles.card}>
//         {/* Product Image */}
//         <TouchableOpacity
//           activeOpacity={0.9}
//           onPress={() =>
//             navigation.navigate("ProductDetailPage", { product: item.product })
//           }
//           style={styles.imageContainer}
//         >
//           <Image
//             source={{ uri: item.product.model_image }}
//             style={styles.image}
//           />
//         </TouchableOpacity>

//         {/* Product Details */}
//         <View style={styles.details}>
//           <Text style={styles.name} numberOfLines={1}>
//             {item.product.model_name}
//           </Text>
//           <Text style={styles.segment}>{item.product.segment}</Text>
//           <Text style={styles.price}>₹ {item.product.price}</Text>

//           {outOfStock && (
//             <Text style={{ color: "red", fontWeight: "700" }}>
//               Out of Stock
//             </Text>
//           )}

//           <View style={styles.qtyRow}>
//             <TouchableOpacity onPress={() => decreaseQty(item.id)} disabled={outOfStock || pendingIds.includes(item.id)} >
//               <Ionicons name="remove-circle-outline" size={24} color={outOfStock ? "#ccc" : "#548c5c"} />
//             </TouchableOpacity>
//             <Text style={styles.qty}>{item.quantity}</Text>
//             <TouchableOpacity onPress={() => increaseQty(item.id)} disabled={outOfStock || pendingIds.includes(item.id)}>
//               <Ionicons name="add-circle-outline" size={24} color={outOfStock ? "#ccc" : "#548c5c"} />
//             </TouchableOpacity>
//           </View>
//         </View>

//         <View style={styles.iconColumn}>


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
//         {/* <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={24} color="#000" />
//         </TouchableOpacity> */}
//         <View style={{ width: 45, alignItems: 'flex-start' }}>
//           <GoHomeButton />
//         </View>
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
//           {/* 
//           <TouchableOpacity
//             style={styles.checkoutButton}
//             onPress={() => navigation.navigate("Checkout", {
//               itemAmount,
//               discount,
//               totalAmount,
//             })

//             }
//           >
//             <Text style={styles.checkoutText}>Proceed to Checkout</Text>
//           </TouchableOpacity> */}

//           <TouchableOpacity style={styles.checkoutButton} onPress={handleProceedToCheckout}>
//             <Text style={styles.checkoutText}>Proceed to Checkout</Text>
//           </TouchableOpacity>

//         </View>
//       )}
//     </SafeAreaView>
//   );
// }


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
import axios from "axios";
import BASE_URL from "../Config/api";
import { useIsFocused } from "@react-navigation/native";
import GoHomeButton from "../Components/GoHomeButton";

export default function CartScreen({ navigation }) {
  const { user } = useContext(AuthContext);

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingIds, setPendingIds] = useState([]);
  const isFocused = useIsFocused();

  // 🔐 SINGLE SOURCE OF TRUTH FOR STOCK CHECK
  const isOutOfStock = (product) => {
    if (!product) return true;

    // If backend does NOT send stock → treat as IN STOCK
    if (
      product.available_stock === undefined ||
      product.available_stock === null
    ) {
      return false;
    }

    return Number(product.available_stock) <= 0;
  };

  // 🔁 Fetch cart when screen focused
  useEffect(() => {
    if (isFocused) {
      fetchCart();
    }
  }, [isFocused]);

  const fetchCart = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${BASE_URL}/api/cart/${user.customer_id}`
      );

      if (!res.data.success) return;

      const items = res.data.data || [];

      // ✅ show items first
      setCartItems(items);

      // 🔥 remove ONLY real out-of-stock items
      const outOfStockItems = items.filter((item) =>
        isOutOfStock(item.product)
      );

      if (outOfStockItems.length > 0) {
        await Promise.all(
          outOfStockItems.map((item) =>
            axios.delete(`${BASE_URL}/api/cart/delete/${item.id}`)
          )
        );

        Alert.alert(
          "⚠️ Out of Stock",
          "Some items were removed because they are no longer available."
        );

        const fresh = await axios.get(
          `${BASE_URL}/api/cart/${user.customer_id}`
        );

        if (fresh.data.success) {
          setCartItems(fresh.data.data);
        }
      }
    } catch (e) {
      console.error("Cart error:", e.message);
      Alert.alert("❌ Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  // helper to lock buttons
  const setPending = (id, val) => {
    setPendingIds((prev) =>
      val ? [...new Set([...prev, id])] : prev.filter((x) => x !== id)
    );
  };

  const increaseQty = async (id) => {
    if (pendingIds.includes(id)) return;
    setPending(id, true);

    setCartItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, quantity: i.quantity + 1 } : i
      )
    );

    try {
      await axios.put(`${BASE_URL}/api/cart/increment/${id}`);
    } catch {
      await fetchCart();
    } finally {
      setPending(id, false);
    }
  };

  const decreaseQty = async (id) => {
    if (pendingIds.includes(id)) return;
    setPending(id, true);

    setCartItems((prev) =>
      prev.map((i) =>
        i.id === id && i.quantity > 1
          ? { ...i, quantity: i.quantity - 1 }
          : i
      )
    );

    try {
      await axios.put(`${BASE_URL}/api/cart/decrement/${id}`);
    } catch {
      await fetchCart();
    } finally {
      setPending(id, false);
    }
  };

  const removeItem = async (id) => {
    if (pendingIds.includes(id)) return;
    setPending(id, true);

    setCartItems((prev) => prev.filter((i) => i.id !== id));

    try {
      await axios.delete(`${BASE_URL}/api/cart/delete/${id}`);
    } catch {
      await fetchCart();
    } finally {
      setPending(id, false);
    }
  };

  const handleProceedToCheckout = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${BASE_URL}/api/cart/${user.customer_id}`
      );

      if (!res.data.success) return;

      const items = res.data.data || [];

      const hasOutOfStock = items.some((item) =>
        isOutOfStock(item.product)
      );

      if (hasOutOfStock) {
        Alert.alert(
          "⚠️ Stock Updated",
          "Some items went out of stock and were removed."
        );
        await fetchCart();
        return;
      }

      const itemAmount = items.reduce(
        (s, i) => s + Number(i.product.price) * i.quantity,
        0
      );

      const discount = items.reduce(
        (s, i) =>
          s +
          (Number(i.product.price) *
            i.quantity *
            Number(i.product.discount_percent || 0)) /
            100,
        0
      );

      navigation.navigate("Checkout", {
        itemAmount,
        discount,
        totalAmount: itemAmount - discount,
      });
    } finally {
      setLoading(false);
    }
  };

  const itemAmount = cartItems.reduce(
    (s, i) => (i.product ? s + Number(i.product.price) * i.quantity : s),
    0
  );

  const discount = cartItems.reduce(
    (s, i) =>
      i.product
        ? s +
          (Number(i.product.price) *
            i.quantity *
            Number(i.product.discount_percent || 0)) /
            100
        : s,
    0
  );

  const totalAmount = itemAmount - discount;

  const renderItem = ({ item }) => {
    if (!item.product) {
      return (
        <View style={styles.card}>
          <Text style={{ color: "red", fontWeight: "700" }}>
            Product unavailable
          </Text>
          <TouchableOpacity onPress={() => removeItem(item.id)}>
            <Ionicons name="trash-outline" size={22} color="red" />
          </TouchableOpacity>
        </View>
      );
    }

    const outOfStock = isOutOfStock(item.product);

    return (
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.product.model_image }}
            style={styles.image}
          />
        </View>

        <View style={styles.details}>
          <Text style={styles.name} numberOfLines={1}>
            {item.product.model_name}
          </Text>
          <Text style={styles.segment}>{item.product.segment}</Text>
          <Text style={styles.price}>₹ {item.product.price}</Text>

          {outOfStock && (
            <Text style={{ color: "red", fontWeight: "700" }}>
              Out of Stock
            </Text>
          )}

          <View style={styles.qtyRow}>
            <TouchableOpacity
              disabled={outOfStock || pendingIds.includes(item.id)}
              onPress={() => decreaseQty(item.id)}
            >
              <Ionicons
                name="remove-circle-outline"
                size={24}
                color={outOfStock ? "#ccc" : "#548c5c"}
              />
            </TouchableOpacity>

            <Text style={styles.qty}>{item.quantity}</Text>

            <TouchableOpacity
              disabled={outOfStock || pendingIds.includes(item.id)}
              onPress={() => increaseQty(item.id)}
            >
              <Ionicons
                name="add-circle-outline"
                size={24}
                color={outOfStock ? "#ccc" : "#548c5c"}
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity onPress={() => removeItem(item.id)}>
          <Ionicons name="trash-outline" size={22} color="red" />
        </TouchableOpacity>
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
      <View style={styles.header}>
        <GoHomeButton />
        <Text style={styles.headerTitle}>My Cart</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={cartItems}
        keyExtractor={(i) => i.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 15 }}
      />

      {cartItems.length > 0 && (
        <View style={styles.totalsContainer}>
          <Text>Total: ₹{totalAmount.toFixed(2)}</Text>
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={handleProceedToCheckout}
          >
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
