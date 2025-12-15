

// import React, { useContext, useEffect } from "react";
// import {
//     View,
//     Text,
//     Image,
//     TouchableOpacity,
//     StyleSheet,
//     FlatList,
//     SafeAreaView,
//     ActivityIndicator,
//     Dimensions,
// } from "react-native";
// import Ionicons from "react-native-vector-icons/Ionicons";

// import { AuthContext } from "../Context/AuthContext";
// import { WishlistContext } from "../Context/WishlistContext";
// import useAddToCart from "../Components/AddToCartFun";

// const { width } = Dimensions.get("window");

// export default function WishlistScreen({ navigation }) {
//     const { user } = useContext(AuthContext);
//     const customer_id = user?.customer_id;

//     const { wishlistArray, removeFromWishlist, fetchWishlist, addToWishlist, loading } =
//         useContext(WishlistContext);

//     const { addToCart, loading: cartLoading } = useAddToCart(customer_id);

//     useEffect(() => {
//         fetchWishlist();
//     }, [customer_id]);

//     const handleAddToCartAndRemove = async (item) => {
//         const product = item.product || item.model || item;
//         try {
//             await addToCart(product, 1);
//             await removeFromWishlist(item.model_id || product.id);
//             navigation.navigate("Home", { screen: "CartScreen" });
//         } catch (err) {
//             console.error("Error in AddToCart+Remove:", err.message);
//         }
//     };

//     const handleBuyNow = async (item) => {
//         const product = item.product || item.model || item;
//         try {
//             // Step 1: Add to cart (reuse your hook)
//             await addToCart(product, 1);
//             await removeFromWishlist(item.model_id || product.id);
//             // Step 2: Navigate to Checkout
//             navigation.navigate("Home", { screen: "CartScreen" });
//         } catch (error) {
//             console.error("Buy Now error:", error);
//             Toast.show({
//                 type: "error",
//                 text1: "Failed to process Buy Now",
//                 text2: "Please try again later",
//             });
//         }
//     };
//     const renderItem = ({ item }) => {
//         const product = item.product || item.model || item;
//         return (
//             <View style={styles.card}>
//                 <TouchableOpacity
//                     onPress={() =>
//                         navigation.navigate("Home", {
//                             screen: "ProductDetailPage",
//                             params: { product },
//                         })
//                     }
//                     activeOpacity={0.9}
//                 >
//                     <Image source={{ uri: product.model_image }} style={styles.image} />
//                 </TouchableOpacity>

//                 <View style={styles.details}>
//                     <Text style={styles.name} numberOfLines={1}>
//                         {product.model_name}
//                     </Text>
//                     <Text style={styles.segment} numberOfLines={2}>
//                         {product.segment}
//                     </Text>
//                     <Text style={styles.price}>₹ {product.price}</Text>

//                     <View style={styles.buttonRow}>
//                         <TouchableOpacity
//                             style={styles.cartBtn}
//                             onPress={() => handleAddToCartAndRemove(item)}
//                             disabled={cartLoading}
//                         >
//                             <Ionicons name="cart-outline" size={18} color="#fff" />
//                             <Text style={styles.btnText}>Add to Cart</Text>
//                         </TouchableOpacity>

//                         <TouchableOpacity style={styles.buyBtn} onPress={() => handleBuyNow(item)}>
//                             <Ionicons name="flash-outline" size={18} color="#fff" />
//                             <Text style={styles.btnText}>Buy Now</Text>
//                         </TouchableOpacity>
//                     </View>
//                 </View>

//                 <TouchableOpacity
//                     style={styles.favoriteBtn}
//                     onPress={() =>
//                         wishlistArray.some((w) => w.model_id === product.id)
//                             ? removeFromWishlist(product.id)
//                             : addToWishlist(product.id, product)
//                     }
//                 >
//                     <Ionicons
//                         name={wishlistArray.some((w) => w.model_id === product.id) ? "heart" : "heart-outline"}
//                         size={24}
//                         color="#ff4081"
//                     />
//                 </TouchableOpacity>
//             </View>
//         );
//     };

