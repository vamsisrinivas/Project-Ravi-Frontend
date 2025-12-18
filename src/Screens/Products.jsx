

// // src/Screens/Products.jsx
// import React, { useContext, useState, useCallback, useEffect } from "react";
// import {
//   View,
//   Text,
//   Image,
//   FlatList,
//   TouchableOpacity,
//   ActivityIndicator,
//   StyleSheet,
//   ScrollView,
//   Alert,
// } from "react-native";
// import Icon from "react-native-vector-icons/MaterialIcons";
// import Ionicons from "react-native-vector-icons/Ionicons";
// import { Picker } from "@react-native-picker/picker";
// import { useFocusEffect } from "@react-navigation/native";
// import NetInfo from "@react-native-community/netinfo";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// import BASE_URL from "../Config/api";
// import { AuthContext } from "../Context/AuthContext";
// import useAddToCart from "../Components/AddToCartFun";
// import Toast from "react-native-toast-message";
// import { WishlistContext } from "../Context/WishlistContext";
// import SearchwithCart from "../Components/SearchwithCart";
// import FastImage from "@d11/react-native-fast-image";
// import { useCart } from "../Context/CartContext";


// export default function Products({ navigation }) {
//   const { user } = useContext(AuthContext);
//   const customer_id = user?.customer_id;
//   const {  } = useCart();

//   const { addToCart } = useAddToCart(customer_id);
//   const { wishlist, addToWishlist, removeFromWishlist } = useContext(WishlistContext);

//   const [addingToCart, setAddingToCart] = useState({});
//   const [buyingNow, setBuyingNow] = useState({});
//   const [models, setModels] = useState([]);
//   const [filteredModels, setFilteredModels] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [query, setQuery] = useState("");
//   const [sortOrder, setSortOrder] = useState("");
//   const [gridView, setGridView] = useState(true);
//   const [categoryTypes, setCategoryTypes] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [brands, setBrands] = useState([]);
//   const [selectedType, setSelectedType] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [selectedBrand, setSelectedBrand] = useState("");
//   const [isConnected, setIsConnected] = useState(true);

//   // 🔁 Monitor Internet Connectivity
//   useEffect(() => {
//     const unsubscribe = NetInfo.addEventListener((state) => {
//       setIsConnected(state.isConnected);
//       if (state.isConnected && customer_id) syncOfflineCart(); // Auto-sync on reconnect
//     });
//     return () => unsubscribe();
//   }, []);


//   // 🔄 Sync Offline Cart Items
//   const syncOfflineCart = async () => {
//     try {
//       const offlineData = await AsyncStorage.getItem("offline_cart");
//       if (offlineData) {
//         const items = JSON.parse(offlineData);
//         if (items.length > 0) {
//           for (const product of items) {
//             await addToCart(product, 1);
//           }
//           await AsyncStorage.removeItem("offline_cart");
//           Toast.show({
//             type: "success",
//             text1: "Offline items synced!",
//           });
//         }
//       }
//     } catch (error) {
//       console.error("Offline sync failed:", error);
//     }
//   };

//   // 🔁 Fetch Products
//   useFocusEffect(
//     useCallback(() => {
//       let isActive = true;
//       const fetchModels = async () => {
//         setLoading(true);
//         try {
//           const res = await fetch(`${BASE_URL}/api/models`);
//           const data = await res.json();
//           if (isActive) {
//             setModels(data);
//             setFilteredModels(data);
//             const types = [...new Set(data.map((m) => m.category?.category_type))];
//             setCategoryTypes(types);
//             setQuery("");
//             setSortOrder("");
//             setSelectedType("");
//             setSelectedCategory("");
//             setSelectedBrand("");
//           }
//         } catch (err) {
//           console.error(err);
//         } finally {
//           if (isActive) setLoading(false);
//         }
//       };
//       fetchModels();
//       return () => {
//         isActive = false;
//       };
//     }, [])
//   );

//   // 🔍 Filters
//   useEffect(() => {
//     let result = [...models];
//     if (query)
//       result = result.filter((m) =>
//         m.model_name.toLowerCase().includes(query.toLowerCase())
//       );

//     if (selectedType) {
//       result = result.filter((m) => m.category?.category_type === selectedType);
//       const cats = [
//         ...new Map(
//           result.map((m) => [
//             m.category?.id,
//             { id: m.category?.id, name: m.category?.category_name },
//           ])
//         ).values(),
//       ];
//       setCategories(cats);
//     } else setCategories([]);

