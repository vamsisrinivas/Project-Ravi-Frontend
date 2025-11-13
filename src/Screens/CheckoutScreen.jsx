// import React, { useEffect, useState, useContext, useMemo, useCallback } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   SafeAreaView,
//   ScrollView,
//   Image,
//   ActivityIndicator,
//   Alert,
//   TextInput,
//   FlatList,
//   Modal
// } from "react-native";
// import { AuthContext } from "../Context/AuthContext";
// import axios from "axios";
// import BASE_URL from "../Config/api";
// import Ionicons from "react-native-vector-icons/Ionicons";
// import { useFocusEffect } from "@react-navigation/native";
// import RazorpayCheckout from "react-native-razorpay";
// import { useCart } from "../Context/CartContext";

// export default function CheckoutScreen({ navigation }) {
//   const { user } = useContext(AuthContext);
//   const customer_id = user?.customer_id;
//   const { clearCartCount } = useCart();

//   const [cartItems, setCartItems] = useState([]);
//   const [address, setAddress] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [serverOrder, setServerOrder] = useState(null);
//   const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);

//   // Coupon state
//   const [availableCoupons, setAvailableCoupons] = useState([]);
//   const [couponCodeInput, setCouponCodeInput] = useState("");
//   const [appliedCoupon, setAppliedCoupon] = useState(null);
//   const [couponDiscountAmount, setCouponDiscountAmount] = useState(0);
//   const [couponMessage, setCouponMessage] = useState("");
//   const [couponMessageType, setCouponMessageType] = useState(null);
//   const [showCoupons, setShowCoupons] = useState(false);
//   const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

//   // Fetch cart + address + coupons
//   useEffect(() => {
//     if (customer_id) {
//       fetchCart();
//       fetchDefaultAddress(customer_id);
//       fetchAvailableCoupons();
//     }
//   }, [customer_id]);

//   useFocusEffect(
//     useCallback(() => {
//       if (customer_id) fetchDefaultAddress(customer_id);
//     }, [customer_id])
//   );

//   const fetchCart = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(`${BASE_URL}/api/cart/${customer_id}`);
//       if (res.data.success) setCartItems(res.data.data || []);
//     } catch (err) {
//       console.error("Cart fetch error:", err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchDefaultAddress = async (id) => {
//     try {
//       const res = await axios.get(`${BASE_URL}/api/addresses/customer/${id}/defaults`);
//       if (res.data.success) setAddress(res.data.data?.shipping || null);
//     } catch (err) {
//       console.error("Address fetch error:", err.message);
//       setAddress(null);
//     }
//   };

//   const fetchAvailableCoupons = async () => {
//     try {
//       const res = await axios.get(`${BASE_URL}/api/coupons/all`);
//       if (res.data.success) setAvailableCoupons(res.data.coupons || []);
//     } catch (err) {
//       console.error("Coupons fetch error:", err.message);
//     }
//   };

//   // 🧮 Calculate totals
//   const { itemAmount, productDiscountAmount, subtotalAfterDiscount, localGrandTotal } = useMemo(() => {
//     const itemAmount = cartItems.reduce(
//       (sum, item) => sum + parseFloat(item.product.price) * item.quantity,
//       0
//     );
//     const productDiscountAmount = cartItems.reduce((sum, item) => {
//       const pct = parseFloat(item.product.discount_percent || 0);
//       return sum + ((parseFloat(item.product.price) * item.quantity * pct) / 100);
//     }, 0);
//     const subtotalAfterDiscount = itemAmount - productDiscountAmount;
//     const localGrandTotal = subtotalAfterDiscount - couponDiscountAmount;
//     return { itemAmount, productDiscountAmount, subtotalAfterDiscount, localGrandTotal };
//   }, [cartItems, couponDiscountAmount]);

//   // 🏷️ Apply coupon
//   const applyCoupon = async (code = couponCodeInput) => {
//     if (!code.trim()) {
//       setCouponMessage("⚠️ Please enter a coupon code");
//       setCouponMessageType("error");
//       return;
//     }
//     try {
//       setIsApplyingCoupon(true);
//       const res = await axios.post(`${BASE_URL}/api/coupons/apply`, {
//         coupon_code: code.trim(),
//         customer_id,
//         order_total: subtotalAfterDiscount,
//       });
//       if (res.data.success) {
//         setAppliedCoupon(res.data.coupon_details || { coupon_code: code.trim() });
//         setCouponDiscountAmount(Number(res.data.discount || 0));
//         setCouponMessage("✅ Coupon applied successfully!");
//         setCouponMessageType("success");
//         setCouponCodeInput("");
//       } else {
//         setAppliedCoupon(null);
//         setCouponDiscountAmount(0);
//         setCouponMessage(res.data.message || "❌ Invalid or expired coupon.");
//         setCouponMessageType("error");
//       }
//     } catch {
//       setCouponMessage("❌ Coupon is not eligible.");
//       setCouponMessageType("error");
//     } finally {
//       setIsApplyingCoupon(false);
//     }
//   };

//   const removeCoupon = () => {
//     setAppliedCoupon(null);
//     setCouponDiscountAmount(0);
//     setCouponMessage("");
//     setCouponMessageType(null);
//   };

