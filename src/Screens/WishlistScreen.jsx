// import React, { useEffect, useState, useContext } from "react";
// import {
//     View,
//     Text,
//     Image,
//     TouchableOpacity,
//     StyleSheet,
//     FlatList,
//     SafeAreaView,
//     ActivityIndicator,
//     Alert,
// } from "react-native";
// import Ionicons from "react-native-vector-icons/Ionicons";
// import { AuthContext } from "../Context/AuthContext";
// import axios from "axios";
// import BASE_URL from "../Config/api";
// import useAddToCart from "../Components/AddToCartFun"; // ✅ import hook


// export default function WishlistScreen({ navigation }) {
//     const { user } = useContext(AuthContext);

//     const customer_id = user?.customer_id;    // ✅ extract customer_id
//     const { addToCart, loading: cartLoading } = useAddToCart(customer_id);

//     const [wishlist, setWishlist] = useState([]);
//     const [loading, setLoading] = useState(true);


//     useEffect(() => {
//         fetchWishlist();
//     }, []);

//     const fetchWishlist = async () => {
//         try {
//             const res = await axios.get(`${BASE_URL}/api/wishlist/${user.customer_id}`);
//             if (res.data.success) {
//                 setWishlist(res.data.data);
//             }
//         } catch (err) {
//             console.error("Error fetching wishlist:", err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const removeFromWishlist = async (model_id) => {
//         try {
//             console.log("Removing wishlist item:", model_id);
//             await axios.delete(`${BASE_URL}/api/wishlist/${user.customer_id}/${model_id}`);
//             setWishlist((prev) => prev.filter((item) => item.model_id !== model_id));
//             Alert.alert("❤️ Removed from Wishlist");
//         } catch (err) {
//             console.error("Error removing from wishlist:", err.response?.data || err.message);
//             Alert.alert("❌ Failed to remove item.");
//         }
//     };
// // ✅ Add to Cart + Remove from Wishlist + Navigate to Cart
// const handleAddToCartAndRemove = async (item) => {
//   const product = item.product;
//   try {
//     // Step 1: Add to cart
//     await axios.post(`${BASE_URL}/api/cart/add`, {
//       customer_id,
//       model_id: product.id,
//       quantity: 1,
//     });

//     // Step 2: Remove from wishlist
//     await axios.delete(`${BASE_URL}/api/wishlist/${customer_id}/${item.model_id}`);

//     // Step 3: Update UI
//     setWishlist((prev) => prev.filter((i) => i.model_id !== item.model_id));

//     // Step 4: Navigate to Cart
//     navigation.navigate("CartScreen");

//   } catch (err) {
//     console.error("Error in AddToCart+Remove:", err.response?.data || err.message);
//     Alert.alert("❌ Failed to add to cart or remove from wishlist");
//   }
// };


//     //   const addToCart = async (product) => {
//     //     try {
//     //       await axios.post(`${BASE_URL}/api/cart/add`, {
//     //         customer_id: user.customer_id,
//     //         model_id: product.id,
//     //         quantity: 1,
//     //       });
//     //       Alert.alert("✅ Added to Cart!");
//     //       navigation.navigate("Cart"); // Redirect to Cart
//     //     } catch (err) {
//     //       console.error("Error adding to cart:", err.message);
//     //       Alert.alert("❌ Failed to add to cart");
//     //     }
//     //   };

//     const buyNow = (product) => {
//         navigation.navigate("Checkout", { product });
//     };

//     const renderItem = ({ item }) => {
//         const product = item.product;
//         return (
//             <View style={styles.card}>
//                 <TouchableOpacity
//                     onPress={() =>
//                         navigation.navigate("ProductDetailPage", { product })
//                     }
//                     activeOpacity={0.9}
//                 >
//                     <Image source={{ uri: product.model_image }} style={styles.image} />
//                 </TouchableOpacity>

//                 <View style={styles.details}>
//                     <Text style={styles.name}>{product.model_name}</Text>
//                     <Text style={styles.segment}>{product.segment}</Text>
//                     <Text style={styles.price}>₹ {product.price}</Text>

//                     <View style={styles.buttonRow}>
//                         <TouchableOpacity
//                             style={styles.cartBtn}
//                             onPress={() => handleAddToCartAndRemove(item)}
//                             disabled={cartLoading}
//                         >
//                             <Ionicons name="cart-outline" size={18} color="#fff" />
//                             <Text style={styles.btnText}>Add to Cart</Text>
//                         </TouchableOpacity>

