// hooks/useAddToCart.js
import { useState } from "react";
import { Alert } from "react-native";
import axios from "axios";
import { useCart } from "../Context/CartContext";
import BASE_URL from "../Config/api";
import Toast from "react-native-toast-message";

export default function useAddToCart(customer_id) {
  const { setCartCount } = useCart();
  const [loading, setLoading] = useState(false);

  const addToCart = async (item, quantity = 1) => {
    if (!customer_id) {
      Toast.show({
        type: "error",
        text1: "Login Required",
        text2: "Please login before adding to cart.",
        position: "bottom",
        visibilityTime: 3000,
        text1Style: { fontSize: 18, fontWeight: "bold" },
        text2Style: { fontSize: 16 },
      });
      return;
    }

    try {
      setLoading(true);

      const payload = {
        customer_id,
        model_id: item.id, // ✅ use item.id
        quantity,
      };

      console.log("Payload:", payload);

      const res = await axios.post(`${BASE_URL}/api/cart`, payload);

      console.log("API response:", res.data);

      if (res.data.success === 1 || res.data.success === true) {
        // Alert.alert("Success", `Added ${quantity} × ${item.model_name} to cart`);


        Toast.show({
          type: "success",
          text1: "Added to Cart ✅",
          text2: `${quantity} × ${item.model_name} added successfully`,
          position: "bottom",
          visibilityTime: 3000,
          text1Style: { fontSize: 15, fontWeight: "bold" }, // Large toast
          text2Style: { fontSize: 12 },
        });

        // ✅ immediately update cart badge
        if (res.data.newCount !== undefined) {
          setCartCount(res.data.newCount);
        } else {
          setCartCount((prev) => prev + quantity);
        }
      } else {
        // Alert.alert("Error", res.data.message || "Something went wrong");
        Toast.show({
          type: "error",
          text1: "Error",
          text2: res.data.message || "Something went wrong",
          position: "bottom",
          text1Style: { fontSize: 15, fontWeight: "bold" },
          text2Style: { fontSize: 12 },
        });
      }
    } catch (error) {
      console.error("Add to Cart error:", error);
      // Alert.alert("Error", "Failed to add item to cart");
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to add item to cart",
        position: "bottom",
        text1Style: { fontSize: 15, fontWeight: "bold" },
        text2Style: { fontSize: 12 },
      });
    } finally {
      setLoading(false);
    }
  };

  return { addToCart, loading };
}