//   // 🛒 Qty handlers
//   const increaseQty = async (id) => {
//     setCartItems((prev) =>
//       prev.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item))
//     );
//     await axios.put(`${BASE_URL}/api/cart/increment/${id}`).catch(() => {});
//   };

//   const decreaseQty = async (id) => {
//     setCartItems((prev) =>
//       prev.map((item) =>
//         item.id === id && item.quantity > 1
//           ? { ...item, quantity: item.quantity - 1 }
//           : item
//       )
//     );
//     await axios.put(`${BASE_URL}/api/cart/decrement/${id}`).catch(() => {});
//   };

//   const removeItem = async (id) => {
//     await axios.delete(`${BASE_URL}/api/cart/delete/${id}`).catch(() => {});
//     fetchCart();
//   };

//   // 🧾 Create order
//   const createServerOrder = async () => {
//     const itemsPayload = cartItems.map((item) => ({
//       id: item.product.id,
//       price: Number(item.product.price),
//       quantity: item.quantity,
//       discount_percent: Number(item.product.discount_percent || 0),
//     }));

//     try {
//       const res = await axios.post(`${BASE_URL}/api/orders/create-order`, {
//         customer_id,
//         address_id: address.id,
//         items: itemsPayload,
//         coupon_code: appliedCoupon?.coupon_code || null,
//         delivery_charge: 0,
//       });
//       if (res.data.success) {
//         setServerOrder({
//           order_id: res.data.order_id,
//           razorpayOrder: res.data.razorpayOrder,
//           finalAmount: res.data.finalAmount,
//         });
//         return res.data;
//       } else {
//         Alert.alert("Order Error", res.data.message);
//       }
//     } catch (err) {
//       console.error("Order creation failed:", err.message);
//       Alert.alert("Error", "Order creation failed.");
//     }
//   };

//   // 💳 Handle payment
//   const handlePayNow = async () => {
//     if (!cartItems.length) return Alert.alert("Cart Empty", "Add items first.");
//     if (!address) return Alert.alert("No Address", "Please select shipping address.");

//     const created = await createServerOrder();
//     if (!created) return;

//     const { order_id, razorpayOrder, finalAmount } = created;
//     const serverAmountPaise = razorpayOrder?.amount;

//     const options = {
//       description: "RV-AGRIHUB Payment",
//       currency: "INR",
//       key: process.env.RAZORPAY_KEY || "rzp_test_RX082JQF5LtgWu",
//       amount: serverAmountPaise,
//       order_id: razorpayOrder.id,
//       name: "RV-AGRIHUB",
//       prefill: {
//         email: user?.email || "customer@example.com",
//         contact: address.phone,
//         name: address.full_name,
//       },
//       theme: { color: "#1a8e55" },
//     };

//     try {
//       const paymentData = await RazorpayCheckout.open(options);
//       setIsVerifyingPayment(true);

//       const verifyRes = await axios.post(`${BASE_URL}/api/orders/verify-payment`, {
//         order_id,
//         razorpay_order_id: paymentData.razorpay_order_id,
//         razorpay_payment_id: paymentData.razorpay_payment_id,
//         razorpay_signature: paymentData.razorpay_signature,
//       });

//       if (verifyRes.data.success) {
//         axios.delete(`${BASE_URL}/api/cart/clear/${customer_id}`).catch(() => {});
//         clearCartCount?.();
//         navigation.reset({
//           index: 0,
//           routes: [
//             {
//               name: "Home",
//               state: {
//                 routes: [
//                   {
//                     name: "PaymentSuccess",
//                     params: { order_id, amount: Number(finalAmount).toFixed(2) },
//                   },
//                 ],
//               },
//             },
//           ],
//         });
//       } else {
//         setIsVerifyingPayment(false);
//         Alert.alert("Verification Failed", verifyRes.data.message);
//       }
//     } catch {
//       setIsVerifyingPayment(false);
//       Alert.alert("Payment Cancelled", "Transaction not completed.");
//     }
//   };

//   const displayedPayAmount = serverOrder
//     ? Number(serverOrder.finalAmount).toFixed(2)
//     : Number(localGrandTotal || 0).toFixed(2);

//   if (loading)
//     return (
//       <View style={styles.loader}>
//         <ActivityIndicator size="large" color="#1a8e55" />
//       </View>
//     );

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: "#f9f9f9" }}>
//       <ScrollView contentContainerStyle={styles.container}>
//         {/* Header */}
//         <View style={styles.header}>
//           <TouchableOpacity onPress={() => navigation.goBack()}>
//             <Ionicons name="arrow-back" size={24} color="#000" />
//           </TouchableOpacity>
//           <Text style={styles.headerTitle}>Checkout</Text>
//           <View style={{ width: 24 }} />
//         </View>

//         {/* Summary */}
//         <View style={styles.summaryBox}>
//           <Text style={styles.sectionTitle}>Order Summary</Text>

//           <View style={styles.row}>
//             <Text style={styles.label}>Items Total</Text>
//             <Text style={styles.value}>₹{itemAmount.toFixed(2)}</Text>
//           </View>
//           <View style={styles.row}>
//             <Text style={styles.label}>Product Discount</Text>
//             <Text style={styles.value}>- ₹{productDiscountAmount.toFixed(2)}</Text>
//           </View>
//           <View style={styles.row}>
//             <Text style={styles.label}>Subtotal</Text>
//             <Text style={styles.value}>₹{subtotalAfterDiscount.toFixed(2)}</Text>
//           </View>

