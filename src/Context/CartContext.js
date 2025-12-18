

// // Context/CartContext.js
// import React, { createContext, useContext, useEffect, useState } from "react";
// import axios from "axios";
// import BASE_URL from "../Config/api";

// const CartContext = createContext();

// export const CartProvider = ({ children }) => {
//   const [cartCount, setCartCount] = useState(0);
//   const [stockMap, setStockMap] = useState({}); // 🔑 model_id → stock

//   // 🧹 Clear cart count
//   const clearCartCount = () => {
//     setCartCount(0);
//   };

//   // 🔄 Fetch stock from backend
//   const fetchStock = async () => {
//     try {
//       const res = await axios.get(`${BASE_URL}/api/stock`);
//       if (res.data.success) {
//         const map = {};
//         res.data.data.forEach((row) => {
//           map[row.model_id] = Number(row.stock || 0);
//         });
//         setStockMap(map);
//       }
//     } catch (err) {
//       console.error("Stock fetch error:", err.message);
//     }
//   };

//   // ⏳ Auto refresh stock
//   useEffect(() => {
//     fetchStock();
//     const interval = setInterval(fetchStock, 5000); // every 5 sec
//     return () => clearInterval(interval);
//   }, []);

//   // ✅ Check stock before allowing quantity change
//   const canAddQuantity = (productId, requestedQty) => {
//     const available = stockMap[productId] ?? 0;
//     return requestedQty <= available;
//   };

//   return (
//     <CartContext.Provider
//       value={{
//         cartCount,
//         setCartCount,
//         clearCartCount,
//         stockMap,
//         canAddQuantity,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error("useCart must be used within a CartProvider");
//   }
//   return context;
// };



// // Context/CartContext.js
// import React, { createContext, useContext, useEffect, useState } from "react";
// import axios from "axios";
// import BASE_URL from "../Config/api";

// const CartContext = createContext();

// export const CartProvider = ({ children }) => {
//   const [cartCount, setCartCount] = useState(0);
//   const [cartItems, setCartItems] = useState([]); // ✅ REQUIRED
//   const [stockMap, setStockMap] = useState({});

//   // 🧮 Fetch cart items
//   const refreshCart = async (customerId) => {
//     const res = await axios.get(
//       `${BASE_URL}/cart/items/${customerId}`
//     );
//     setCartItems(res.data.data || []);
//   };

//   // 🔢 Fetch cart count
//   const syncCartCount = async (customerId) => {
//     const res = await axios.get(
//       `${BASE_URL}/cart/count/${customerId}`
//     );
//     setCartCount(res.data.count || 0);
//   };

//   // 📦 Stock
//   const fetchStock = async () => {
//     try {
//       const res = await axios.get(`${BASE_URL}/api/stock`);
//       if (res.data.success) {
//         const map = {};
//         res.data.data.forEach((row) => {
//           map[row.model_id] = Number(row.stock || 0);
//         });
//         setStockMap(map);
//       }
//     } catch (err) {
//       console.error("Stock fetch error:", err.message);
//     }
//   };

//   useEffect(() => {
//     fetchStock();
//     const interval = setInterval(fetchStock, 5000);
//     return () => clearInterval(interval);
//   }, []);

//   const clearCartCount = () => setCartCount(0);

//   const canAddQuantity = (productId, requestedQty) => {
//     const available = stockMap[productId] ?? 0;
//     return requestedQty <= available;
//   };

//   return (
//     <CartContext.Provider
//       value={{
//         cartItems,          // ✅ FIX
//         setCartItems,
//         cartCount,
//         setCartCount,
//         refreshCart,
//         syncCartCount,
//         clearCartCount,
//         stockMap,
//         canAddQuantity,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error("useCart must be used within CartProvider");
//   }
//   return context;
// };