//     if (selectedCategory) {
//       result = result.filter((m) => m.category?.id === selectedCategory);
//       const brs = [
//         ...new Map(
//           models
//             .filter((m) => m.category?.id === selectedCategory)
//             .map((m) => [m.brand?.id, { id: m.brand?.id, name: m.brand?.brand_name }])
//         ).values(),
//       ];
//       setBrands(brs);
//     } else setBrands([]);

//     if (selectedBrand) {
//       result = result.filter((m) => m.brand?.id === selectedBrand);
//     }

//     if (sortOrder === "low")
//       result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
//     else if (sortOrder === "high")
//       result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));

//     setFilteredModels(result);
//   }, [query, sortOrder, selectedType, selectedCategory, selectedBrand, models]);

//   // // ⚡ Instant + Offline Safe Add to Cart
//   // const handleAddToCart = async (product) => {
//   //   const id = product.id;

//   //   const availableStock = stockMap[id] ?? 0;

//   //   if (availableStock <= 0) {
//   //     Toast.show({
//   //       type: "error",
//   //       text1: "Out of Stock",
//   //       text2: "This product is currently unavailable",
//   //     });
//   //     return;
//   //   }

//   //   // if (!canAddQuantity(id, 1)) {
//   //   //   Toast.show({
//   //   //     type: "error",
//   //   //     text1: "Stock Limit Reached",
//   //   //     text2: "No more stock available",
//   //   //   });
//   //   //   return;
//   //   // }

//   //   if (addingToCart[id]) return;

//   //   // 🟢 Optimistic UI feedback (instant)
//   //   setAddingToCart((prev) => ({ ...prev, [id]: true }));
//   //   Toast.show({
//   //     type: "success",
//   //     text1: "Added to Cart",
//   //     visibilityTime: 800,
//   //   });

//   //   // 🚀 Fire & forget async call
//   //   (async () => {
//   //     try {
//   //       if (isConnected) {
//   //         await addToCart(product, 1);
//   //       } else {
//   //         // Save to offline cache
//   //         const offlineData = (await AsyncStorage.getItem("offline_cart")) || "[]";
//   //         const parsed = JSON.parse(offlineData);
//   //         parsed.push(product);
//   //         await AsyncStorage.setItem("offline_cart", JSON.stringify(parsed));
//   //         Toast.show({
//   //           type: "info",
//   //           text1: "Offline Mode",
//   //           text2: "Item saved locally. Will sync when online.",
//   //           visibilityTime: 1500,
//   //         });
//   //       }
//   //     } catch (err) {
//   //       console.error("Add to cart failed:", err);
//   //       Toast.show({
//   //         type: "error",
//   //         text1: "Network Error",
//   //         text2: "Item saved locally.",
//   //       });
//   //       // fallback to offline cache
//   //       const offlineData = (await AsyncStorage.getItem("offline_cart")) || "[]";
//   //       const parsed = JSON.parse(offlineData);
//   //       parsed.push(product);
//   //       await AsyncStorage.setItem("offline_cart", JSON.stringify(parsed));
//   //     } finally {
//   //       setAddingToCart((prev) => ({ ...prev, [id]: false }));
//   //     }
//   //   })();
//   // };

//   const handleAddToCart = async (product) => {
//   const id = product.id;
//   const availableStock = Number(product.available_stock);

//   if (availableStock <= 0) {
//     Toast.show({
//       type: "error",
//       text1: "Out of Stock",
//       text2: "This product is currently unavailable",
//     });
//     return;
//   }

//   if (addingToCart[id]) return;

//   setAddingToCart((prev) => ({ ...prev, [id]: true }));

//   (async () => {
//     try {
//       if (isConnected) {
//         await addToCart(product, 1);
//       } else {
//         const offlineData =
//           (await AsyncStorage.getItem("offline_cart")) || "[]";
//         const parsed = JSON.parse(offlineData);
//         parsed.push({ id: product.id, quantity: 1 });
//         await AsyncStorage.setItem(
//           "offline_cart",
//           JSON.stringify(parsed)
//         );

//         Toast.show({
//           type: "info",
//           text1: "Offline Mode",
//           text2: "Item saved locally. Will sync when online.",
//         });
//       }
//     } finally {
//       setAddingToCart((prev) => ({ ...prev, [id]: false }));
//     }
//   })();
// };

