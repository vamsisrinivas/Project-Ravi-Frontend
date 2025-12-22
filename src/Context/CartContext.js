
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



  const fetchStock = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/stock`);
      if (res.data.success) {
        const map = {};
        res.data.data.forEach((row) => {
          map[row.model_id] = Number(row.available_stock || 0);
        });
        setStockMap(map);
      }
    } catch (err) {
      console.error("Stock fetch error:", err.message);
    }
  };


  // useEffect(() => {
  //   fetchStock();
  //   const interval = setInterval(fetchStock, 5000);
  //   return () => clearInterval(interval);
  // }, []);

  useEffect(() => {
    if (pendingIds.length > 0) return;
    fetchStock();
  }, [pendingIds]);


  const clearCartCount = () => setCartCount(0);



  /* ===============================
     CART-AWARE STOCK CHECK ✅
     =============================== */

       // const canAddQuantity = (productId, requestedQty) => {
  //   const available = stockMap[productId] ?? 0;
  //   return requestedQty <= available;
  // };
  const canAddQuantity = (modelId) => {
    const available = stockMap[modelId] ?? 0;
    return available >= 1;
  };

  // ===============================
  // 🔥 NEW: Increment / Decrement
  // ===============================





  const increaseQty = async (cartId) => {
    if (pendingIds.includes(cartId)) return;

    const currentItem = cartItems.find((i) => i.id === cartId);
    if (!currentItem) return;

    setPending(cartId, true);

    // 🔥 Optimistic UI
    setCartItems((prev) =>
      prev.map((i) =>
        i.id === cartId ? { ...i, quantity: i.quantity + 1 } : i
      )
    );
    setCartCount((c) => c + 1);

    try {
      await axios.put(`${BASE_URL}/api/cart/increment/${cartId}`);
    } catch (err) {
      // 🔁 rollback from server truth
      await refreshCart(currentItem.customer_id);
    } finally {
      setPending(cartId, false);
    }
  };




  const decreaseQty = async (cartId) => {
    if (pendingIds.includes(cartId)) return;

    const currentItem = cartItems.find((i) => i.id === cartId);
    if (!currentItem) return;

    setPending(cartId, true);

    // 🔥 CASE 1: qty === 1 → REMOVE ITEM
    if (currentItem.quantity === 1) {
      // ✅ optimistic remove
      setCartItems((prev) => prev.filter((i) => i.id !== cartId));
      setCartCount((c) => Math.max(0, c - 1));

      try {
        await axios.delete(`${BASE_URL}/api/cart/delete/${cartId}`);
      } catch (err) {
        // 🔁 rollback ONLY on failure
        await refreshCart(currentItem.customer_id);
      } finally {
        setPending(cartId, false);
      }
      return;
    }

    // 🔥 CASE 2: qty > 1 → DECREMENT
    setCartItems((prev) =>
      prev.map((i) =>
        i.id === cartId ? { ...i, quantity: i.quantity - 1 } : i
      )
    );
    setCartCount((c) => Math.max(0, c - 1));

    try {
      await axios.put(`${BASE_URL}/api/cart/decrement/${cartId}`);
    } catch (err) {
      await refreshCart(currentItem.customer_id);
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



// import React, { createContext, useContext, useEffect, useState } from "react";
// import axios from "axios";
// import BASE_URL from "../Config/api";

// const CartContext = createContext();

// export const CartProvider = ({ children }) => {
//   const [cartCount, setCartCount] = useState(0);
//   const [cartItems, setCartItems] = useState([]);
//   const [stockMap, setStockMap] = useState({});
//   const [pendingIds, setPendingIds] = useState([]);

//   /* ===============================
//      HELPERS
//      =============================== */
//   const setPending = (id, val) => {
//     setPendingIds((prev) =>
//       val ? [...new Set([...prev, id])] : prev.filter((x) => x !== id)
//     );
//   };

//   /* ===============================
//      CART FETCH
//      =============================== */
//   const refreshCart = async (customerId) => {
//     const res = await axios.get(`${BASE_URL}/api/cart/${customerId}`);
//     if (res.data.success) {
//       setCartItems(res.data.data || []);
//       setCartCount(
//         (res.data.data || []).reduce((s, i) => s + i.quantity, 0)
//       );
//     }
//   };

//   /* ===============================
//      STOCK FETCH (READ ONLY)
//      =============================== */
//   const fetchStock = async () => {
//     try {
//       const res = await axios.get(`${BASE_URL}/api/stock`);
//       if (res.data.success) {
//         const map = {};
//         res.data.data.forEach((row) => {
//           map[row.model_id] = Number(row.available_stock || 0);
//         });
//         setStockMap(map);
//       }
//     } catch (err) {
//       console.error("Stock fetch error:", err.message);
//     }
//   };

//   // Fetch stock ONLY after operations finish
//   useEffect(() => {
//     if (pendingIds.length === 0) {
//       fetchStock();
//     }
//   }, [pendingIds]);

//   /* ===============================
//      CART-AWARE STOCK CHECK ✅
//      =============================== */
//   const canAddQuantity = (modelId) => {
//     const available = stockMap[modelId] ?? 0;
//     return available >= 1;
//   };

//   /* ===============================
//      INCREMENT
//      =============================== */
//   const increaseQty = async (cartId) => {
//     if (pendingIds.includes(cartId)) return;

//     const item = cartItems.find((i) => i.id === cartId);
//     if (!item) return;

//     // 🔒 UI guard (cart-aware)
//     if (!canAddQuantity(item.model_id)) return;

//     setPending(cartId, true);

//     // Optimistic UI
//     setCartItems((prev) =>
//       prev.map((i) =>
//         i.id === cartId ? { ...i, quantity: i.quantity + 1 } : i
//       )
//     );
//     setCartCount((c) => c + 1);

//     try {
//       await axios.put(`${BASE_URL}/api/cart/increment/${cartId}`);
//     } catch {
//       await refreshCart(item.customer_id);
//     } finally {
//       setPending(cartId, false);
//     }
//   };

//   /* ===============================
//      DECREMENT
//      =============================== */
//   const decreaseQty = async (cartId) => {
//     if (pendingIds.includes(cartId)) return;

//     const item = cartItems.find((i) => i.id === cartId);
//     if (!item) return;

//     setPending(cartId, true);

//     if (item.quantity === 1) {
//       setCartItems((prev) => prev.filter((i) => i.id !== cartId));
//       setCartCount((c) => Math.max(0, c - 1));
//       try {
//         await axios.delete(`${BASE_URL}/api/cart/delete/${cartId}`);
//       } catch {
//         await refreshCart(item.customer_id);
//       } finally {
//         setPending(cartId, false);
//       }
//       return;
//     }

//     setCartItems((prev) =>
//       prev.map((i) =>
//         i.id === cartId ? { ...i, quantity: i.quantity - 1 } : i
//       )
//     );
//     setCartCount((c) => Math.max(0, c - 1));

//     try {
//       await axios.put(`${BASE_URL}/api/cart/decrement/${cartId}`);
//     } catch {
//       await refreshCart(item.customer_id);
//     } finally {
//       setPending(cartId, false);
//     }
//   };

//   return (
//     <CartContext.Provider
//       value={{
//         cartItems,
//         cartCount,
//         refreshCart,
//         increaseQty,
//         decreaseQty,
//         setCartCount, // ✅ ADD THIS
//         pendingIds,
//         canAddQuantity,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => {
//   const ctx = useContext(CartContext);
//   if (!ctx) throw new Error("useCart must be inside CartProvider");
//   return ctx;
// };