//                         <TouchableOpacity
//                             style={styles.buyBtn}
//                             onPress={() => buyNow(product)}
//                         >
//                             <Ionicons name="flash-outline" size={18} color="#fff" />
//                             <Text style={styles.btnText}>Buy Now</Text>
//                         </TouchableOpacity>
//                     </View>
//                 </View>

//                 <TouchableOpacity
//                     onPress={() => removeFromWishlist(item.model_id)}
//                     style={styles.deleteBtn}
//                 >
//                     <Ionicons name="trash-outline" size={22} color="red" />
//                 </TouchableOpacity>
//             </View>
//         );
//     };

//     if (loading) {
//         return (
//             <View style={styles.loader}>
//                 <ActivityIndicator size="large" color="#548c5c" />
//             </View>
//         );
//     }

//     return (
//         <SafeAreaView style={styles.container}>
//             <View style={styles.header}>
//                 <TouchableOpacity onPress={() => navigation.goBack()}>
//                     <Ionicons name="arrow-back" size={24} color="#000" />
//                 </TouchableOpacity>
//                 <Text style={styles.headerTitle}>My Wishlist</Text>
//                 <TouchableOpacity onPress={fetchWishlist}>
//                     <Ionicons name="refresh" size={22} color="#000" />
//                 </TouchableOpacity>
//             </View>

//             <FlatList
//                 data={wishlist}
//                 keyExtractor={(item) => item.id.toString()}
//                 renderItem={renderItem}
//                 contentContainerStyle={{ padding: 12 }}
//                 ListEmptyComponent={
//                     <View style={styles.emptyContainer}>
//                         <Ionicons name="heart-outline" size={60} color="#ccc" />
//                         <Text style={styles.emptyText}>No items in wishlist</Text>
//                     </View>
//                 }
//             />
//         </SafeAreaView>
//     );
// }

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: "#f8f9fa" },
//     loader: { flex: 1, justifyContent: "center", alignItems: "center" },
//     header: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         alignItems: "center",
//         padding: 15,
//         backgroundColor: "#fff",
//         elevation: 3,
//     },
//     headerTitle: { fontSize: 22, fontWeight: "700", color: "#222" },
//     card: {
//         flexDirection: "row",
//         backgroundColor: "#fff",
//         borderRadius: 12,
//         padding: 10,
//         marginBottom: 12,
//         elevation: 2,
//         shadowColor: "#000",
//         shadowOpacity: 0.1,
//         shadowRadius: 3,
//     },
//     image: { width: 90, height: 90, borderRadius: 10, marginRight: 10 },
//     details: { flex: 1, justifyContent: "space-between" },
//     name: { fontSize: 15, fontWeight: "700", color: "#000" },
//     segment: { fontSize: 12, color: "#666", marginVertical: 2 },
//     price: { fontSize: 14, color: "#2e7d32", fontWeight: "bold" },
//     buttonRow: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         marginTop: 6,
//     },
//     cartBtn: {
//         flexDirection: "row",
//         alignItems: "center",
//         backgroundColor: "#548c5c",
//         paddingVertical: 6,
//         paddingHorizontal: 10,
//         borderRadius: 8,
//     },
//     buyBtn: {
//         flexDirection: "row",
//         alignItems: "center",
//         backgroundColor: "#ff8800",
//         paddingVertical: 6,
//         paddingHorizontal: 10,
//         borderRadius: 8,
//     },
//     btnText: {
//         color: "#fff",
//         fontSize: 13,
//         fontWeight: "600",
//         marginLeft: 4,
//     },
//     deleteBtn: { alignSelf: "center", marginLeft: 8 },
//     emptyContainer: { alignItems: "center", marginTop: 80 },
//     emptyText: { fontSize: 16, color: "#777", marginTop: 10 },
// });



import React, { useEffect, useState, useContext } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    SafeAreaView,
    ActivityIndicator,
    Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { AuthContext } from "../Context/AuthContext";
import axios from "axios";
import BASE_URL from "../Config/api";
import useAddToCart from "../Components/AddToCartFun"; // ✅ custom hook