// const handleBuyNow = async (product) => {
//   const id = product.id;
//   const availableStock = Number(product.available_stock);

//   if (availableStock <= 0) {
//     Toast.show({
//       type: "error",
//       text1: "Out of Stock",
//       text2: "Cannot buy this product now",
//     });
//     return;
//   }

//   if (buyingNow[id]) return;
//   setBuyingNow((prev) => ({ ...prev, [id]: true }));

//   try {
//     await addToCart(product, 1);
//     navigation.navigate("Home", { screen: "CartScreen" });
//   } finally {
//     setBuyingNow((prev) => ({ ...prev, [id]: false }));
//   }
// };

//   const renderCard = ({ item }) => {
//   const outOfStock = Number(item.available_stock) <= 0;

//   return (
//     <TouchableOpacity
//       style={[styles.card, gridView ? styles.cardGrid : styles.cardList]}
//       activeOpacity={0.9}
//       disabled={outOfStock}
//       onPress={() =>
//         !outOfStock &&
//         navigation.navigate("ProductDetailPage", { product: item })
//       }
//     >
//       <View style={styles.imageWrapper}>
//         <Image
//           source={{ uri: item.model_image }}
//           style={gridView ? styles.image : styles.imageList}
//           resizeMode="cover"
//         />

//         <TouchableOpacity
//           style={styles.favoriteBtn}
//           onPress={() =>
//             wishlist[item.id]
//               ? removeFromWishlist(item.id)
//               : addToWishlist(item.id)
//           }
//         >
//           <Icon
//             name={wishlist[item.id] ? "favorite" : "favorite-border"}
//             size={22}
//             color={wishlist[item.id] ? "#ff4081" : "#999"}
//           />
//         </TouchableOpacity>
//       </View>

//       <View style={{ flex: 1, paddingLeft: gridView ? 0 : 12 }}>
//         <Text style={styles.name} numberOfLines={1}>
//           {item.model_name}
//         </Text>

//         <Text style={styles.segment}>{item.segment}</Text>

//         <Text style={styles.detail}>
//           <Icon name="timelapse" size={14} color="#999" /> {item.maturity}
//         </Text>

//         <Text style={styles.price}>₹ {item.price}</Text>

//         <View style={styles.btnRow}>
//           {outOfStock ? (
//             // 🚫 OUT OF STOCK
//             <View style={styles.outOfStockBtn}>
//               <Text style={styles.outOfStockText}>Out of Stock</Text>
//             </View>
//           ) : (
//             <>
//               {/* 🛒 Add to Cart */}
//               <TouchableOpacity
//                 style={[
//                   styles.cartBtn,
//                   addingToCart[item.id] && { opacity: 0.6 },
//                 ]}
//                 disabled={addingToCart[item.id]}
//                 onPress={() => handleAddToCart(item)}
//               >
//                 {addingToCart[item.id] ? (
//                   <ActivityIndicator size="small" color="#fff" />
//                 ) : (
//                   <Icon name="shopping-cart" size={18} color="#fff" />
//                 )}
//               </TouchableOpacity>

//               {/* ⚡ Buy Now */}
//               <TouchableOpacity
//                 style={[
//                   styles.buyBtn,
//                   buyingNow[item.id] && { opacity: 0.7 },
//                 ]}
//                 disabled={buyingNow[item.id]}
//                 onPress={() => handleBuyNow(item)}
//               >
//                 <Text style={styles.buyText}>Buy Now</Text>
//               </TouchableOpacity>
//             </>
//           )}
//         </View>
//       </View>
//     </TouchableOpacity>
//   );
// };


//   return (
//     <View style={styles.container}>
//       <View style={styles.headerRow}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
//           <Ionicons name="arrow-back" size={24} color="#333" />
//         </TouchableOpacity>
//         <Text style={styles.headerText}>All Products</Text>
//         <View style={{ width: 45 }} />
//       </View>

//       <SearchwithCart
//         searchValue={query}
//         onSearchChange={setQuery}
//         onCartPress={() => navigation.navigate("CartScreen")}
//       />

