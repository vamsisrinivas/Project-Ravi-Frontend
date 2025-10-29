// Context/CartContext.js
import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

// 🧹 Clear cart count function
  const clearCartCount = () => {
    setCartCount(0);
  };

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  return (
    <CartContext.Provider value={{ cartCount, setCartCount ,clearCartCount}}>
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
