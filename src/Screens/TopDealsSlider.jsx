import React, { useCallback } from "react";
import {
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
} from "react-native";
import { useCart } from "../Context/CartContext";
import Ionicons from "react-native-vector-icons/Ionicons";
import useAddToCart from "../Components/AddToCartFun";
import { AuthContext } from "../Context/AuthContext";
import { useContext } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { WishlistContext } from "../Context/WishlistContext";
import Toast from "react-native-toast-message";





const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.40;

const TopDealsSlider = ({
    data,
    onPressItem,
    onViewAll,
    title,
}) => {

    const {
        cartItems,
        increaseQty,
        decreaseQty,
        pendingIds,
        refreshCart,
    } = useCart();
    const { user } = useContext(AuthContext);
    const customer_id = user?.customer_id;
    const { addToCart } = useAddToCart(customer_id);
    const navigation = useNavigation();
    const { wishlist, addToWishlist, removeFromWishlist } =
        useContext(WishlistContext);


    const getCartRow = (productId) =>
        cartItems.find((c) => Number(c.model_id) === Number(productId));



    useFocusEffect(
        useCallback(() => {
            if (customer_id) {
                refreshCart(customer_id);
            }
        }, [customer_id])
    );



    const renderItem = ({ item }) => {
        const discountedPrice =
            item.discount_percent > 0
                ? item.price - (item.price * item.discount_percent) / 100
                : item.price;


        const cartRow = getCartRow(item.id);
        const qty = cartRow?.quantity || 0;
        const cartId = cartRow?.id;
        const isPending = pendingIds.includes(cartId);
        const outOfStock = Number(item.available_stock) <= 0;
        const isWishlisted = !!wishlist[item.id];

        return (
            <TouchableOpacity
                style={styles.card}
                activeOpacity={0.85}
                onPress={() => onPressItem(item)}
            >
                {/* 🔥 Discount Badge */}
                {item.discount_percent > 0 && (
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>
                            {item.discount_percent}% OFF
                        </Text>
                    </View>
                )}

                {/* 🖼 Product Image */}
                <Image
                    source={{ uri: item.model_image }}
                    style={styles.image}
                    resizeMode="contain"
                />

                {/* 🌱 Segment */}
                {item.segment && (
                    <Text style={styles.segment} numberOfLines={1}>
                        {item.segment}
                    </Text>
                )}

                {/* 🌿 Plant */}
                {item.plant && (
                    <Text style={styles.plant} numberOfLines={1}>
                        {item.plant}
                    </Text>
                )}

                {/* 📦 Product Name */}
                <Text numberOfLines={2} style={styles.title}>
                    {item.model_name}
                </Text>

                {/* 💰 Price */}
                <View style={styles.priceRow}>
                    <Text style={styles.price}>₹{Math.round(discountedPrice)}</Text>
                    {item.discount_percent > 0 && (
                        <Text style={styles.mrp}>₹{item.price}</Text>
                    )}
                </View>
                {/* ❤️ Wishlist Icon */}
                {/* ❤️ Wishlist Toggle */}
                <TouchableOpacity
                    style={styles.wishlistBtn}
                    activeOpacity={0.7}
                    onPress={() => {
                        if (isWishlisted) {
                            removeFromWishlist(item.id); // model_id
                            Toast.show({
                                type: "error",
                                text1: "Removed from wishlist",
                            });
                        } else {
                            addToWishlist(item.id); // model_id
                            Toast.show({
                                type: "success",
                                text1: "Added to wishlist",
                            });
                        }
                    }}
                >
                    <Ionicons
                        name={isWishlisted ? "heart" : "heart-outline"}
                        size={20}
                        color={isWishlisted ? "#ff4081" : "#999"}
                    />
                </TouchableOpacity>




                {/* ➕ Add to Cart */}
                {/* 🛒 Cart Action */}
                {outOfStock ? (
                    <View style={styles.outBadge}>
                        <Text style={styles.outText}>OUT OF STOCK</Text>
                    </View>
                ) : qty === 0 ? (
                    <TouchableOpacity
                        style={styles.cartBtn}

                        onPress={async () => {
                            if (Number(item.available_stock) <= 0) {
                                Alert.alert("Out of Stock");
                                return;
                            }

                            await addToCart(item, 1);

                            // 🔥 THIS LINE MAKES UI SWITCH TO + / −
                            await refreshCart(customer_id);
                        }}



                    >
                        <Text style={styles.cartText}>ADD</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.qtyBox}>
                        <TouchableOpacity
                            style={styles.qtyBtn}
                            disabled={isPending}
                            onPress={() => decreaseQty(cartId)}
                        >
                            <Ionicons name="remove" size={16} color="#fff" />
                        </TouchableOpacity>

                        <Text style={styles.qtyText}>{qty}</Text>



                        <TouchableOpacity
                            style={styles.qtyBtn}
                            disabled={pendingIds.includes(cartId)}
                            onPress={() => increaseQty(cartId)}
                        >
                            <Ionicons name="add" size={16} color="#fff" />
                        </TouchableOpacity>

                    </View>
                )}

            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.heading}>{title}</Text>

                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                        console.log("View All clicked"); // 🔍 DEBUG
                        onViewAll && onViewAll();
                    }}
                >
                    <Text style={styles.viewAll}>View All</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={data}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={{ paddingHorizontal: 12 }}
            />
        </View>
    );
};

