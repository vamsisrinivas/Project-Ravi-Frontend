

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
import Toast from "react-native-toast-message";

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

    // ✅ navigate first
    navigation.navigate("Home", { screen: "CartScreen" });

    // ✅ add to cart
    await addToCart(product, 1);

    // ✅ remove from wishlist (fire & forget)
    removeFromWishlist(item.model_id);
  };


  const handleBuyNow = async (item) => {
    const product = item.product || item.model || item;
    await addToCart(product, 1);

    navigation.navigate("Home", { screen: "CartScreen" });
    await removeFromWishlist(item.model_id);
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
            // <View style={styles.buttonRow}>
            //   <TouchableOpacity
            //     style={styles.cartBtn}
            //     onPress={() => handleAddToCartAndRemove(item)}
            //     disabled={cartLoading}
            //   >
            //     <Ionicons name="cart-outline" size={16} color="#fff" />
            //     <Text style={styles.btnText}>Add to Cart</Text>
            //   </TouchableOpacity>

            //   <TouchableOpacity
            //     style={styles.buyBtn}
            //     onPress={() => handleBuyNow(item)}
            //   >
            //     <Ionicons name="flash-outline" size={16} color="#fff" />
            //     <Text style={styles.btnText}>Buy Now</Text>
            //   </TouchableOpacity>
            // </View>
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={[
                  styles.actionBtn,
                  styles.cartBtn,
                  cartLoading && { opacity: 0.6 },
                ]}
                onPress={() => handleAddToCartAndRemove(item)}
                disabled={cartLoading}
                activeOpacity={0.85}
              >
                <Ionicons name="cart-outline" size={18} color="#fff" />
                <Text style={styles.actionText}>Add to Cart</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, styles.buyBtn]}
                onPress={() => handleBuyNow(item)}
                activeOpacity={0.85}
              >
                <Ionicons name="flash-outline" size={18} color="#fff" />
                <Text style={styles.actionText}>Buy Now</Text>
              </TouchableOpacity>
            </View>

          )}
        </View>

        {/* Wishlist Heart */}

        {/* ❤️ Wishlist Heart (Remove) */}
        <TouchableOpacity
          style={styles.favoriteBtn}
          onPress={() => {
            removeFromWishlist(item.model_id);
            Toast.show({
              type: "error",
              text1: "Removed from wishlist",
            });
          }}

        >
          <Ionicons
            name="heart"
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
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 6,
  },

  buyBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ff8800",
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 6,
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

  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },

  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 14,
    elevation: 3,
  },

  cartBtn: {
    backgroundColor: "#2e7d32", // premium green
  },

  buyBtn: {
    backgroundColor: "#ff8f00", // rich orange
  },

  actionText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
    marginLeft: 6,
  },

});
