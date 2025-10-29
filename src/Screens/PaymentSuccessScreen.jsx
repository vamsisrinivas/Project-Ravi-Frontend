// src/Screens/PaymentSuccessScreen.js
import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image, Animated } from "react-native";
// import LottieView from 'lottie-react-native';

export default function PaymentSuccessScreen({ route, navigation }) {
    const { order_id, razorpay_order_id, amount } = route.params || {};
    const fadeAnim = new Animated.Value(0);

    useEffect(() => {
        // Fade in animation
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();

        // Auto navigate to Home after 4 seconds
        const timer = setTimeout(() => {
            // ✅ Navigate to Home tab
            navigation.reset({
                index: 0,
                routes: [{ name: "Home" }],
            });
        }, 4000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={styles.container}>
            <Animated.View style={{ opacity: fadeAnim, alignItems: "center" }}>
                <Image source={{ uri: "https://cdn-icons-png.flaticon.com/512/845/845646.png", }} style={styles.icon} />
                {/* <Image
                    source={require("../assets/Order.gif")}
                    style={styles.gif}
                /> */}

                {/* <FastImage source={require("../assets/Order.gif")}
                    style={styles.gif} /> */}
                <Text style={styles.title}>Payment Successful!</Text>
                <Text style={styles.message}>Thank you for your purchase 🎉</Text>

                <View style={styles.detailsBox}>
                    <Text style={styles.detailText}>Order ID: {order_id}</Text>
                    <Text style={styles.detailText}>Razorpay ID: {razorpay_order_id}</Text>
                    <Text style={styles.detailText}>Amount Paid: ₹{amount}</Text>
                </View>

                <Text style={styles.redirectText}>Redirecting to Home...</Text>
            </Animated.View>


        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f9fff9",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    icon: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "700",
        color: "#1a8e55",
        marginBottom: 8,
    },
    message: {
        fontSize: 16,
        color: "#444",
        marginBottom: 20,
    },
    detailsBox: {
        backgroundColor: "#e9f7ef",
        borderRadius: 10,
        padding: 15,
        width: "90%",
        alignItems: "flex-start",
        marginBottom: 20,
    },
    detailText: {
        fontSize: 15,
        color: "#333",
        marginBottom: 6,
    },
    redirectText: {
        fontSize: 14,
        color: "#666",
        marginTop: 10,
    },
    gif: {
        width: 300,
        height: 300,
        marginBottom: 20,
    },

});
