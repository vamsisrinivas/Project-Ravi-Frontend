// // src/Screens/PaymentSuccessScreen.js
// import React, { useEffect } from "react";
// import { View, Text, StyleSheet, Image, Animated } from "react-native";
// // import LottieView from 'lottie-react-native';
// import FastImage from "@d11/react-native-fast-image"


// export default function PaymentSuccessScreen({ route, navigation }) {
//     const { order_id, razorpay_order_id,razorpay_payment_id, amount } = route.params || {};
//     const fadeAnim = new Animated.Value(0);

//     useEffect(() => {
//         // Fade in animation
//         Animated.timing(fadeAnim, {
//             toValue: 1,
//             duration: 800,
//             useNativeDriver: true,
//         }).start();

//         // Auto navigate to Home after 4 seconds
//         const timer = setTimeout(() => {
//             // ✅ Navigate to Home tab
//             navigation.reset({
//                 index: 0,
//                 routes: [{ name: "Home" }],
//             });
//         }, 10000);

//         return () => clearTimeout(timer);
//     }, []);

//     return (
//         <View style={styles.container}>
//             <Animated.View style={{ opacity: fadeAnim, alignItems: "center" }}>
//                 {/* <Image source={{ uri: "https://cdn-icons-png.flaticon.com/512/845/845646.png", }} style={styles.icon} /> */}
//                 {/* <Image
//                     source={require("../assets/Order.gif")}
//                     style={styles.gif}
//                 /> */}

//                 <FastImage source={require("../assets/Order.gif")}
//                     style={styles.gif} />
//                 <Text style={styles.title}>Payment Successful!</Text>
//                 <Text style={styles.message}>Thank you for your purchase 🎉</Text>

//                 <View style={styles.detailsBox}>
//                     <Text style={styles.detailText}>Order ID: {order_id}</Text>
//                     <Text style={styles.detailText}>Razorpay ID: {razorpay_order_id}</Text>
//                     <Text style={styles.detailText}>Payment ID: {razorpay_payment_id}</Text>
//                     <Text style={styles.detailText}>Amount Paid: ₹{amount}</Text>
//                 </View>

//                 <Text style={styles.redirectText}>Redirecting to Home...</Text>
//             </Animated.View>


//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: "#f9fff9",
//         alignItems: "center",
//         justifyContent: "center",
//         padding: 20,
//     },
//     icon: {
//         width: 100,
//         height: 100,
//         marginBottom: 20,
//     },
//     title: {
//         fontSize: 24,
//         fontWeight: "700",
//         color: "#1a8e55",
//         marginBottom: 8,
//     },
//     message: {
//         fontSize: 16,
//         color: "#444",
//         marginBottom: 20,
//     },
//     detailsBox: {
//         backgroundColor: "#e9f7ef",
//         borderRadius: 10,
//         padding: 15,
//         width: "90%",
//         alignItems: "flex-start",
//         marginBottom: 20,
//     },
//     detailText: {
//         fontSize: 15,
//         color: "#333",
//         marginBottom: 6,
//     },
//     redirectText: {
//         fontSize: 14,
//         color: "#666",
//         marginTop: 10,
//     },
//     gif: {
//         width: 300,
//         height: 300,
//         marginBottom: 20,
//     },

// });


// import React, { useEffect, useRef } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Animated,
//   TouchableOpacity,
//   Easing,
// } from "react-native";
// import FastImage from "@d11/react-native-fast-image";
// import Ionicons from "react-native-vector-icons/Ionicons";

// export default function PaymentSuccessScreen({ route, navigation }) {
//   const { order_id, razorpay_order_id, razorpay_payment_id, amount } =
//     route.params || {};

//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const scaleAnim = useRef(new Animated.Value(0.5)).current;

//   useEffect(() => {
//     // Smooth fade + scale animation
//     Animated.parallel([
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 800,
//         useNativeDriver: true,
//         easing: Easing.out(Easing.ease),
//       }),
//       Animated.spring(scaleAnim, {
//         toValue: 1,
//         friction: 6,
//         tension: 80,
//         useNativeDriver: true,
//       }),
//     ]).start();

