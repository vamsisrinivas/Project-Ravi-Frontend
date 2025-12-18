



import React, { useEffect } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCart } from "../Context/CartContext";
import BASE_URL from "../Config/api";
import CartButton from "./AddtoCart"; // 👈 new import

const SearchwithCart = ({ searchValue, onSearchChange, onCartPress }) => {
  const { setCartCount } = useCart();

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (!storedUser) return;

        const user = JSON.parse(storedUser);
        const customer_id = user.customer_id;

        const res = await axios.get(
          `${BASE_URL}/api/cart/count/${customer_id}`
        );

        if (res.data && res.data.count !== undefined) {
          setCartCount(res.data.count);
        }
      } catch (error) {
        console.error("Error fetching cart count:", error);
      }
    };

    fetchCartCount();
    const interval = setInterval(fetchCartCount, 5000); // ⏳ safer than 100ms
    return () => clearInterval(interval);
  }, [setCartCount]);

  return (
    <View style={styles.container}>
      {/* 🔍 Search Box */}
      <View style={styles.searchBox}>
        <Ionicons
          name="search-outline"
          size={20}
          color="#020202ff"
          style={{ marginRight: 6 }}
        />
        <TextInput
          placeholder="Search for a product"
          placeholderTextColor="#131212ff"
          value={searchValue}
          onChangeText={onSearchChange}
          style={styles.input}
        />
      </View>

      {/* 🛒 Cart Button */}
      <CartButton onCartPress={onCartPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 40,
    elevation: 2,
    shadowColor: "#db0707ff",
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  input: { flex: 1, fontSize: 14, color: "#333" },
});

export default SearchwithCart;
