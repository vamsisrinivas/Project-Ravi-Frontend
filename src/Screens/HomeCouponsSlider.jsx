// import React from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   StyleSheet,
//   Dimensions,
// } from "react-native";
// import LinearGradient from "react-native-linear-gradient";
// import Ionicons from "react-native-vector-icons/Ionicons";

// const { width } = Dimensions.get("window");
// const CARD_WIDTH = width * 0.8;

// const HomeCouponsSlider = ({ coupons, onApply }) => {
//   const renderItem = ({ item }) => {
//     const isPercentage = item.discount_type === "percentage";

//     return (
//       <LinearGradient
//         colors={["#53d395ff", "#c5c329ff"]}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 1, y: 0 }}
//         style={styles.card}
//       >
//         {/* 🎟 Left */}
//         <View style={styles.left}>
//           <Text style={styles.offerText}>
//             {isPercentage
//               ? `${item.discount_value}% OFF`
//               : `₹${item.discount_value} OFF`}
//           </Text>

//           <Text style={styles.minOrder}>
//             Min order ₹{item.min_order_amount}
//           </Text>

//           <View style={styles.codeBox}>
//             <Text style={styles.code}>{item.coupon_code}</Text>
//             <Ionicons name="copy-outline" size={14} color="#0b1d14ff" />
//           </View>
//         </View>

//         {/* 👉 Right */}
//         <TouchableOpacity
//           style={styles.applyBtn}
//           onPress={() => onApply(item)}
//         >
//           <Text style={styles.applyText}>APPLY</Text>
//         </TouchableOpacity>
//       </LinearGradient>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.heading}>🎟 Available Coupons</Text>
//       </View>

//       <FlatList
//         data={coupons}
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={renderItem}
//         contentContainerStyle={{ paddingHorizontal: 12 }}
//       />
//     </View>
//   );
// };

// export default HomeCouponsSlider;
// const styles = StyleSheet.create({
//   container: {
//     marginTop: 14,
//   },

//   header: {
//     paddingHorizontal: 14,
//     marginBottom: 8,
//   },

//   heading: {
//     fontSize: 17,
//     fontWeight: "700",
//     color: "#111",
//   },

//   card: {
//     width: CARD_WIDTH,
//     borderRadius: 14,
//     padding: 14,
//     marginRight: 12,
//     flexDirection: "row",
//     alignItems: "center",
//   },

//   left: {
//     flex: 1,
//   },

//   offerText: {
//     fontSize: 18,
//     fontWeight: "800",
//     color: "#fff",
//   },

//   minOrder: {
//     fontSize: 12,
//     color: "#e6fff1",
//     marginVertical: 4,
//   },

//   codeBox: {
//     backgroundColor: "#fff",
//     alignSelf: "flex-start",
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 6,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//   },

//   code: {
//     fontSize: 13,
//     fontWeight: "700",
//     color: "#00b259",
//   },

//   applyBtn: {
//     backgroundColor: "#fff",
//     paddingHorizontal: 14,
//     paddingVertical: 8,
//     borderRadius: 8,
//   },

//   applyText: {
//     color: "#00b259",
//     fontWeight: "800",
//     fontSize: 13,
//   },
// });