//     // Auto navigate to Home after 10 seconds
//     const timer = setTimeout(() => {
//       navigation.reset({
//         index: 0,
//         routes: [{ name: "Home" }],
//       });
//     }, 20000);

//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <View style={styles.container}>
//       <Animated.View
//         style={{
//           opacity: fadeAnim,
//           transform: [{ scale: scaleAnim }],
//           alignItems: "center",
//           width: "100%",
//         }}
//       >
//         {/* 🎉 Success GIF */}
//         <FastImage
//           source={require("../assets/Order.gif")}
//           style={styles.gif}
//           resizeMode={FastImage.resizeMode.contain}
//         />

//         {/* ✅ Header */}
//         <Text style={styles.title}>Payment Successful!</Text>
//         <Text style={styles.subtitle}>Thank you for your purchase 🎉</Text>

//         {/* 🧾 Order Summary */}
//         <View style={styles.summaryCard}>
//           <Text style={styles.summaryTitle}>Order Summary</Text>

//           <View style={styles.summaryRow}>
//             <Text style={styles.label}>Order-ID</Text>
//             <Text style={styles.value}>{order_id}</Text>
//           </View>

//           <View style={styles.separator} />

//           <View style={styles.summaryRow}>
//             <Text style={styles.label}>Razorpay-ID</Text>
//             <Text style={styles.value}>{razorpay_order_id}</Text>
//           </View>

//           <View style={styles.separator} />

//           <View style={styles.summaryRow}>
//             <Text style={styles.label}>Payment-ID</Text>
//             <Text style={styles.value}>{razorpay_payment_id}</Text>
//           </View>

//           <View style={styles.separator} />

//           <View style={styles.summaryRow}>
//             <Text style={styles.label}>Amount Paid</Text>
//             <Text style={[styles.value, styles.amountValue]}>
//               ₹{Number(amount).toFixed(2)}
//             </Text>
//           </View>
//         </View>

//         {/* 💚 Success Icon */}
//         <View style={styles.successCircle}>
//           <Ionicons name="checkmark" size={28} color="#fff" />
//         </View>

//         {/* ⏳ Redirect message */}
//         <Text style={styles.redirectText}>Redirecting to Home...</Text>

//         {/* 🛍️ Continue Button */}
//         <TouchableOpacity
//           onPress={() =>
//             navigation.reset({ index: 0, routes: [{ name: "Home" }] })
//           }
//           style={styles.button}
//           activeOpacity={0.8}
//         >
//           <Text style={styles.buttonText}>Continue Shopping</Text>
//         </TouchableOpacity>
//       </Animated.View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f5fff8",
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 20,
//   },
//   gif: {
//     width: 220,
//     height: 220,
//     marginBottom: 10,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "800",
//     color: "#1a8e55",
//     marginTop: 5,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: "#444",
//     marginBottom: 20,
//     fontWeight: "500",
//   },
//   summaryCard: {
//     backgroundColor: "#ffffff",
//     borderRadius: 16,
//     width: "90%",
//     padding: 18,
//     shadowColor: "#000",
//     shadowOpacity: 0.08,
//     shadowRadius: 6,
//     elevation: 5,
//   },
//   summaryTitle: {
//     fontSize: 16,
//     fontWeight: "700",
//     color: "#1a8e55",
//     marginBottom: 10,
//   },
//   summaryRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginVertical: 6,
//   },
//   label: {
//     fontSize: 14,
//     color: "#777",
//     fontWeight: "500",
//   },
//   value: {
//     fontSize: 14,
//     color: "#000",
//     fontWeight: "600",
//     flexShrink: 1,
//     textAlign: "right",
//   },
//   amountValue: {
//     color: "#1a8e55",
//     fontSize: 15,
//   },
//   separator: {
//     height: 1,
//     backgroundColor: "#e6e6e6",
//     marginVertical: 4,
//   },
//   successCircle: {
//     marginTop: 25,
//     backgroundColor: "#1a8e55",
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     justifyContent: "center",
//     alignItems: "center",
//     shadowColor: "#1a8e55",
//     shadowOpacity: 0.4,
//     shadowRadius: 8,
//     elevation: 8,
//   },
//   redirectText: {
//     marginTop: 15,
//     fontSize: 14,
//     color: "#666",
//   },
//   button: {
//     marginTop: 25,
//     backgroundColor: "#1a8e55",
//     borderRadius: 12,
//     paddingVertical: 14,
//     paddingHorizontal: 40,
//     elevation: 5,
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "700",
//   },
// });