//     if (loading) {
//         return (
//             <View style={styles.loader}>
//                 <ActivityIndicator size="large" color="#548c5c" />
//             </View>
//         );
//     }

//     return (
//         <SafeAreaView style={styles.container}>
//             <View style={styles.header}>
//                 <TouchableOpacity onPress={() => navigation.goBack()}>
//                     <Ionicons name="arrow-back" size={24} color="#000" />
//                 </TouchableOpacity>
//                 <Text style={styles.headerTitle}>My Wishlist</Text>
//                 <TouchableOpacity onPress={fetchWishlist}>
//                     <Ionicons name="refresh" size={24} color="#000" />
//                 </TouchableOpacity>
//             </View>

//             <FlatList
//                 data={wishlistArray}
//                 keyExtractor={(item, index) => item.model_id?.toString() || index.toString()}
//                 renderItem={renderItem}
//                 contentContainerStyle={{ padding: 12 }}
//                 ListEmptyComponent={
//                     <View style={styles.emptyContainer}>
//                         <Ionicons name="heart-outline" size={80} color="#ccc" />
//                         <Text style={styles.emptyText}>No items in wishlist</Text>
//                     </View>
//                 }
//             />
//         </SafeAreaView>
//     );
// }

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: "#f5f5f5" },
//     loader: { flex: 1, justifyContent: "center", alignItems: "center" },
//     header: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         alignItems: "center",
//         paddingVertical: 12,
//         paddingHorizontal: 16,
//         backgroundColor: "#fff",
//         elevation: 3,
//     },
//     headerTitle: { fontSize: 22, fontWeight: "700", color: "#222" },
//     card: {
//         flexDirection: "row",
//         backgroundColor: "#fff",
//         borderRadius: 16,
//         padding: 12,
//         marginBottom: 14,
//         width: width - 24,
//         alignSelf: "center",
//         shadowColor: "#000",
//         shadowOpacity: 0.1,
//         shadowRadius: 6,
//         shadowOffset: { width: 0, height: 4 },
//         elevation: 4,
//     },
//     image: {
//         width: 120,          // maximum width
//         height: 120,         // maximum height
//         borderRadius: 8,
//         marginRight: 14,
//         resizeMode: "contain", // maintains aspect ratio
//     },

//     details: { flex: 1, justifyContent: "space-between" },
//     name: { fontSize: 17, fontWeight: "700", color: "#111" },
//     segment: { fontSize: 13, color: "#666", marginVertical: 2 },
//     price: { fontSize: 16, color: "#2e7d32", fontWeight: "bold" },
//     buttonRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 9 },
//     cartBtn: {
//         flexDirection: "row",
//         alignItems: "center",
//         backgroundColor: "#548c5c",
//         paddingVertical: 6,
//         paddingHorizontal: 6,
//         borderRadius: 12,
//         margin: 2,

//     },
//     buyBtn: {
//         flexDirection: "row",
//         margin: 2,
//         alignItems: "center",
//         backgroundColor: "#ff8800",
//         paddingVertical: 6,
//         paddingHorizontal: 6,
//         borderRadius: 12,
//     },
//     btnText: { color: "#fff", fontSize: 11, fontWeight: "400", marginLeft: 5 },
//     favoriteBtn: { position: "absolute", top: 12, right: 12 },
//     emptyContainer: { alignItems: "center", marginTop: 80 },
//     emptyText: { fontSize: 18, color: "#777", marginTop: 12 },
// });