//           {/* Coupon Section */}
//           <View style={{ marginTop: 10 }}>
//             {appliedCoupon ? (
//               <View style={styles.couponAppliedBox}>
//                 <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
//                   <Text style={{ fontWeight: "700" }}>{appliedCoupon.coupon_code}</Text>
//                   <TouchableOpacity onPress={removeCoupon}>
//                     <Text style={{ color: "red", fontWeight: "600" }}>Remove</Text>
//                   </TouchableOpacity>
//                 </View>
//                 <Text style={{ marginTop: 6, color: "#444" }}>
//                   {appliedCoupon.description || "Coupon applied"}
//                 </Text>
//                 <View style={[styles.row, { marginTop: 8 }]}>
//                   <Text style={styles.label}>Coupon Discount</Text>
//                   <Text style={[styles.value, { color: "#2E7D32" }]}>
//                     - ₹{couponDiscountAmount.toFixed(2)}
//                   </Text>
//                 </View>
//                 {couponMessage && (
//                   <Text
//                     style={{
//                       marginTop: 6,
//                       color: couponMessageType === "error" ? "red" : "#2E7D32",
//                       fontSize: 13,
//                       fontWeight: "500",
//                     }}
//                   >
//                     {couponMessage}
//                   </Text>
//                 )}
//               </View>
//             ) : (
//               <>
//                 <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
//                   <TextInput
//                     placeholder="Enter coupon code"
//                     value={couponCodeInput}
//                     onChangeText={(text) => {
//                       setCouponCodeInput(text);
//                       setCouponMessage("");
//                       setCouponMessageType(null);
//                     }}
//                     style={styles.couponInput}
//                   />
//                   <TouchableOpacity
//                     onPress={() => applyCoupon(couponCodeInput)}
//                     style={styles.couponButton}
//                     disabled={isApplyingCoupon}
//                   >
//                     <Text style={{ color: "#fff", fontWeight: "700" }}>
//                       {isApplyingCoupon ? "..." : "Apply"}
//                     </Text>
//                   </TouchableOpacity>
//                 </View>

//                 {couponMessage ? (
//                   <Text
//                     style={{
//                       marginTop: 6,
//                       color: couponMessageType === "error" ? "red" : "#2E7D32",
//                       fontSize: 13,
//                       fontWeight: "500",
//                     }}
//                   >
//                     {couponMessage}
//                   </Text>
//                 ) : null}

//                 {availableCoupons.length > 0 && (
//                   <View style={{ marginTop: 10 }}>
//                     <TouchableOpacity
//                       onPress={() => setShowCoupons(!showCoupons)}
//                       style={{
//                         flexDirection: "row",
//                         alignItems: "center",
//                         justifyContent: "space-between",
//                         backgroundColor: "#e8f5e9",
//                         padding: 10,
//                         borderRadius: 8,
//                       }}
//                     >
//                       <Text style={{ fontWeight: "700", color: "#1a8e55" }}>
//                         {showCoupons ? "Hide Coupons" : "View Coupons"}
//                       </Text>
//                       <Ionicons
//                         name={showCoupons ? "chevron-up" : "chevron-down"}
//                         size={20}
//                         color="#1a8e55"
//                       />
//                     </TouchableOpacity>

//                     {showCoupons && (
//                       <FlatList
//                         data={availableCoupons}
//                         horizontal
//                         keyExtractor={(c) => String(c.id)}
//                         renderItem={({ item }) => (
//                           <TouchableOpacity
//                             style={styles.couponChip}
//                             onPress={() => applyCoupon(item.coupon_code)}
//                             activeOpacity={0.8}
//                           >
//                             <Text style={{ fontWeight: "700" }}>{item.coupon_code}</Text>
//                             <Text style={{ fontSize: 12 }}>
//                               {item.discount_type === "percentage"
//                                 ? `${item.discount_value}% off`
//                                 : `₹${item.discount_value} off`}
//                             </Text>
//                             {item.description && (
//                               <Text
//                                 style={{
//                                   fontSize: 11,
//                                   color: "#555",
//                                   textAlign: "center",
//                                 }}
//                                 numberOfLines={2}
//                               >
//                                 {item.description}
//                               </Text>
//                             )}
//                             <Text
//                               style={{
//                                 fontSize: 11,
//                                 color: "#666",
//                                 textAlign: "center",
//                                 fontStyle: "italic",
//                               }}
//                             >
//                               {item.min_order_amount
//                                 ? `Min. order ₹${item.min_order_amount}`
//                                 : "No minimum"}
//                             </Text>
//                           </TouchableOpacity>
//                         )}
//                       />
//                     )}
//                   </View>
//                 )}
//               </>
//             )}
//           </View>

//           <View style={styles.divider} />
//           <View style={styles.row}>
//             <Text style={styles.totalLabel}>Total Payable</Text>
//             <Text style={styles.totalValue}>₹{displayedPayAmount}</Text>
//           </View>
//         </View>