export default TopDealsSlider;

const styles = StyleSheet.create({
    container: {
        marginTop: 16,

    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 14,
        marginBottom: 6,
    },

    heading: {
        fontSize: 17,
        fontWeight: "700",
        color: "#111",
    },

    viewAll: {
        fontSize: 14,
        color: "green",
        fontWeight: "600",
    },
    card: {
        width: CARD_WIDTH,
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 8,              // ⬅ reduced
        marginRight: 10,
        elevation: 4,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 4,
        marginBottom: 10,
        marginTop: 5
    },

    badge: {
        position: "absolute",
        top: 6,
        left: 6,
        backgroundColor: "#00b259",
        paddingHorizontal: 5,
        paddingVertical: 2,
        borderRadius: 5,
        zIndex: 10,
    },

    badgeText: {
        color: "#fff",
        fontSize: 10,
        fontWeight: "700",
    },

    image: {
        width: "100%",
        height: 90,              // ⬅ smaller image
        marginTop: 8,
    },

    segment: {
        fontSize: 14,
        color: "#000000ff",
        fontWeight: "400",
        marginTop: 4,
    },

    plant: {
        fontSize: 12,
        color: "#0c0c0cff",
        marginTop: 1,
    },

    title: {
        fontSize: 14,
        fontWeight: "600",
        color: "#00b259",
        marginTop: 3,
        minHeight: 32,
    },

    priceRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 2,
    },

    price: {
        fontSize: 15,
        fontWeight: "700",
        color: "#00b259",
        marginRight: 6,
    },

    mrp: {
        fontSize: 12,
        color: "#888",
        textDecorationLine: "line-through",
    },

    cartBtn: {
        marginTop: 10,
        backgroundColor: "#4caf50",
        paddingVertical: 6,
        borderRadius: 20,
        alignItems: "center",
    },

    cartText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 13,
    },
    qtyBox: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 10,
        borderWidth: 1,
        borderColor: "#00b259",
        borderRadius: 8,
        overflow: "hidden",
    },

    qtyBtn: {
        backgroundColor: "#00b259",
        paddingHorizontal: 10,
        paddingVertical: 4,
    },

    qtyText: {
        fontSize: 14,
        fontWeight: "700",
        color: "#000",
        paddingHorizontal: 8,
    },

    outBadge: {
        marginTop: 6,
        backgroundColor: "#f8d7da",
        paddingVertical: 4,
        borderRadius: 6,
    },

    outText: {
        textAlign: "center",
        fontSize: 11,
        fontWeight: "700",
        color: "#b30000",
    },


    wishlistBtn: {
        position: "absolute",
        top: 8,
        right: 8,
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 5,
        elevation: 4,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 3,
        shadowOffset: { width: 0, height: 1 },
    },


});