import React, { useContext, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import { AuthContext } from "../Context/AuthContext";
import { WishlistContext } from "../Context/WishlistContext";
import useAddToCart from "../Components/AddToCartFun";

const { width } = Dimensions.get("window");

export default function WishlistScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const customer_id = user?.customer_id;

  const {
    wishlistArray,
    removeFromWishlist,
    fetchWishlist,
    addToWishlist,
    loading,
  } = useContext(WishlistContext);

  const { addToCart, loading: cartLoading } = useAddToCart(customer_id);

  useEffect(() => {
    console.log("📌 Wishlist Array:", wishlistArray);
    fetchWishlist();
  }, [customer_id]);

  const handleAddToCartAndRemove = async (item) => {
    const product = item.product || item.model || item;
    await addToCart(product, 1);
    await removeFromWishlist(product.id);
    navigation.navigate("Home", { screen: "CartScreen" });
  };

  const handleBuyNow = async (item) => {
    const product = item.product || item.model || item;
    await addToCart(product, 1);
    await removeFromWishlist(product.id);
    navigation.navigate("Home", { screen: "CartScreen" });
  };

  const renderItem = ({ item }) => {
    const product = item.product || item.model || item;

    const availableStock = Number(product.available_stock ?? 0);
    const isOutOfStock = availableStock <= 0;

    return (
      <View style={styles.card}>
        {/* Image */}
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Home", {
              screen: "ProductDetailPage",
              params: { product },
            })
          }
          activeOpacity={0.9}
        >
          <Image
            source={{ uri: product.model_image }}
            style={styles.image}
          />
        </TouchableOpacity>

        {/* Details */}
        <View style={styles.details}>
          <Text style={styles.name} numberOfLines={1}>
            {product.model_name}
          </Text>
          <Text style={styles.segment} numberOfLines={2}>
            {product.segment}
          </Text>
          <Text style={styles.price}>₹ {product.price}</Text>

          {/* 🔴 OUT OF STOCK UI */}
          {isOutOfStock ? (
            <View style={styles.outOfStockBtn}>
              <Ionicons name="close-circle" size={18} color="#fff" />
              <Text style={styles.outOfStockText}>Out of Stock</Text>
            </View>
          ) : (
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.cartBtn}
                onPress={() => handleAddToCartAndRemove(item)}
                disabled={cartLoading}
              >
                <Ionicons name="cart-outline" size={16} color="#fff" />
                <Text style={styles.btnText}>Add to Cart</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.buyBtn}
                onPress={() => handleBuyNow(item)}
              >
                <Ionicons name="flash-outline" size={16} color="#fff" />
                <Text style={styles.btnText}>Buy Now</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Wishlist Heart */}
        <TouchableOpacity
          style={styles.favoriteBtn}
          onPress={() =>
            wishlistArray.some((w) => w.model_id === product.id)
              ? removeFromWishlist(product.id)
              : addToWishlist(product.id, product)
          }
        >
          <Ionicons
            name={
              wishlistArray.some((w) => w.model_id === product.id)
                ? "heart"
                : "heart-outline"
            }
            size={24}
            color="#ff4081"
          />
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
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Wishlist</Text>
        <TouchableOpacity onPress={fetchWishlist}>
          <Ionicons name="refresh" size={24} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={wishlistArray}
        keyExtractor={(item, index) =>
          item.model_id?.toString() || index.toString()
        }
        renderItem={renderItem}
        contentContainerStyle={{ padding: 12 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="heart-outline" size={80} color="#ccc" />
            <Text style={styles.emptyText}>No items in wishlist</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    backgroundColor: "#fff",
    elevation: 3,
  },
  headerTitle: { fontSize: 20, fontWeight: "700" },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    marginBottom: 14,
    width: width - 24,
    alignSelf: "center",
    elevation: 4,
  },

  image: {
    width: 110,
    height: 110,
    resizeMode: "contain",
    borderRadius: 8,
    marginRight: 12,
  },

  details: { flex: 1, justifyContent: "space-between" },
  name: { fontSize: 16, fontWeight: "700" },
  segment: { fontSize: 13, color: "#666", marginVertical: 2 },
  price: { fontSize: 16, fontWeight: "bold", color: "#2e7d32" },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },

  cartBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#548c5c",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 12,
  },

  buyBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ff8800",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 12,
  },

  btnText: { color: "#fff", fontSize: 12, marginLeft: 4 },

  outOfStockBtn: {
    marginTop: 10,
    backgroundColor: "#b00020",
    borderRadius: 12,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },

  outOfStockText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 6,
  },

  favoriteBtn: { position: "absolute", top: 12, right: 12 },

  emptyContainer: { alignItems: "center", marginTop: 80 },
  emptyText: { fontSize: 18, color: "#777", marginTop: 12 },
});
