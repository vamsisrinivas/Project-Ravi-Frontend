

import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import BASE_URL from "../Config/api";
import { AuthContext } from "./AuthContext";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const customer_id = user?.customer_id;

  const [wishlist, setWishlist] = useState({}); // store as { model_id: fullItem }
  const [loading, setLoading] = useState(false);

  // ---------------- Fetch wishlist from server ----------------
  const fetchWishlist = async () => {
    if (!customer_id) return;
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/wishlist/${customer_id}`);
      if (res.data.success) {
        const map = {};
        res.data.data.forEach((item) => {
          // store full product object
          map[item.model_id] = item;
        });
        setWishlist(map);
      }
    } catch (err) {
      console.error("❌ Error fetching wishlist:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Add to wishlist ----------------
  const addToWishlist = async (model_id) => {
    try {
      await axios.post(`${BASE_URL}/api/wishlist/add`, { customer_id, model_id });
      // Immediately refresh from server for full details
      fetchWishlist();
    } catch (err) {
      console.error("❌ Error adding to wishlist:", err.message);
    }
  };

  // ---------------- Remove from wishlist ----------------
  const removeFromWishlist = async (model_id) => {
    try {
      await axios.delete(`${BASE_URL}/api/wishlist/${customer_id}/${model_id}`);
      // Immediately refresh from server
      fetchWishlist();
    } catch (err) {
      console.error("❌ Error removing from wishlist:", err.message);
    }
  };

  // ---------------- On mount, fetch wishlist ----------------
  useEffect(() => {
    fetchWishlist();
  }, [customer_id]);

  return (
    <WishlistContext.Provider
      value={{
        wishlist, // object map
        wishlistArray: Object.values(wishlist), // for FlatList rendering
        addToWishlist,
        removeFromWishlist,
        fetchWishlist,
        loading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
