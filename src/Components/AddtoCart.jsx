import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useCart } from "../Context/CartContext";

const CartButton = ({ onCartPress }) => {
  const { cartCount } = useCart();

  return (
    <TouchableOpacity style={styles.cartButton} onPress={onCartPress}>
      <Ionicons name="cart-outline" size={22} color="#fff" />
      {cartCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{cartCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cartButton: {
    marginLeft: 8,
    backgroundColor: "#00A000",
    borderRadius: 8,
    padding: 10,
    elevation: 2,
  },
  badge: {
    position: "absolute",
    right: -2,
    top: -2,
    backgroundColor: "red",
    borderRadius: 10,
    paddingHorizontal: 5,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default CartButton;