//         {/* Items */}
//         <View style={styles.itemsBox}>
//           <Text style={styles.sectionTitle}>Items ({cartItems.length})</Text>
//           {cartItems.map((item) => (
//             <View key={item.id} style={styles.cartCard}>
//               <Image source={{ uri: item.product.model_image }} style={styles.image} />
//               <View style={styles.details}>
//                 <Text style={styles.name}>{item.product.model_name}</Text>
//                 <Text style={styles.segment}>{item.product.segment}</Text>
//                 <Text style={styles.price}>₹ {item.product.price}</Text>
//                 <View style={styles.qtyRow}>
//                   <TouchableOpacity onPress={() => decreaseQty(item.id)}>
//                     <Ionicons name="remove-circle-outline" size={22} color="#548c5c" />
//                   </TouchableOpacity>
//                   <Text style={styles.qty}>{item.quantity}</Text>
//                   <TouchableOpacity onPress={() => increaseQty(item.id)}>
//                     <Ionicons name="add-circle-outline" size={22} color="#548c5c" />
//                   </TouchableOpacity>
//                 </View>
//               </View>
//               <TouchableOpacity onPress={() => removeItem(item.id)}>
//                 <Ionicons name="trash-outline" size={22} color="red" />
//               </TouchableOpacity>
//             </View>
//           ))}
//         </View>
//        </ScrollView>

//       <TouchableOpacity style={styles.payNowButton} onPress={handlePayNow}>
//         <Text style={styles.payNowText}>Pay ₹{displayedPayAmount}</Text>
//       </TouchableOpacity>

//     <Modal
//   visible={isVerifyingPayment}
//   transparent
//   animationType="fade"
//   onRequestClose={() => {}}
// >
//   <View style={styles.overlay}>
//     <View style={styles.modalBox}>
//       <Text style={styles.modalTitle}>Verifying your payment securely...</Text>
//       <Text style={styles.modalSubtitle}>Please don’t close or navigate away.</Text>
//     </View>
//   </View>
// </Modal>



//     </SafeAreaView>
//   );
// }
// const styles = StyleSheet.create({
//   container: { paddingBottom: 120 },
//   loader: { flex: 1, justifyContent: "center", alignItems: "center" },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 15,
//     borderBottomWidth: 1,
//     borderColor: "#eee",
//     backgroundColor: "#fff",
//   },
//   headerTitle: { flex: 1, textAlign: "center", fontSize: 18, fontWeight: "600" },
//   summaryBox: { backgroundColor: "#fff", margin: 12, borderRadius: 10, padding: 15, elevation: 3 },
//   sectionTitle: { fontWeight: "700", fontSize: 16, marginBottom: 6 },
//   row: { flexDirection: "row", justifyContent: "space-between", marginVertical: 6 },
//   label: { fontSize: 15, color: "#444" },
//   value: { fontSize: 15, fontWeight: "500", color: "#000" },
//   divider: { height: 1, backgroundColor: "#ddd", marginVertical: 8 },
//   totalLabel: { fontSize: 17, fontWeight: "700" },
//   totalValue: { fontSize: 17, fontWeight: "700", color: "#1a8e55" },
//   couponInput: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     height: 40,
//   },
//   couponButton: {
//     backgroundColor: "#1a8e55",
//     paddingHorizontal: 15,
//     paddingVertical: 10,
//     borderRadius: 8,
//   },
//   couponAppliedBox: {
//     padding: 10,
//     backgroundColor: "#f1fff3",
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#e0f1e7",
//   },
//   couponChip: {
//     backgroundColor: "#fff",
//     paddingVertical: 10,
//     paddingHorizontal: 12,
//     borderRadius: 10,
//     marginRight: 10,
//     borderWidth: 1,
//     borderColor: "#e0e0e0",
//     alignItems: "center",
//     justifyContent: "center",
//     width: 140,
//     elevation: 2,
//   },
//   itemsBox: { backgroundColor: "#fff", margin: 12, borderRadius: 10, padding: 15, elevation: 3 },
//   cartCard: {
//     flexDirection: "row",
//     backgroundColor: "#fff",
//     borderRadius: 10,
//     padding: 10,
//     marginBottom: 12,
//     elevation: 3,
//   },
//   image: { width: 80, height: 80, borderRadius: 8 },
//   details: { flex: 1, marginLeft: 12 },
//   name: { fontSize: 15, fontWeight: "600" },
//   segment: { fontSize: 13, color: "#777" },
//   price: { fontSize: 15, color: "#548c5c", fontWeight: "bold" },
//   qtyRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
//   qty: { marginHorizontal: 10, fontSize: 15, color: "#333" },
//   payNowButton: {
//     backgroundColor: "#1a8e55",
//     paddingVertical: 16,
//     alignItems: "center",
//     position: "absolute",
//     bottom: 0,
//     width: "100%",
//   },
//   payNowText: { color: "#fff", fontSize: 17, fontWeight: "700" },
//   transactionNotice: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#e8f5e9",
//     borderRadius: 8,
//     padding: 10,
//     marginHorizontal: 15,
//     marginBottom: 10,
//   },
//   transactionText: {
//     marginLeft: 8,
//     color: "#1a8e55",
//     fontSize: 14,
//     fontWeight: "600",
//   },