//       <View style={styles.actionRow}>
//         <TouchableOpacity
//           style={[styles.actionChip, styles.clearChip]}
//           onPress={() => {
//             setSelectedType("");
//             setSelectedCategory("");
//             setSelectedBrand("");
//             setSortOrder("");
//           }}
//         >
//           <Ionicons name="close-circle" size={16} color="#b30000" />
//           <Text style={styles.clearText}>Clear Filters</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[styles.actionChip, sortOrder && styles.sortChipActive]}
//           onPress={() => {
//             if (sortOrder === "") setSortOrder("low");
//             else if (sortOrder === "low") setSortOrder("high");
//             else setSortOrder("");
//           }}
//         >
//           <Ionicons
//             name="swap-vertical"
//             size={16}
//             color={sortOrder ? "#fff" : "#333"}
//           />
//           <Text
//             style={[
//               styles.sortText,
//               sortOrder && { color: "#fff", fontWeight: "600" },
//             ]}
//           >
//             {sortOrder === "low"
//               ? "Price: Low→High"
//               : sortOrder === "high"
//                 ? "Price: High→Low"
//                 : "Sort"}
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {/* Dropdown filters */}
//       <View style={styles.filterBar}>
//         <ScrollView
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={{ flexGrow: 1, alignItems: "center" }}
//         >
//           {categoryTypes.map((t, idx) => (
//             <TouchableOpacity
//               key={idx}
//               style={[styles.filterChip, selectedType === t && styles.filterChipActive]}
//               onPress={() => {
//                 setSelectedType(selectedType === t ? "" : t);
//                 setSelectedCategory("");
//                 setSelectedBrand("");
//               }}
//             >
//               <Text
//                 style={[
//                   styles.filterText,
//                   selectedType === t && styles.filterTextActive,
//                 ]}
//               >
//                 {t}
//               </Text>
//             </TouchableOpacity>
//           ))}

//           <View style={styles.dropdownSmall}>
//             <Picker
//               selectedValue={selectedCategory}
//               style={styles.dropdown}
//               dropdownIconColor="#548c5c"
//               onValueChange={(val) => {
//                 setSelectedCategory(val);
//                 setSelectedBrand("");
//               }}
//             >
//               <Picker.Item label="Category" value="" color="#888" />
//               {categories.map((c) => (
//                 <Picker.Item key={c.id} label={c.name} value={c.id} color="#222" />
//               ))}
//             </Picker>
//           </View>

//           <View style={styles.dropdownSmall}>
//             <Picker
//               selectedValue={selectedBrand}
//               style={styles.dropdown}
//               dropdownIconColor="#548c5c"
//               onValueChange={(val) => setSelectedBrand(val)}
//             >
//               <Picker.Item label="Brand" value="" color="#888" />
//               {brands.map((b) => (
//                 <Picker.Item key={b.id} label={b.name} value={b.id} color="#222" />
//               ))}
//             </Picker>
//           </View>
//         </ScrollView>
//       </View>

//       {loading ? (
//         <View>
//           <FastImage
//             source={require("../assets/loading.gif")}
//             style={styles.gif}
//             resizeMode={FastImage.resizeMode.contain}
//           />
//         </View>
//       ) : filteredModels.length === 0 ? (
//         <Text style={{ textAlign: "center", marginTop: 20 }}>No products found</Text>
//       ) : (
//         <FlatList
//           key={gridView ? "grid" : "list"}
//           data={filteredModels}
//           keyExtractor={(item) => item.id.toString()}
//           renderItem={renderCard}
//           numColumns={gridView ? 2 : 1}
//           columnWrapperStyle={gridView ? styles.row : null}
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={{ padding: 5 }}
//         />
//       )}
//     </View>
//   );
// }

