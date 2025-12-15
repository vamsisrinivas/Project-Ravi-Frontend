// // Context/CartContext.js
// import React, { createContext, useContext, useState } from "react";

// const CartContext = createContext();



// export const CartProvider = ({ children }) => {
//   const [cartCount, setCartCount] = useState(0);
  
//   // 🧹 Clear cart count function
//   const clearCartCount = () => {
//     setCartCount(0);
//   };

//   return (
//     <CartContext.Provider value={{ cartCount, setCartCount ,clearCartCount}}>
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


// Context/CartContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../Config/api";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [stockMap, setStockMap] = useState({}); // 🔑 model_id → stock

  // 🧹 Clear cart count
  const clearCartCount = () => {
    setCartCount(0);
  };

  // 🔄 Fetch stock from backend
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

  // ⏳ Auto refresh stock
  useEffect(() => {
    fetchStock();
    const interval = setInterval(fetchStock, 5000); // every 5 sec
    return () => clearInterval(interval);
  }, []);

  // ✅ Check stock before allowing quantity change
  const canAddQuantity = (productId, requestedQty) => {
    const available = stockMap[productId] ?? 0;
    return requestedQty <= available;
  };

  return (
    <CartContext.Provider
      value={{
        cartCount,
        setCartCount,
        clearCartCount,
        stockMap,
        canAddQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