import { Alert } from "react-native";
import React, { useRef, useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";
import Clipboard from "@react-native-clipboard/clipboard";
const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.8;

const HomeCouponsSlider = ({ coupons, onApply }) => {
    const flatListRef = useRef(null);
    const currentIndexRef = useRef(0);

    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (!coupons || coupons.length <= 1 || isPaused) return;

        const interval = setInterval(() => {
            const nextIndex =
                (currentIndexRef.current + 1) % coupons.length;

            flatListRef.current?.scrollToOffset({
                offset: nextIndex * ITEM_WIDTH, // ✅ precise offset
                animated: true,
            });

            currentIndexRef.current = nextIndex;
            setActiveIndex(nextIndex);
        }, 3000);

        return () => clearInterval(interval);
    }, [coupons, isPaused]);


    /* 📋 Copy Coupon */
    const copyCode = (code) => {
        Clipboard.setString(code);
        Alert.alert("Copied", `${code} copied to clipboard`);
    };
    const CARD_WIDTH = width * 0.8;
    const SPACING = 12;
    const ITEM_WIDTH = CARD_WIDTH + SPACING;

    const renderItem = ({ item }) => {
        const isPercentage = item.discount_type === "percentage";

        return (
            <LinearGradient
                colors={["#12d175ff", "#f0d90aff"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.card}
            >
                {/* 🎟 Left */}
                <View style={styles.left}>
                    <Text style={styles.offerText}>
                        {isPercentage
                            ? `${item.discount_value}% OFF`
                            : `₹${item.discount_value} OFF`}
                    </Text>

                    <Text style={styles.minOrder}>
                        Min order ₹{item.min_order_amount}
                    </Text>

                    <TouchableOpacity
                        style={styles.codeBox}
                        onPress={() => copyCode(item.coupon_code)}
                    >
                        <Text style={styles.code}>{item.coupon_code}</Text>
                        <Ionicons name="copy-outline" size={14} color="#0b1d14ff" />
                    </TouchableOpacity>
                </View>

                {/* 👉 Right */}
                <TouchableOpacity
                    style={styles.applyBtn}
                    onPress={() => onApply(item)}
                >
                    <Text style={styles.applyText}>APPLY</Text>
                </TouchableOpacity>
            </LinearGradient>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>🎟 Available Coupons</Text>

            <FlatList
                ref={flatListRef}
                data={coupons}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                snapToInterval={ITEM_WIDTH}        // ✅ KEY FIX
                decelerationRate="fast"
                getItemLayout={(_, index) => ({
                    length: ITEM_WIDTH,
                    offset: ITEM_WIDTH * index,
                    index,
                })}
                contentContainerStyle={{ paddingHorizontal: 12 }}
                onTouchStart={() => setIsPaused(true)}
                onTouchEnd={() => setIsPaused(false)}
                onMomentumScrollEnd={(e) => {
                    const index = Math.round(
                        e.nativeEvent.contentOffset.x / ITEM_WIDTH
                    );
                    setActiveIndex(index);
                    currentIndexRef.current = index;
                }}
            />


            {/* 🔘 Pagination Dots */}
            <View style={styles.dotsRow}>
                {coupons.map((_, idx) => (
                    <View
                        key={idx}
                        style={[
                            styles.dot,
                            idx === activeIndex && styles.activeDot,
                        ]}
                    />
                ))}
            </View>
        </View>
    );
};

export default HomeCouponsSlider;
const styles = StyleSheet.create({
    container: {
        marginTop: 14,
    },

    heading: {
        fontSize: 17,
        fontWeight: "700",
        color: "#111",
        paddingHorizontal: 14,
        marginBottom: 8,
    },

    card: {
        width: CARD_WIDTH,
        borderRadius: 14,
        padding: 14,
        marginRight: 12,
        flexDirection: "row",
        alignItems: "center",
    },

    left: { flex: 1 },

    offerText: {
        fontSize: 18,
        fontWeight: "800",
        color: "#fff",
    },

    minOrder: {
        fontSize: 12,
        color: "#e6fff1",
        marginVertical: 4,
    },

    codeBox: {
        backgroundColor: "#fff",
        alignSelf: "flex-start",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },

    code: {
        fontSize: 13,
        fontWeight: "700",
        color: "#00b259",
    },

    applyBtn: {
        backgroundColor: "#fff",
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 8,
    },

    applyText: {
        color: "#00b259",
        fontWeight: "800",
        fontSize: 13,
    },

    /* 🔘 Dots */
    dotsRow: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 6,
    },

    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: "#ccc",
        marginHorizontal: 4,
    },

    activeDot: {
        backgroundColor: "#00b259",
        width: 10,
    },
});