// // 🎨 Styles remain unchanged
// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#fafafa", paddingHorizontal: 6, paddingTop: 8 },
//   row: { justifyContent: "space-between" },
//   card: { backgroundColor: "#fff", borderRadius: 14, padding: 10, marginBottom: 10, flex: 1, marginHorizontal: 1, elevation: 3 },
//   cardGrid: { maxWidth: "50%" },
//   cardList: { flexDirection: "row", alignItems: "center" },
//   imageWrapper: { position: "relative" },
//   image: { width: "100%", height: 140, resizeMode: "contain", borderRadius: 12 },
//   imageList: { width: 85, height: 85, borderRadius: 10 },
//   favoriteBtn: { position: "absolute", top: 6, right: 6, backgroundColor: "rgba(255,255,255,0.8)", borderRadius: 20, padding: 4 },
//   name: { fontSize: 15, fontWeight: "600", color: "#222", marginTop: 6 },
//   segment: { fontSize: 12, color: "#4caf50", marginVertical: 2 },
//   detail: { fontSize: 12, color: "#777", marginVertical: 2 },
//   price: { fontSize: 16, fontWeight: "bold", color: "#e91e63", marginTop: 4 },
//   btnRow: { flexDirection: "row", marginTop: 8 },
//   cartBtn: { flex: 0.3, backgroundColor: "#4caf50", padding: 8, borderRadius: 10, alignItems: "center", marginRight: 6 },
//   buyBtn: { flex: 0.7, backgroundColor: "#ff5722", padding: 8, borderRadius: 10, alignItems: "center" },
//   buyText: { color: "#fff", fontWeight: "600", fontSize: 14 },
//   headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 10, justifyContent: "space-between", paddingVertical: 6 },
//   headerText: { fontSize: 22, fontWeight: "700", color: "#222", letterSpacing: 0.5 },
//   filterBar: { flexDirection: "row", backgroundColor: "#fff", marginHorizontal: 10, paddingVertical: 6, paddingHorizontal: 6, borderRadius: 12, elevation: 2 },
//   filterChip: { backgroundColor: "#f5f5f5", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, marginRight: 8 },
//   filterChipActive: { backgroundColor: "#4caf50" },
//   filterText: { fontSize: 13, color: "#333" },
//   filterTextActive: { color: "#fff", fontWeight: "600" },
//   actionRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginHorizontal: 10, marginBottom: 6 },
//   actionChip: { flexDirection: "row", alignItems: "center", backgroundColor: "#f5f5f5", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, elevation: 1 },
//   clearChip: { backgroundColor: "#ffe6e6" },
//   clearText: { marginLeft: 6, color: "#b30000", fontWeight: "600" },
//   sortChipActive: { backgroundColor: "#4caf50" },
//   sortText: { marginLeft: 6, fontSize: 13, color: "#333" },
//   dropdownSmall: { borderWidth: 1, borderColor: "#ccc", borderRadius: 16, marginHorizontal: 6, backgroundColor: "#fff", overflow: "hidden", width: 130, height: 35, justifyContent: "center" },
//   dropdown: { height: 55, width: "100%", fontSize: 13, color: "#222" },
//   gif: { width: "100%", height: "80%" },
//   outOfStockBtn: {
//     flex: 1,
//     backgroundColor: "#f44336",
//     padding: 10,
//     borderRadius: 10,
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   outOfStockText: {
//     color: "#fff",
//     fontWeight: "700",
//     fontSize: 14,
//   },

// });







// src/Screens/Products.jsx
import React, { useContext, useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Picker } from "@react-native-picker/picker";
import { useFocusEffect } from "@react-navigation/native";
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage";

import BASE_URL from "../Config/api";
import { AuthContext } from "../Context/AuthContext";
import useAddToCart from "../Components/AddToCartFun";
import Toast from "react-native-toast-message";
import { WishlistContext } from "../Context/WishlistContext";
import SearchwithCart from "../Components/SearchwithCart";
import FastImage from "@d11/react-native-fast-image";
import { useCart } from "../Context/CartContext";
import axios from "axios";


export default function Products({ navigation }) {
  const { user } = useContext(AuthContext);
  const customer_id = user?.customer_id;
  // const { cartItems } = useCart();
  const {
    cartItems,
    increaseQty,
    decreaseQty,
    pendingIds,
    refreshCart,
  } = useCart();

  const { addToCart } = useAddToCart(customer_id);
  const { wishlist, addToWishlist, removeFromWishlist } = useContext(WishlistContext);


  const [models, setModels] = useState([]);
  const [filteredModels, setFilteredModels] = useState([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [gridView, setGridView] = useState(true);
  const [categoryTypes, setCategoryTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [isConnected, setIsConnected] = useState(true);


  // 🔁 Monitor Internet Connectivity
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
      if (state.isConnected && customer_id) syncOfflineCart(); // Auto-sync on reconnect
    });
    return () => unsubscribe();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (customer_id) {
        refreshCart(customer_id);
      }
    }, [customer_id])
  );



  // 🔄 Sync Offline Cart Items
  const syncOfflineCart = async () => {
    try {
      const offlineData = await AsyncStorage.getItem("offline_cart");
      if (offlineData) {
        const items = JSON.parse(offlineData);
        if (items.length > 0) {
          for (const product of items) {
            await addToCart(product, 1);
          }
          await AsyncStorage.removeItem("offline_cart");
          Toast.show({
            type: "success",
            text1: "Offline items synced!",
          });
        }
      }
    } catch (error) {
      console.error("Offline sync failed:", error);
    }
  };

  // 🔁 Fetch Products
  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const fetchModels = async () => {
        setLoading(true);
        try {
          const res = await fetch(`${BASE_URL}/api/models`);
          const data = await res.json();
          if (isActive) {
            setModels(data);
            setFilteredModels(data);
            const types = [...new Set(data.map((m) => m.category?.category_type))];
            setCategoryTypes(types);
            setQuery("");
            setSortOrder("");
            setSelectedType("");
            setSelectedCategory("");
            setSelectedBrand("");
          }
        } catch (err) {
          console.error(err);
        } finally {
          if (isActive) setLoading(false);
        }
      };
      fetchModels();
      return () => {
        isActive = false;
      };
    }, [])
  );

  // 🔍 Filters
  useEffect(() => {
    let result = [...models];
    if (query)
      result = result.filter((m) =>
        m.model_name.toLowerCase().includes(query.toLowerCase())
      );

    if (selectedType) {
      result = result.filter((m) => m.category?.category_type === selectedType);
      const cats = [
        ...new Map(
          result.map((m) => [
            m.category?.id,
            { id: m.category?.id, name: m.category?.category_name },
          ])
        ).values(),
      ];
      setCategories(cats);
    } else setCategories([]);

    if (selectedCategory) {
      result = result.filter((m) => m.category?.id === selectedCategory);
      const brs = [
        ...new Map(
          models
            .filter((m) => m.category?.id === selectedCategory)
            .map((m) => [m.brand?.id, { id: m.brand?.id, name: m.brand?.brand_name }])
        ).values(),
      ];
      setBrands(brs);
    } else setBrands([]);

    if (selectedBrand) {
      result = result.filter((m) => m.brand?.id === selectedBrand);
    }

    if (sortOrder === "low")
      result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    else if (sortOrder === "high")
      result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));

    setFilteredModels(result);
  }, [query, sortOrder, selectedType, selectedCategory, selectedBrand, models]);

  // // ⚡ Instant + Offline Safe Add to Cart







  const handleAddToCart = async (product) => {
    if (Number(product.available_stock) <= 0) {
      Toast.show({ type: "error", text1: "Out of Stock" });
      return;
    }

    try {
      await axios.post(`${BASE_URL}/api/cart`, {
        customer_id,
        model_id: product.id,
        quantity: 1,
      });

      // ✅ THIS IS THE FIX
      await refreshCart(customer_id);

      Toast.show({ type: "success", text1: "Added to cart" });
    } catch (err) {
      Toast.show({ type: "error", text1: "Failed to add item" });
    }
  };









  const getCartRow = (productId) =>
    cartItems.find(
      (c) => Number(c.model_id) === Number(productId)
    );



  const renderCard = ({ item }) => {
    const cartRow = getCartRow(item.id);
    const qty = cartRow?.quantity || 0;
    const cartId = cartRow?.id;
    const isPending = pendingIds.includes(cartId);
    const outOfStock = Number(item.available_stock) <= 0;

    return (
      <View style={styles.richCard}>
        {/* ❤️ Wishlist */}
        <TouchableOpacity
          style={styles.heartBtn}
          onPress={() =>
            wishlist[item.id]
              ? removeFromWishlist(item.id)
              : addToWishlist(item.id)
          }
        >
          <Ionicons
            name={wishlist[item.id] ? "heart" : "heart-outline"}
            size={20}
            color={wishlist[item.id] ? "#e91e63" : "#aaa"}
          />
        </TouchableOpacity>
   <TouchableOpacity
                onPress={() =>
                  navigation.navigate("Home", {
                    screen: "ProductDetailPage",
                    params: { product: item },
                  })
                }
                activeOpacity={0.8}
              >
        {/* 🖼 Image */}
        <FastImage
          source={{ uri: item.model_image }}
          style={styles.richImage}
          resizeMode={FastImage.resizeMode.contain}
        />
</TouchableOpacity>
        {/* 📦 Info */}
        <Text style={styles.richName} numberOfLines={1}>
          {item.model_name}
        </Text>
        <Text style={styles.richPrice}>₹ {item.price}</Text>

        {/* 🛒 Action */}




        {outOfStock ? (
          <View style={styles.outBadge}>
            <Text style={styles.outBadgeText}>OUT OF STOCK</Text>
          </View>
        ) : qty === 0 ? (
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => handleAddToCart(item)}
          >
            <Text style={styles.addText}>ADD</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.qtyBox}>
            <TouchableOpacity
              style={styles.qtyBtn}
              disabled={isPending}
              onPress={() => decreaseQty(cartId, customer_id)}
            >
              <Ionicons name="remove" size={18} color="#fff" />
            </TouchableOpacity>

            <Text style={styles.qtyText}>{qty}</Text>

            <TouchableOpacity
              style={styles.qtyBtn}
              disabled={isPending}
              onPress={() => increaseQty(cartId, customer_id)}
            >
              <Ionicons name="add" size={18} color="#fff" />
            </TouchableOpacity>
          </View>

        )}







      </View>
    );
  };



  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerText}>All Products</Text>
        <View style={{ width: 45 }} />
      </View>

      <SearchwithCart
        searchValue={query}
        onSearchChange={setQuery}
        onCartPress={() => navigation.navigate("CartScreen")}
      />

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[styles.actionChip, styles.clearChip]}
          onPress={() => {
            setSelectedType("");
            setSelectedCategory("");
            setSelectedBrand("");
            setSortOrder("");
          }}
        >
          <Ionicons name="close-circle" size={16} color="#b30000" />
          <Text style={styles.clearText}>Clear Filters</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionChip, sortOrder && styles.sortChipActive]}
          onPress={() => {
            if (sortOrder === "") setSortOrder("low");
            else if (sortOrder === "low") setSortOrder("high");
            else setSortOrder("");
          }}
        >
          <Ionicons
            name="swap-vertical"
            size={16}
            color={sortOrder ? "#fff" : "#333"}
          />
          <Text
            style={[
              styles.sortText,
              sortOrder && { color: "#fff", fontWeight: "600" },
            ]}
          >
            {sortOrder === "low"
              ? "Price: Low→High"
              : sortOrder === "high"
                ? "Price: High→Low"
                : "Sort"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Dropdown filters */}
      <View style={styles.filterBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, alignItems: "center" }}
        >
          {categoryTypes.map((t, idx) => (
            <TouchableOpacity
              key={idx}
              style={[styles.filterChip, selectedType === t && styles.filterChipActive]}
              onPress={() => {
                setSelectedType(selectedType === t ? "" : t);
                setSelectedCategory("");
                setSelectedBrand("");
              }}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedType === t && styles.filterTextActive,
                ]}
              >
                {t}
              </Text>
            </TouchableOpacity>
          ))}

          <View style={styles.dropdownSmall}>
            <Picker
              selectedValue={selectedCategory}
              style={styles.dropdown}
              dropdownIconColor="#548c5c"
              onValueChange={(val) => {
                setSelectedCategory(val);
                setSelectedBrand("");
              }}
            >
              <Picker.Item label="Category" value="" color="#888" />
              {categories.map((c) => (
                <Picker.Item key={c.id} label={c.name} value={c.id} color="#222" />
              ))}
            </Picker>
          </View>

          <View style={styles.dropdownSmall}>
            <Picker
              selectedValue={selectedBrand}
              style={styles.dropdown}
              dropdownIconColor="#548c5c"
              onValueChange={(val) => setSelectedBrand(val)}
            >
              <Picker.Item label="Brand" value="" color="#888" />
              {brands.map((b) => (
                <Picker.Item key={b.id} label={b.name} value={b.id} color="#222" />
              ))}
            </Picker>
          </View>
        </ScrollView>
      </View>

      {loading ? (
        <View>
          <FastImage
            source={require("../assets/loading.gif")}
            style={styles.gif}
            resizeMode={FastImage.resizeMode.contain}
          />
        </View>
      ) : filteredModels.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 20 }}>No products found</Text>
      ) : (
        <FlatList
          key={gridView ? "grid" : "list"}
          data={filteredModels}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCard}
          numColumns={gridView ? 2 : 1}
          columnWrapperStyle={gridView ? styles.row : null}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 5 }}
        />
      )}
    </View>
  );
}

