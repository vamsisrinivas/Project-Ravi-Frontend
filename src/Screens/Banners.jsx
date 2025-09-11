// import React, { useRef, useState, useEffect } from "react";
// import {
//     View,
//     Text,
//     TouchableOpacity,
//     Image,
//     ScrollView,
//     StyleSheet,
//     Dimensions,
// } from "react-native";

// const { width } = Dimensions.get("window");

// const Banners = () => {
//     const scrollRef = useRef(null);
//     const [currentIndex, setCurrentIndex] = useState(0);

//     const banners = [
//         {
//             id: 1,
//             title: "Deliveries",
//             subtitle: "100% Free 🔥",
//             small: "On orders above USD 2,000",
//             button: "Order Now",
//             image: require("../assets/chili.png"),
//         },
//         {
//             id: 2,
//             title: "Fresh Products",
//             subtitle: "Special Discount 🌿",
//             small: "Grab before it's gone!",
//             button: "Shop Now",
//             image: require("../assets/chili.png"),
//         },
//         {
//             id: 3,
//             title: "Organic Seeds",
//             subtitle: "Up to 50% Off 🌱",
//             small: "Limited time only!",
//             button: "Buy Now",
//             image: require("../assets/tomato.png"),
//         },
//     ];

//     useEffect(() => {
//         const interval = setInterval(() => {
//             let nextIndex = (currentIndex + 1) % banners.length;
//             setCurrentIndex(nextIndex);
//             scrollRef.current?.scrollTo({
//                 x: nextIndex * width,
//                 animated: true,
//             });
//         }, 3000); // auto-slide every 3s

//         return () => clearInterval(interval);
//     }, [currentIndex]);

//     return (
//         <View >
//             <ScrollView
//                 ref={scrollRef}
//                 horizontal
//                 pagingEnabled
//                 showsHorizontalScrollIndicator={false}
//                 style={{ marginTop: 10 }}
//                 onMomentumScrollEnd={(e) => {
//                     const index = Math.round(e.nativeEvent.contentOffset.x / width);
//                     setCurrentIndex(index);
//                 }}
//             >
//                 {banners.map((item) => (
//                     <View key={item.id} style={[styles.bannerCard, { width }]}>
//                         <Text style={styles.bannerTitle}>{item.title}</Text>
//                         <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
//                         <Text style={styles.bannerSmall}>{item.small}</Text>
//                         <TouchableOpacity style={styles.bannerButton}>
//                             <Text style={styles.bannerButtonText}>{item.button}</Text>
//                         </TouchableOpacity>
//                         <Image source={item.image} style={styles.bannerImage} />
//                     </View>
//                 ))}
//             </ScrollView>

//             {/* Pagination Dots */}
//             <View style={styles.pagination}>
//                 {banners.map((_, index) => (
//                     <View
//                         key={index}
//                         style={[
//                             styles.dot,
//                             { backgroundColor: index === currentIndex ? "green" : "#ccc" },
//                         ]}
//                     />
//                 ))}
//             </View>
//         </View>
//     );
// };

// export default Banners;

// const styles = StyleSheet.create({
//   bannerCard: {
//     height: 160,
//     width: width * 0.5,     // 👈 only 90% of screen width
//     alignSelf: "center",    // 👈 center the card
//     backgroundColor: "#e6f7ec",
//     borderRadius: 15,
//     padding: 15,
//     marginVertical: 10,
//     position: "relative",
//   },
//   bannerTitle: { fontSize: 16, fontWeight: "600", color: "#333" },
//   bannerSubtitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "green",
//     marginTop: 5,
//   },
//   bannerSmall: { fontSize: 12, color: "#666", marginVertical: 5 },
//   bannerButton: {
//     backgroundColor: "green",
//     paddingHorizontal: 15,
//     paddingVertical: 6,
//     borderRadius: 8,
//     marginTop: 5,
//     alignSelf: "flex-start",
//   },
//   bannerButtonText: { color: "white", fontWeight: "bold" },
//   bannerImage: {
//     width: 100,
//     height: 110,
//     position: "absolute",
//     right: 20,
//     bottom: 10,
//     resizeMode: "contain",
//   },
//   pagination: {
//     flexDirection: "row",
//     justifyContent: "center",
//     marginTop: 8,
//   },
//   dot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     marginHorizontal: 4,
//   },
// });




