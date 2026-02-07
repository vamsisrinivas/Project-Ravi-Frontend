// // hooks/useAddToCart.js
// import { useState } from "react";
// import { Alert } from "react-native";
// import axios from "axios";
// import { useCart } from "../Context/CartContext";
// import BASE_URL from "../Config/api";
// import Toast from "react-native-toast-message";
// import { showToast } from "./CustomToast";

// export default function useAddToCart(customer_id) {
//   const { setCartCount } = useCart();
//   const [loading, setLoading] = useState(false);

//   const addToCart = async (item, quantity = 1) => {
//     if (!customer_id) {
//       Toast.show({
//         type: "error",
//         text1: "Login Required",
//         text2: "Please login before adding to cart.",
//         position: "bottom",
//         visibilityTime: 3000,
//         text1Style: { fontSize: 18, fontWeight: "bold" },
//         text2Style: { fontSize: 16 },
//       });
//       return;
//     }
//     if (loading) return; // 🔒 prevent double tap

//     try {
//       setLoading(true);

//       const payload = {
//         customer_id,
//         model_id: item.id, // ✅ use item.id
//         quantity,
//       };

//       console.log("Payload:", payload);

//       const res = await axios.post(`${BASE_URL}/api/cart`, payload);

//       console.log("API response:", res.data);

//       if (res.data.success === 1 || res.data.success === true) {


//         showToast("success", "Success!", "Add to Cart successfully!");

//         // ✅ SAFEST: backend should return updated count
//         if (typeof res.data.count === "number") {
//           setCartCount(res.data.count);
//         } else {
//           // fallback: re-fetch count
//           const countRes = await axios.get(
//             `${BASE_URL}/api/cart/count/${customer_id}`
//           );
//           setCartCount(countRes.data.count || 0);
//         }
//       } else {
//         Toast.show({
//           type: "error",
//           text1: res.data?.message || "Failed to add item",
//         });
//       }
//     } catch (error) {
//       console.error("Add to Cart error:", error);
//       // Alert.alert("Error", "Failed to add item to cart");
//       showToast("error", "Error!", "Something went wrong.");

//     } finally {
//       setLoading(false);
//     }
//   };

//   return { addToCart, loading };
// }


// hooks/useAddToCart.js
import { useState } from "react";
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
      });
      return;
    }

    if (loading) return; // 🔒 prevent double tap

    try {
      setLoading(true);

      // const payload = {
      //   customer_id,
      //   model_id: item.id,
      //   quantity,
      // };

      const payload = {
        customer_id,
        model_id: item.model_id ?? item.id, // ✅ FIX
        quantity,
      };


      const res = await axios.post(`${BASE_URL}/api/cart`, payload);

      if (res.data.success) {
        Toast.show({
          type: "success",
          text1: "Added to cart successfully",
        });

        // ✅ safest way: always sync from backend
        const countRes = await axios.get(
          `${BASE_URL}/api/cart/count/${customer_id}`
        );
        setCartCount(countRes.data.count || 0);
      } else {
        Toast.show({
          type: "error",
          text1: res.data?.message || "Failed to add item",
        });
      }
    } catch (error) {
      if (error.response?.status === 400) {
        Toast.show({
          type: "info",
          text1: error.response.data?.message || "Stock limit reached",
        });
        return;
      }

      if (error.response) {
        Toast.show({
          type: "error",
          text1: error.response.data?.message || "Failed to add item",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Network Error",
          text2: "Please try again",
        });
      }

      // ✅ Use log instead of error
      if (__DEV__) {
        console.log("AddToCart handled:", error.message);
      }
    }

    finally {
      setLoading(false);
    }
  };

  return { addToCart, loading };
}