// Context/CartContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../Config/api";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [stockMap, setStockMap] = useState({});

  // 🔒 NEW: pending locks
  const [pendingIds, setPendingIds] = useState([]);

  const setPending = (id, val) => {
    setPendingIds((prev) =>
      val ? [...new Set([...prev, id])] : prev.filter((x) => x !== id)
    );
  };




  // 🔄 ALWAYS fetch latest cart
  const refreshCart = async (customerId) => {
    const res = await axios.get(`${BASE_URL}/api/cart/${customerId}`);
    if (res.data.success) {
      setCartItems(res.data.data || []);
    }
  };


  // 🔢 Fetch cart count
  const syncCartCount = async (customerId) => {
    const res = await axios.get(
      `${BASE_URL}/cart/count/${customerId}`
    );
    setCartCount(res.data.count || 0);
  };

  // 📦 Stock
  const fetchStock = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/stock`);
      if (res.data.success) {
        const map = {};
        res.data.data.forEach((row) => {
          map[row.model_id] = Number(row.stock || 0);
        });
        setStockMap(map);
      }
    } catch (err) {
      console.error("Stock fetch error:", err.message);
    }
  };

  useEffect(() => {
    fetchStock();
    const interval = setInterval(fetchStock, 5000);
    return () => clearInterval(interval);
  }, []);

  const clearCartCount = () => setCartCount(0);

  const canAddQuantity = (productId, requestedQty) => {
    const available = stockMap[productId] ?? 0;
    return requestedQty <= available;
  };

  // ===============================
  // 🔥 NEW: Increment / Decrement
  // ===============================

  // const increaseQty = async (cartId) => {
  //   if (pendingIds.includes(cartId)) return;
  //   setPending(cartId, true);

  //   setCartItems((prev) =>
  //     prev.map((i) =>
  //       i.id === cartId ? { ...i, quantity: i.quantity + 1 } : i
  //     )
  //   );

  //   try {
  //     await axios.put(`${BASE_URL}/api/cart/increment/${cartId}`);
  //     setCartCount((c) => c + 1);
  //   } catch {
  //     // rollback from server
  //   } finally {
  //     setPending(cartId, false);
  //   }
  // };

  const increaseQty = async (cartId) => {
  if (pendingIds.includes(cartId)) return;

  const currentItem = cartItems.find((i) => i.id === cartId);
  if (!currentItem) return;

  const modelId = currentItem.model_id;
  const availableStock = stockMap[modelId] ?? 0;

  // 🚫 FRONTEND STOCK GUARD
  if (currentItem.quantity + 1 > availableStock) {
    Toast.show({
      type: "error",
      text1: "Stock limit reached",
    });
    return;
  }

  setPending(cartId, true);

  // optimistic UI
  setCartItems((prev) =>
    prev.map((i) =>
      i.id === cartId ? { ...i, quantity: i.quantity + 1 } : i
    )
  );

  try {
    await axios.put(`${BASE_URL}/api/cart/increment/${cartId}`);
    setCartCount((c) => c + 1);
  } catch (err) {
    // 🔁 rollback from server
    await refreshCart(currentItem.customer_id);
  } finally {
    setPending(cartId, false);
  }
};


  // const decreaseQty = async (cartId) => {
  //   if (pendingIds.includes(cartId)) return;
  //   setPending(cartId, true);

  //   setCartItems((prev) =>
  //     prev.map((i) =>
  //       i.id === cartId && i.quantity > 1
  //         ? { ...i, quantity: i.quantity - 1 }
  //         : i
  //     )
  //   );

  //   try {
  //     await axios.put(`${BASE_URL}/api/cart/decrement/${cartId}`);
  //     setCartCount((c) => Math.max(0, c - 1));
  //   } catch {
  //     // rollback from server
  //   } finally {
  //     setPending(cartId, false);
  //   }
  // };

  const decreaseQty = async (cartId) => {
    if (pendingIds.includes(cartId)) return;
    setPending(cartId, true);

    const currentItem = cartItems.find((i) => i.id === cartId);

    // 🔥 CASE 1: qty = 1 → REMOVE ITEM
    if (currentItem?.quantity === 1) {
      setCartItems((prev) => prev.filter((i) => i.id !== cartId));

      try {
        await axios.delete(`${BASE_URL}/api/cart/delete/${cartId}`);
        setCartCount((c) => Math.max(0, c - 1));
      } catch {
        // rollback if needed
      } finally {
        setPending(cartId, false);
      }
      return;
    }

    // 🔥 CASE 2: qty > 1 → NORMAL DECREMENT
    setCartItems((prev) =>
      prev.map((i) =>
        i.id === cartId ? { ...i, quantity: i.quantity - 1 } : i
      )
    );

    try {
      await axios.put(`${BASE_URL}/api/cart/decrement/${cartId}`);
      setCartCount((c) => Math.max(0, c - 1));
    } finally {
      setPending(cartId, false);
    }
  };
  const deleteItem = async (cartId, customerId) => {
    if (pendingIds.includes(cartId)) return;
    setPending(cartId, true);

    try {
      await axios.delete(`${BASE_URL}/api/cart/delete/${cartId}`);
      await refreshCart(customerId); // ✅ CRITICAL
    } finally {
      setPending(cartId, false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        cartCount,
        setCartCount,
        refreshCart,
        syncCartCount,
        clearCartCount,
        stockMap,
        canAddQuantity,
        deleteItem,
        // 🔥 expose new APIs
        increaseQty,
        decreaseQty,
        pendingIds,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};