//   // 💚 Modal Styles
// overlay: {
//   position: "absolute",
//   top: 0,
//   left: 0,
//   right: 0,
//   bottom: 0,
//   backgroundColor: "rgba(0,0,0,0.65)",
//   justifyContent: "center",  // ✅ Perfect vertical centering
//   alignItems: "center",      // ✅ Perfect horizontal centering
//   zIndex: 9999,
// },
// modalBox: {
//   backgroundColor: "#fff",
//   width: "80%",
//   borderRadius: 18,
//   paddingVertical: 30,
//   paddingHorizontal: 20,
//   alignItems: "center",
//   justifyContent: "center",  // ✅ Center spinner + text inside
//   elevation: 20,
//   shadowColor: "#000",
//   shadowOpacity: 0.3,
//   shadowRadius: 10,
//   shadowOffset: { width: 0, height: 4 },
// },
// modalTitle: {
//   fontSize: 16,
//   fontWeight: "700",
//   color: "#1a8e55",
//   textAlign: "center",
//   marginBottom: 5,
// },
// modalSubtitle: {
//   fontSize: 13,
//   color: "#666",
//   textAlign: "center",
// },

// overlay: {
//   position: "absolute",
//   top: 0,
//   left: 0,
//   right: 0,
//   bottom: 0,
//   backgroundColor: "rgba(0,0,0,0.65)",
//   justifyContent: "center",  // ✅ Center vertically
//   alignItems: "center",      // ✅ Center horizontally
//   zIndex: 9999,
// },
// modalBox: {
//   backgroundColor: "#fff",
//   width: "80%",
//   borderRadius: 18,
//   paddingVertical: 40,       // ✅ Added a bit more padding for clean spacing
//   paddingHorizontal: 20,
//   alignItems: "center",
//   justifyContent: "center",
//   elevation: 20,
//   shadowColor: "#000",
//   shadowOpacity: 0.3,
//   shadowRadius: 10,
//   shadowOffset: { width: 0, height: 4 },
// },
// modalTitle: {
//   fontSize: 16,
//   fontWeight: "700",
//   color: "#1a8e55",
//   textAlign: "center",
//   marginBottom: 8,
// },
// modalSubtitle: {
//   fontSize: 13,
//   color: "#666",
//   textAlign: "center",
// },


// });



import React, { useEffect, useState, useContext, useMemo, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  TextInput,
  FlatList,
  Animated,
} from "react-native";
import { AuthContext } from "../Context/AuthContext";
import axios from "axios";
import BASE_URL from "../Config/api";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useFocusEffect } from "@react-navigation/native";
import RazorpayCheckout from "react-native-razorpay";
import { useCart } from "../Context/CartContext";