export default function WishlistScreen({ navigation }) {
    const { user } = useContext(AuthContext);
    const customer_id = user?.customer_id;

    const { loading: cartLoading } = useAddToCart(customer_id);
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/wishlist/${customer_id}`);
            if (res.data.success) {
                setWishlist(res.data.data);
            }
        } catch (err) {
            console.error("Error fetching wishlist:", err.message);
        } finally {
            setLoading(false);
        }
    };

    const removeFromWishlist = async (model_id) => {
        try {
            await axios.delete(`${BASE_URL}/api/wishlist/${customer_id}/${model_id}`);
            setWishlist((prev) => prev.filter((item) => item.model_id !== model_id));
            Alert.alert("❤️ Removed from Wishlist");
        } catch (err) {
            console.error("Error removing from wishlist:", err.response?.data || err.message);
            Alert.alert("❌ Failed to remove item.");
        }
    };

    // ✅ Add to Cart + Remove from Wishlist + Navigate to Cart
    const handleAddToCartAndRemove = async (item) => {
        const product = item.product;
        try {
            // ✅ Step 1: Add to cart (corrected endpoint)
            await axios.post(`${BASE_URL}/api/cart/`, {
                customer_id,
                model_id: product.id,
                quantity: 1,
            });

            // ✅ Step 2: Remove from wishlist
            await axios.delete(`${BASE_URL}/api/wishlist/${customer_id}/${item.model_id}`);

            // ✅ Step 3: Update UI
            setWishlist((prev) => prev.filter((i) => i.model_id !== item.model_id));

            // ✅ Step 4: Navigate to Cart
            Alert.alert("✅ Added to Cart!");
            navigation.navigate("Home", {   // "Home" = name of your Tab
                screen: "CartScreen",          // screen inside the HomeStack
            });
        } catch (err) {
            console.error("Error in AddToCart+Remove:", err.response?.data || err.message);
            Alert.alert("❌ Failed to add to cart or remove from wishlist");
        }
    };

    const buyNow = (product) => {
        navigation.navigate("Checkout", { product });
    };

    const renderItem = ({ item }) => {
        const product = item.product;
        return (
            <View style={styles.card}>
                <TouchableOpacity
                    onPress={() => navigation.navigate("ProductDetailPage", { product })}
                    activeOpacity={0.9}
                >
                    <Image source={{ uri: product.model_image }} style={styles.image} />
                </TouchableOpacity>

                <View style={styles.details}>
                    <Text style={styles.name}>{product.model_name}</Text>
                    <Text style={styles.segment}>{product.segment}</Text>
                    <Text style={styles.price}>₹ {product.price}</Text>

                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={styles.cartBtn}
                            onPress={() => handleAddToCartAndRemove(item)}
                            disabled={cartLoading}
                        >
                            <Ionicons name="cart-outline" size={18} color="#fff" />
                            <Text style={styles.btnText}>Add to Cart</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.buyBtn}
                            onPress={() => buyNow(product)}
                        >
                            <Ionicons name="flash-outline" size={18} color="#fff" />
                            <Text style={styles.btnText}>Buy Now</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity
                    onPress={() => removeFromWishlist(item.model_id)}
                    style={styles.deleteBtn}
                >
                    <Ionicons name="trash-outline" size={22} color="red" />
                </TouchableOpacity>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#548c5c" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Wishlist</Text>
                <TouchableOpacity onPress={fetchWishlist}>
                    <Ionicons name="refresh" size={22} color="#000" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={wishlist}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={{ padding: 12 }}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="heart-outline" size={60} color="#ccc" />
                        <Text style={styles.emptyText}>No items in wishlist</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f8f9fa" },
    loader: { flex: 1, justifyContent: "center", alignItems: "center" },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 15,
        backgroundColor: "#fff",
        elevation: 3,
    },
    headerTitle: { fontSize: 22, fontWeight: "700", color: "#222" },
    card: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 10,
        marginBottom: 12,
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    image: { width: 90, height: 90, borderRadius: 10, marginRight: 10 },
    details: { flex: 1, justifyContent: "space-between" },
    name: { fontSize: 15, fontWeight: "700", color: "#000" },
    segment: { fontSize: 12, color: "#666", marginVertical: 2 },
    price: { fontSize: 14, color: "#2e7d32", fontWeight: "bold" },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 6,
    },
    cartBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#548c5c",
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 8,
    },
    buyBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#ff8800",
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 8,
    },
    btnText: {
        color: "#fff",
        fontSize: 13,
        fontWeight: "600",
        marginLeft: 4,
    },
    deleteBtn: { alignSelf: "center", marginLeft: 8 },
    emptyContainer: { alignItems: "center", marginTop: 80 },
    emptyText: { fontSize: 16, color: "#777", marginTop: 10 },
});