import React, { useRef, useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    ScrollView,
    StyleSheet,
    Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.8; // 👈 reduce card width to 90%

const Banners = () => {
    const scrollRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const banners = [
        {
            id: 1,
            title: "Deliveries",
            subtitle: "100% Free 🔥",
            small: "On orders above INR 2,000",
            button: "Order Now",
            image: require("../assets/Delivery-man.png"),
        },
        {
            id: 2,
            title: "Fresh Products",
            subtitle: "Special Discount 🌿",
            small: "Grab before it's gone!",
            button: "Shop Now",
            image: require("../assets/Bestprice.png"),
        },
        {
            id: 3,
            title: "Organic Seeds",
            subtitle: "Up to 50% Off 🌱",
            small: "Limited time only!",
            button: "Buy Now",
            image: require("../assets/tomato.png"),
        },
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            let nextIndex = (currentIndex + 1) % banners.length;
            setCurrentIndex(nextIndex);
            scrollRef.current?.scrollTo({
                x: nextIndex * CARD_WIDTH, // 👈 use CARD_WIDTH, not full width
                animated: true,
            });
        }, 3000);

        return () => clearInterval(interval);
    }, [currentIndex]);

    return (
        <View>
            <ScrollView
                ref={scrollRef}
                horizontal
                pagingEnabled={false}
                showsHorizontalScrollIndicator={false}
                snapToInterval={CARD_WIDTH}
                decelerationRate="fast"
                contentContainerStyle={{
                    paddingLeft: 18,
                    paddingHorizontal: width * 0.03, // 👈 equal 5% space on both sides
                }}
                onMomentumScrollEnd={(e) => {
                    const index = Math.round(e.nativeEvent.contentOffset.x / CARD_WIDTH);
                    setCurrentIndex(index);
                }}
                style={{ marginTop: 10 }}
            >

                {banners.map((item) => (
                    <View key={item.id} style={[styles.bannerCard, { width: CARD_WIDTH }]}>
                        <Text style={styles.bannerTitle}>{item.title}</Text>
                        <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
                        <Text style={styles.bannerSmall}>{item.small}</Text>
                        <TouchableOpacity style={styles.bannerButton}>
                            <Text style={styles.bannerButtonText}>{item.button}</Text>
                        </TouchableOpacity>
                        <Image source={item.image} style={styles.bannerImage} />
                    </View>
                ))}
            </ScrollView>

            {/* Pagination Dots */}
            <View style={styles.pagination}>
                {banners.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            { backgroundColor: index === currentIndex ? "green" : "#ccc" },
                        ]}
                    />
                ))}
            </View>
        </View>
    );
};

export default Banners;

const styles = StyleSheet.create({
    bannerCard: {
        height: 160,
        backgroundColor: "#e6f7ec",
        borderRadius: 15,
        padding: 15,
        marginHorizontal: 8,
        position: "relative",
        alignSelf: "center",    // 👈 center the card

    },
    bannerTitle: { fontSize: 16, fontWeight: "600", color: "#333" },
    bannerSubtitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "green",
        marginTop: 5,
    },
    bannerSmall: { fontSize: 12, color: "#666", marginVertical: 5 },
    bannerButton: {
        backgroundColor: "green",
        paddingHorizontal: 15,
        paddingVertical: 6,
        borderRadius: 8,
        marginTop: 5,
        alignSelf: "flex-start",
    },
    bannerButtonText: { color: "white", fontWeight: "bold" },
    bannerImage: {
        width: 100,
        height: 110,
        position: "absolute",
        right: 20,
        bottom: 10,
        resizeMode: "contain",
    },
    pagination: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 8,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
});