// 🎨 Styles remain unchanged
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fafafa", paddingHorizontal: 6, paddingTop: 8 },
  row: { justifyContent: "space-between" },
  card: { backgroundColor: "#fff", borderRadius: 14, padding: 10, marginBottom: 10, flex: 1, marginHorizontal: 1, elevation: 3 },
  cardGrid: { maxWidth: "50%" },
  cardList: { flexDirection: "row", alignItems: "center" },
  imageWrapper: { position: "relative" },
  image: { width: "100%", height: 140, resizeMode: "contain", borderRadius: 12 },
  imageList: { width: 85, height: 85, borderRadius: 10 },
  favoriteBtn: { position: "absolute", top: 6, right: 6, backgroundColor: "rgba(255,255,255,0.8)", borderRadius: 20, padding: 4 },
  name: { fontSize: 15, fontWeight: "600", color: "#222", marginTop: 6 },
  segment: { fontSize: 12, color: "#4caf50", marginVertical: 2 },
  detail: { fontSize: 12, color: "#777", marginVertical: 2 },
  price: { fontSize: 16, fontWeight: "bold", color: "#e91e63", marginTop: 4 },
  btnRow: { flexDirection: "row", marginTop: 8 },
  cartBtn: { flex: 0.3, backgroundColor: "#4caf50", padding: 8, borderRadius: 10, alignItems: "center", marginRight: 6 },
  buyBtn: { flex: 0.7, backgroundColor: "#ff5722", padding: 8, borderRadius: 10, alignItems: "center" },
  buyText: { color: "#fff", fontWeight: "600", fontSize: 14 },
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 10, justifyContent: "space-between", paddingVertical: 6 },
  headerText: { fontSize: 22, fontWeight: "700", color: "#222", letterSpacing: 0.5 },
  filterBar: { flexDirection: "row", backgroundColor: "#fff", marginHorizontal: 10, paddingVertical: 6, paddingHorizontal: 6, borderRadius: 12, elevation: 2 },
  filterChip: { backgroundColor: "#f5f5f5", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, marginRight: 8 },
  filterChipActive: { backgroundColor: "#4caf50" },
  filterText: { fontSize: 13, color: "#333" },
  filterTextActive: { color: "#fff", fontWeight: "600" },
  actionRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginHorizontal: 10, marginBottom: 6 },
  actionChip: { flexDirection: "row", alignItems: "center", backgroundColor: "#f5f5f5", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, elevation: 1 },
  clearChip: { backgroundColor: "#ffe6e6" },
  clearText: { marginLeft: 6, color: "#b30000", fontWeight: "600" },
  sortChipActive: { backgroundColor: "#4caf50" },
  sortText: { marginLeft: 6, fontSize: 13, color: "#333" },
  dropdownSmall: { borderWidth: 1, borderColor: "#ccc", borderRadius: 16, marginHorizontal: 6, backgroundColor: "#fff", overflow: "hidden", width: 130, height: 35, justifyContent: "center" },
  dropdown: { height: 55, width: "100%", fontSize: 13, color: "#222" },
  gif: { width: "100%", height: "80%" },
  outOfStockBtn: {
    flex: 1,
    backgroundColor: "#f44336",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  outOfStockText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },

  richCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 12,
    marginBottom: 12,
    flex: 1,
    marginHorizontal: 4,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },

  heartBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 2,
    backgroundColor: "#fff",
    padding: 6,
    borderRadius: 20,
    elevation: 3,
  },

  richImage: {
    width: "100%",
    height: 140,
    alignSelf: "center",
  },

  richName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginTop: 8,
  },

  richPrice: {
    fontSize: 15,
    fontWeight: "700",
    color: "#4caf50",
    marginTop: 2,
  },

  addBtn: {
    marginTop: 10,
    backgroundColor: "#4caf50",
    paddingVertical: 6,
    borderRadius: 20,
    alignItems: "center",
  },

  addText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },

  outBadge: {
    marginTop: 10,
    backgroundColor: "#f44336",
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: "center",

  },

  outBadgeText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
  },
  qtyBox: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#d2e0d2ff",
    borderRadius: 20,
    paddingHorizontal: 3,
    height: 36,
  },

  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#4caf50",
    alignItems: "center",
    justifyContent: "center",
  },

  qtySymbol: {
    color: "#ffffffff",
    fontSize: 18,
    fontWeight: "700",
  },

  qtyText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333333ff",
    minWidth: 24,
    textAlign: "center",
  },

  addBtn: {
    marginTop: 10,
    backgroundColor: "#4caf50",
    paddingVertical: 9,
    borderRadius: 20,
    alignItems: "center",
  },

  addText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },


});