export default function CheckoutScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const customer_id = user?.customer_id;
  const { clearCartCount } = useCart();

  const [cartItems, setCartItems] = useState([]);
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [serverOrder, setServerOrder] = useState(null);
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  const [isPaying, setIsPaying] = useState(false); // 🚀 add this near other state vars

  // Coupons
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponDiscountAmount, setCouponDiscountAmount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");
  const [couponMessageType, setCouponMessageType] = useState(null);
  const [showCoupons, setShowCoupons] = useState(false);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  useEffect(() => {
    if (customer_id) {
      fetchCart();
      fetchDefaultAddress(customer_id);
      fetchAvailableCoupons();
    }
  }, [customer_id]);

  useFocusEffect(
    useCallback(() => {
      if (customer_id) fetchDefaultAddress(customer_id);
    }, [customer_id])
  );

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/cart/${customer_id}`);
      if (res.data.success) setCartItems(res.data.data || []);
    } catch (err) {
      console.error("Cart fetch error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchDefaultAddress = async (id) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/addresses/customer/${id}/defaults`);
      if (res.data.success) setAddress(res.data.data?.shipping || null);
    } catch {
      setAddress(null);
    }
  };

  const fetchAvailableCoupons = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/coupons/all`);
      if (res.data.success) setAvailableCoupons(res.data.coupons || []);
    } catch (err) {
      console.error("Coupon fetch error:", err.message);
    }
  };

  // 🧮 Totals
  const { itemAmount, productDiscountAmount, subtotalAfterDiscount, localGrandTotal } = useMemo(() => {
    const itemAmount = cartItems.reduce(
      (sum, item) => sum + parseFloat(item.product.price) * item.quantity,
      0
    );
    const productDiscountAmount = cartItems.reduce((sum, item) => {
      const pct = parseFloat(item.product.discount_percent || 0);
      return sum + ((parseFloat(item.product.price) * item.quantity * pct) / 100);
    }, 0);
    const subtotalAfterDiscount = itemAmount - productDiscountAmount;
    const localGrandTotal = subtotalAfterDiscount - couponDiscountAmount;
    return { itemAmount, productDiscountAmount, subtotalAfterDiscount, localGrandTotal };
  }, [cartItems, couponDiscountAmount]);

  // 🏷️ Apply coupon
  const applyCoupon = async (code = couponCodeInput) => {
    if (!code.trim()) {
      setCouponMessage("⚠️ Please enter a coupon code");
      setCouponMessageType("error");
      return;
    }
    try {
      setIsApplyingCoupon(true);
      const res = await axios.post(`${BASE_URL}/api/coupons/apply`, {
        coupon_code: code.trim(),
        customer_id,
        order_total: subtotalAfterDiscount,
      });
      if (res.data.success) {
        setAppliedCoupon(res.data.coupon_details);
        setCouponDiscountAmount(Number(res.data.discount || 0));
        setCouponMessage("✅ Coupon applied successfully!");
        setCouponMessageType("success");
        setCouponCodeInput("");
      } else {
        setAppliedCoupon(null);
        setCouponDiscountAmount(0);
        setCouponMessage(res.data.message || "❌ Invalid coupon");
        setCouponMessageType("error");
      }
    } catch {
      setCouponMessage("❌ Coupon not eligible");
      setCouponMessageType("error");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscountAmount(0);
    setCouponMessage("");
    setCouponMessageType(null);
  };

  const increaseQty = async (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
    await axios.put(`${BASE_URL}/api/cart/increment/${id}`).catch(() => { });
  };

  const decreaseQty = async (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
    await axios.put(`${BASE_URL}/api/cart/decrement/${id}`).catch(() => { });
  };

  const removeItem = async (id) => {
    await axios.delete(`${BASE_URL}/api/cart/delete/${id}`).catch(() => { });
    fetchCart();
  };

  // 🧾 Create order
  const createServerOrder = async () => {
    const itemsPayload = cartItems.map((item) => ({
      id: item.product.id,
      price: Number(item.product.price),
      quantity: item.quantity,
      discount_percent: Number(item.product.discount_percent || 0),
    }));

    try {
      const res = await axios.post(`${BASE_URL}/api/orders/create-order`, {
        customer_id,
        address_id: address.id,
        items: itemsPayload,
        coupon_code: appliedCoupon?.coupon_code || null,
        delivery_charge: 0,
      });
      if (res.data.success) {
        setServerOrder(res.data);
        return res.data;
      } else {
        Alert.alert("Order Error", res.data.message);
      }
    } catch (err) {
      console.error("Order creation error:", err.message);
      Alert.alert("Error", "Order creation failed.");
    }
  };

  // 💳 Payment
  const handlePayNow = async () => {

    if (isPaying) return; // 🚫 prevent double click
    setIsPaying(true);

    if (!cartItems.length) { setIsPaying(false); Alert.alert("Cart Empty", "Add items first."); return }
    if (!address) { Alert.alert("No Address", "Please select a shipping address."); setIsPaying(false); return; }

    const created = await createServerOrder();
    if (!created) {
      setIsPaying(false);
      return;
    };

    const { order_id, razorpayOrder, finalAmount } = created;
    const options = {
      description: "RV-AGRIHUB Payment",
      currency: "INR",
      key: process.env.RAZORPAY_KEY || "rzp_test_RX082JQF5LtgWu",
      amount: razorpayOrder.amount,
      order_id: razorpayOrder.id,
      name: "RV-AGRIHUB",
      prefill: {
        email: user?.email || "customer@example.com",
        contact: address.phone,
        name: address.full_name,
      },
      theme: { color: "#1a8e55" },
    };

    try {
      const paymentData = await RazorpayCheckout.open(options);
      setIsVerifyingPayment(true);

      const verifyRes = await axios.post(`${BASE_URL}/api/orders/verify-payment`, {
        order_id,
        razorpay_order_id: paymentData.razorpay_order_id,
        razorpay_payment_id: paymentData.razorpay_payment_id,
        razorpay_signature: paymentData.razorpay_signature,
      });

      if (verifyRes.data.success) {
        axios.delete(`${BASE_URL}/api/cart/clear/${customer_id}`).catch(() => { });
        clearCartCount?.();
        navigation.reset({
          index: 0,
          routes: [
            {
              name: "Home",
              state: {
                routes: [
                  {
                    name: "PaymentSuccess",
                    params: {
                      order_id,
                      razorpay_order_id: paymentData.razorpay_order_id,
                      razorpay_payment_id: paymentData.razorpay_payment_id,
                      amount: Number(finalAmount).toFixed(2)
                    },
                  },
                ],
              },
            },
          ],
        });
      } else {
        setIsVerifyingPayment(false);
        Alert.alert("Verification Failed", verifyRes.data.message);
      }
    } catch {
      setIsVerifyingPayment(false);
      Alert.alert("Payment Cancelled", "Transaction not completed.");
    } finally {
      // ✅ Always unlock after process ends
      setIsPaying(false);
    }
  };

  // const displayedPayAmount = serverOrder
  //   ? Number(serverOrder.finalAmount).toFixed(2)
  //   : Number(localGrandTotal || 0).toFixed(2);
  const displayedPayAmount = useMemo(
    () => Number(serverOrder?.finalAmount || localGrandTotal || 0).toFixed(2),
    [serverOrder, localGrandTotal]
  );


  if (loading)
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#1a8e55" />
      </View>
    );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f9f9f9" }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Checkout</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Summary */}
        <View style={styles.summaryBox}>
          <Text style={styles.sectionTitle}>Order Summary</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Items Total</Text>
            <Text style={styles.value}>₹{itemAmount.toFixed(2)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Product Discount</Text>
            <Text style={styles.value}>- ₹{productDiscountAmount.toFixed(2)}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Subtotal</Text>
            <Text style={styles.value}>₹{subtotalAfterDiscount.toFixed(2)}</Text>
          </View>

          {/* Coupons Section */}
          <View style={{ marginTop: 10 }}>
            {appliedCoupon ? (
              <View style={styles.couponAppliedBox}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={{ fontWeight: "700" }}>{appliedCoupon.coupon_code}</Text>
                  <TouchableOpacity onPress={removeCoupon}>
                    <Text style={{ color: "red", fontWeight: "600" }}>Remove</Text>
                  </TouchableOpacity>
                </View>
                <Text style={{ color: "#444" }}>{appliedCoupon.description || ""}</Text>
                <View style={[styles.row, { marginTop: 8 }]}>
                  <Text style={styles.label}>Coupon Discount</Text>
                  <Text style={[styles.value, { color: "#2E7D32" }]}>
                    - ₹{couponDiscountAmount.toFixed(2)}
                  </Text>
                </View>
              </View>
            ) : (
              <>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <TextInput
                    placeholder="Enter coupon code"
                    value={couponCodeInput}
                    onChangeText={setCouponCodeInput}
                    style={styles.couponInput}
                  />
                  <TouchableOpacity
                    onPress={() => applyCoupon(couponCodeInput)}
                    style={styles.couponButton}
                    disabled={isApplyingCoupon}
                  >
                    <Text style={{ color: "#fff", fontWeight: "700" }}>
                      {isApplyingCoupon ? "..." : "Apply"}
                    </Text>
                  </TouchableOpacity>
                </View>

                {couponMessage ? (
                  <Text
                    style={{
                      marginTop: 6,
                      color: couponMessageType === "error" ? "red" : "#2E7D32",
                      fontSize: 13,
                      fontWeight: "500",
                    }}
                  >
                    {couponMessage}
                  </Text>
                ) : null}

                {availableCoupons.length > 0 && (
                  <View style={{ marginTop: 10 }}>
                    <TouchableOpacity
                      onPress={() => setShowCoupons(!showCoupons)}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        backgroundColor: "#e8f5e9",
                        padding: 10,
                        borderRadius: 8,
                        marginBottom:5
                      }}
                    >
                      <Text style={{ fontWeight: "700", color: "#1a8e55" }}>
                        {showCoupons ? "Hide Coupons" : "View Coupons"}
                      </Text>
                      <Ionicons
                        name={showCoupons ? "chevron-up" : "chevron-down"}
                        size={20}
                        color="#1a8e55"
                      />
                    </TouchableOpacity>

                    {/* {showCoupons && (
                      <FlatList
                        data={availableCoupons}
                        horizontal
                        keyExtractor={(c) => String(c.id)}
                        renderItem={({ item }) => (
                          <TouchableOpacity
                            style={styles.couponChip}
                            onPress={() => applyCoupon(item.coupon_code)}
                            activeOpacity={0.8}
                          >
                            <Text style={{ fontWeight: "700" }}>{item.coupon_code}</Text>
                            <Text style={{ fontSize: 12 }}>
                              {item.discount_type === "percentage"
                                ? `${item.discount_value}% off`
                                : `₹${item.discount_value} off`}
                            </Text>
                            <Text
                              style={{
                                fontSize: 11,
                                color: "#555",
                                textAlign: "center",
                                marginTop: 3,
                              }}
                              numberOfLines={2}
                            >
                              {item.description || ""}
                            </Text>
                          </TouchableOpacity>
                        )}
                      />
                    )} */}

                    {showCoupons && (
                      <FlatList
                        data={availableCoupons}
                        horizontal
                        keyExtractor={(c) => String(c.id)}
                        renderItem={({ item }) => (
                          <TouchableOpacity
                            style={styles.couponChip}
                            onPress={() => applyCoupon(item.coupon_code)}
                            activeOpacity={0.8}
                          >
                            {/* Coupon Code */}
                            <Text style={{ fontWeight: "700", fontSize: 14, color: "#1a8e55" }}>
                              {item.coupon_code}
                            </Text>

                            {/* Description */}
                            <Text
                              style={{
                                fontSize: 13,
                                color: "#000000ff",
                                marginTop: 2,
                                textAlign: "center",
                                fontWeight: "400",
                              }}
                              numberOfLines={1}
                            >
                              {item.description || "No description"}
                            </Text>

                            {/* Minimum Order Amount */}
                            <Text
                              style={{
                                fontSize: 12,
                                color: "#000000ff",
                                marginTop: 4,
                                textAlign: "center",
                                fontWeight: "400",
                              }}
                            >
                              Min Order: ₹{item.min_order_amount}
                            </Text>
                          </TouchableOpacity>
                        )}
                      />
                    )}

                  </View>
                )}
              </>
            )}
          </View>

          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.totalLabel}>Total Payable</Text>
            <Text style={styles.totalValue}>₹{displayedPayAmount}</Text>
          </View>
        </View>

        {/* Items */}
        <View style={styles.itemsBox}>
          <Text style={styles.sectionTitle}>Items ({cartItems.length})</Text>
          {cartItems.map((item) => (
            <View key={item.id} style={styles.cartCard}>
              <Image source={{ uri: item.product.model_image }} style={styles.image} />
              <View style={styles.details}>
                <Text style={styles.name}>{item.product.model_name}</Text>
                <Text style={styles.segment}>{item.product.segment}</Text>
                <Text style={styles.price}>₹ {item.product.price}</Text>
                <View style={styles.qtyRow}>
                  <TouchableOpacity onPress={() => decreaseQty(item.id)}>
                    <Ionicons name="remove-circle-outline" size={22} color="#548c5c" />
                  </TouchableOpacity>
                  <Text style={styles.qty}>{item.quantity}</Text>
                  <TouchableOpacity onPress={() => increaseQty(item.id)}>
                    <Ionicons name="add-circle-outline" size={22} color="#548c5c" />
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity onPress={() => removeItem(item.id)}>
                <Ionicons name="trash-outline" size={22} color="red" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Rich verification UI */}
      {/* {isVerifyingPayment && (
        <Animated.View style={styles.verifyingBox}>
          <ActivityIndicator size="small" color="#2e7d32" />
          <Text style={styles.verifyingText}>Verifying your payment securely...</Text>
        </Animated.View>
      )} */}

      {isVerifyingPayment && (
        <Animated.View style={styles.verifyingBox}>
          <Animated.View style={styles.verifyingGlow} />
          <View style={styles.verifyingContent}>
            <Ionicons name="lock-closed-outline" size={22} color="#1a8e55" />
            <ActivityIndicator
              size="small"
              color="#1a8e55"
              style={{ marginHorizontal: 10 }}
            />
            <Text style={styles.verifyingText}>
              Verifying your payment securely...
            </Text>
          </View>
        </Animated.View>
      )}


      {/* Pay Button */}
      <TouchableOpacity s style={[styles.payNowButton, isPaying && { backgroundColor: "#a5d6a7" }]} onPress={handlePayNow} disabled={isPaying} // 🚫 disable multiple taps
        activeOpacity={isPaying ? 1 : 0.7}>
        {isPaying ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <ActivityIndicator color="#fff" size="small" />
            <Text style={styles.payNowText}>Processing...</Text>
          </View>
        ) : (
          <Text style={styles.payNowText}>Pay ₹{displayedPayAmount}</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 140 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },
  headerTitle: { flex: 1, textAlign: "center", fontSize: 18, fontWeight: "600" },
  summaryBox: { backgroundColor: "#fff", margin: 12, borderRadius: 10, padding: 15, elevation: 3 },
  sectionTitle: { fontWeight: "700", fontSize: 16, marginBottom: 6 },
  row: { flexDirection: "row", justifyContent: "space-between", marginVertical: 6 },
  label: { fontSize: 15, color: "#444" },
  value: { fontSize: 15, fontWeight: "500", color: "#000" },
  divider: { height: 1, backgroundColor: "#ddd", marginVertical: 8 },
  totalLabel: { fontSize: 17, fontWeight: "700", color: "#000" },
  totalValue: { fontSize: 17, fontWeight: "700", color: "#1a8e55" },
  couponInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
  },
  couponButton: {
    backgroundColor: "#1a8e55",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
  },
  couponAppliedBox: {
    padding: 10,
    backgroundColor: "#f1fff3",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0f1e7",
  },
  couponChip: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    alignItems: "center",
    justifyContent: "center",
    width: 140,
    elevation: 2,
  },
  itemsBox: { backgroundColor: "#fff", margin: 12, borderRadius: 10, padding: 15, elevation: 3 },
  cartCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    elevation: 3,
    alignItems: "center",
  },
  image: { width: 80, height: 80, borderRadius: 8 },
  details: { flex: 1, marginLeft: 12 },
  name: { fontSize: 15, fontWeight: "600" },
  segment: { fontSize: 13, color: "#777" },
  price: { fontSize: 15, color: "#548c5c", fontWeight: "bold" },
  qtyRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  qty: { marginHorizontal: 10, fontSize: 15, color: "#333" },
  payNowButton: {
    backgroundColor: "#1a8e55",
    paddingVertical: 16,
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    width: "100%",
    elevation: 20,
  },
  payNowText: { color: "#fff", fontSize: 17, fontWeight: "700" },
  // verifyingBox: {
  //   position: "absolute",
  //   bottom: 260,
  //   left: 20,
  //   right: 20,
  //   backgroundColor: "#ffffffff",
  //   borderRadius: 10,
  //   paddingVertical: 12,
  //   flexDirection: "row",
  //   justifyContent: "center",
  //   alignItems: "center",
  //   shadowColor: "#1a8e55",
  //   shadowOpacity: 0.6,
  //   shadowRadius: 6,
  //   elevation: 10,
  // },
  // verifyingText: {
  //   color: "#2e7d32",
  //   fontWeight: "700",
  //   fontSize: 14,
  //   marginLeft: 8,
  //   justifyContent: "center",

  //   textShadowColor: "#0003",
  //   textShadowOffset: { width: 0, height: 1 },
  //   textShadowRadius: 2,
  // },


  verifyingBox: {
    position: "absolute",
    bottom: 250,
    left: 20,
    right: 20,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    elevation: 18,
    shadowColor: "#1a8e55",
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },

  verifyingGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    backgroundColor: "rgba(26,142,85,0.15)",
    shadowColor: "#1a8e55",
    shadowOpacity: 0.7,
    shadowRadius: 25,
    elevation: 8,
    zIndex: -1,
    opacity: 0.9,
  },

  verifyingContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  verifyingText: {
    color: "#1a8e55",
    fontWeight: "700",
    fontSize: 15,
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

});