// src/Screens/PaymentSuccessScreen.js
import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Easing,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from "react-native";
import FastImage from "@d11/react-native-fast-image";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function PaymentSuccessScreen({ route, navigation }) {
  const { order_id, razorpay_order_id, razorpay_payment_id, amount } =
    route.params || {};

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    // Smooth fade + scale animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto navigate to Home after 20 seconds
    const timer = setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    }, 20000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#f5fff8" barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
            alignItems: "center",
            width: "100%",
          }}
        >
          {/* 🎉 Success GIF */}
          <FastImage
            source={require("../assets/Order.gif")}
            style={styles.gif}
            resizeMode={FastImage.resizeMode.contain}
          />

          {/* ✅ Header */}
          <Text style={styles.title}>Payment Successful!</Text>
          <Text style={styles.subtitle}>Thank you for your purchase 🎉</Text>

          {/* 🧾 Order Summary */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Order Summary</Text>

            <View style={styles.summaryRow}>
              <Text style={styles.label}>Order ID</Text>
              <Text style={styles.value} numberOfLines={1}>
                {order_id}
              </Text>
            </View>

            <View style={styles.separator} />

            <View style={styles.summaryRow}>
              <Text style={styles.label}>Razorpay Order ID</Text>
              <Text style={styles.value} numberOfLines={1}>
                {razorpay_order_id}
              </Text>
            </View>

            <View style={styles.separator} />

            <View style={styles.summaryRow}>
              <Text style={styles.label}>Payment ID</Text>
              <Text style={styles.value} numberOfLines={1}>
                {razorpay_payment_id}
              </Text>
            </View>

            <View style={styles.separator} />

            <View style={styles.summaryRow}>
              <Text style={styles.label}>Amount Paid</Text>
              <Text style={[styles.value, styles.amountValue]}>
                ₹{Number(amount).toFixed(2)}
              </Text>
            </View>
          </View>

          {/* 💚 Success Icon */}
          <View style={styles.successCircle}>
            <Ionicons name="checkmark" size={28} color="#fff" />
          </View>

          {/* ⏳ Redirect message */}
          <Text style={styles.redirectText}>Redirecting to Home...</Text>

          {/* 🛍️ Continue Button */}
          <TouchableOpacity
            onPress={() =>
              navigation.reset({ index: 0, routes: [{ name: "Home" }] })
            }
            style={styles.button}
            activeOpacity={0.85}
          >
            <Text style={styles.buttonText}>Continue Shopping</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5fff8",
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    paddingBottom: 40,
  },
  gif: {
    width: 220,
    height: 220,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1a8e55",
    marginTop: 5,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#444",
    marginBottom: 20,
    fontWeight: "500",
    textAlign: "center",
  },
  summaryCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    width: "100%",
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 5,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a8e55",
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6,
  },
  label: {
    fontSize: 14,
    color: "#777",
    fontWeight: "500",
  },
  value: {
    fontSize: 14,
    color: "#000",
    fontWeight: "600",
    flexShrink: 1,
    textAlign: "right",
  },
  amountValue: {
    color: "#1a8e55",
    fontSize: 15,
  },
  separator: {
    height: 1,
    backgroundColor: "#e6e6e6",
    marginVertical: 4,
  },
  successCircle: {
    marginTop: 25,
    backgroundColor: "#1a8e55",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#1a8e55",
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  redirectText: {
    marginTop: 15,
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  button: {
    marginTop: 25,
    backgroundColor: "#1a8e55",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 40,
    elevation: 5,
    width: "90%",
    alignSelf: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
});
