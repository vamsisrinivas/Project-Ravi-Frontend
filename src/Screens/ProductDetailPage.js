

// import React, { useState, useRef, useContext } from "react";
// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   FlatList,
//   Dimensions,
//   Alert,
// } from "react-native";
// import Ionicons from "react-native-vector-icons/Ionicons";
// import fallbackImage from "../assets/Not-Avaliable.jpeg"; 
// import { AuthContext } from "../Context/AuthContext"; 
// import useAddToCart from "../Components/AddToCartFun"; 
// import GoHomeButton from "../Components/GoHomeButton";

// const { width } = Dimensions.get("window");

// export default function ProductDetailPage({ route, navigation }) {
//   const { product } = route.params;
//   const [quantity, setQuantity] = useState(1);
//   const [activeIndex, setActiveIndex] = useState(0);
//   const flatListRef = useRef(null);

//   const { user } = useContext(AuthContext);
//   const customer_id = user?.customer_id;

//   // ✅ use global add-to-cart hook
//   const { addToCart, loading: cartLoading } = useAddToCart(customer_id);

//   // Images
//   const images = [
//     product.model_image ? { uri: product.model_image } : fallbackImage,
//     product.image1 ? { uri: product.image1 } : fallbackImage,
//   ];

//   const increaseQty = () => setQuantity((prev) => prev + 1);
//   const decreaseQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

//   const handleScroll = (event) => {
//     const slide = Math.round(event.nativeEvent.contentOffset.x / width);
//     setActiveIndex(slide);
//   };

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.headerRow}>
//         {/* <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
//           <Ionicons name="arrow-back" size={24} color="#333" />
//         </TouchableOpacity> */}
//             <View style={{ width: 45, alignItems: "flex-start" }}>
//                   <GoHomeButton />
//                 </View>
//         <Text style={styles.headerText}>{product.model_name}</Text>
//         <View style={{ width: 45 }} />
//       </View>

//       {/* Content */}
//       <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
//         {/* Image Slider */}
//         <FlatList
//           ref={flatListRef}
//           data={images}
//           keyExtractor={(_, index) => index.toString()}
//           horizontal
//           pagingEnabled
//           showsHorizontalScrollIndicator={false}
//           onScroll={handleScroll}
//           renderItem={({ item }) => (
//             <Image source={item} style={styles.image} resizeMode="contain" />
//           )}
//         />

//         {/* Dots */}
//         <View style={styles.dotsRow}>
//           {images.map((_, index) => (
//             <View
//               key={index}
//               style={[styles.dot, { opacity: activeIndex === index ? 1 : 0.3 }]}
//             />
//           ))}
//         </View>

//         {/* Title & Price */}
//         <Text style={styles.title}>{product.model_name}</Text>
//         <Text style={styles.price}>₹ {product.price}</Text>

//         {/* Description */}
//         <Text style={styles.sectionTitle}>Description</Text>
//         <Text style={styles.description}>{product.description}</Text>

//         {/* Extra Details */}
//         <Text style={styles.sectionTitle}>Product Details</Text>
//         <View style={styles.detailsBox}>
//           <Text style={styles.detail}>
//             <Text style={styles.bold}>Segment:</Text> {product.segment}
//           </Text>
//           <Text style={styles.detail}>
//             <Text style={styles.bold}>Plant:</Text> {product.plant}
//           </Text>
//           <Text style={styles.detail}>
//             <Text style={styles.bold}>Weight:</Text> {product.weight}
//           </Text>
//           <Text style={styles.detail}>
//             <Text style={styles.bold}>Maturity:</Text> {product.maturity}
//           </Text>
//         </View>

//         {/* Quantity */}
//         <View style={styles.qtyRow}>
//           <TouchableOpacity style={styles.qtyBtn} onPress={decreaseQty}>
//             <Ionicons name="remove" size={20} color="#fff" />
//           </TouchableOpacity>
//           <Text style={styles.qtyText}>{quantity}</Text>
//           <TouchableOpacity style={styles.qtyBtn} onPress={increaseQty}>
//             <Ionicons name="add" size={20} color="#fff" />
//           </TouchableOpacity>
//         </View>
//       </ScrollView>

//       {/* Footer Buttons */}
//       <View style={styles.footer}>
//         <TouchableOpacity
//           style={[styles.cartBtn, cartLoading && { opacity: 0.6 }]}
//           onPress={() => addToCart(product, quantity)} // ✅ use hook
//           disabled={cartLoading}
//         >
//           <Ionicons name="cart" size={20} color="#fff" />
//           <Text style={styles.cartBtnText}>
//             {cartLoading ? "Adding..." : "Add to Cart"}
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.buyBtn}
//           onPress={() =>
//             Alert.alert("Buy", `Proceeding to buy ${quantity} × ${product.model_name}`)
//           }
//         >
//           <Ionicons name="flash" size={20} color="#fff" />
//           <Text style={styles.buyBtnText}>Buy Now</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#fff" },
//   headerRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: "#eee",
//   },
//   backBtn: { padding: 6 },
//   headerText: { fontSize: 18, fontWeight: "bold", flex: 1, textAlign: "center" },

//   image: { width, height: 200, top: 10,marginBottom:20 },
//   dotsRow: { flexDirection: "row", justifyContent: "center", marginVertical: 8 },
//   dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "green", marginHorizontal: 4 },

//   title: { fontSize: 20, fontWeight: "bold", marginBottom: 6, paddingHorizontal: 12 },
//   price: { fontSize: 18, color: "red", marginBottom: 10, paddingHorizontal: 12, fontWeight: "bold" },

//   sectionTitle: { fontSize: 16, fontWeight: "bold", marginTop: 10, paddingHorizontal: 12 },
//   description: { fontSize: 14, color: "#555", paddingHorizontal: 12, marginTop: 4 },

//   detailsBox: {
//     backgroundColor: "#f8f8f8",
//     marginHorizontal: 12,
//     marginTop: 6,
//     padding: 10,
//     borderRadius: 8,
//   },
//   detail: { fontSize: 14, marginBottom: 4, color: "#444" },
//   bold: { fontWeight: "bold" },

//   qtyRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 20 },
//   qtyBtn: { backgroundColor: "green", padding: 10, borderRadius: 8 },
//   qtyText: { fontSize: 18, fontWeight: "bold", marginHorizontal: 15 },

//   footer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     padding: 12,
//     backgroundColor: "#fff",
//     borderTopWidth: 1,
//     borderTopColor: "#eee",
//   },
//   cartBtn: {
//     flex: 1,
//     flexDirection: "row",
//     backgroundColor: "green",
//     paddingVertical: 14,
//     borderRadius: 10,
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 8,
//   },
//   cartBtnText: { color: "#fff", fontSize: 16, marginLeft: 8, fontWeight: "bold" },
//   buyBtn: {
//     flex: 1,
//     flexDirection: "row",
//     backgroundColor: "orange",
//     paddingVertical: 14,
//     borderRadius: 10,
//     justifyContent: "center",
//     alignItems: "center",
//     marginLeft: 8,
//   },
//   buyBtnText: { color: "#fff", fontSize: 16, marginLeft: 8, fontWeight: "bold" },
// });




// import React, { useState, useRef, useContext } from "react";
// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   FlatList,
//   Dimensions,
// } from "react-native";
// import Ionicons from "react-native-vector-icons/Ionicons";
// import Toast from "react-native-toast-message"; // ✅ import Toast
// import fallbackImage from "../assets/Not-Avaliable.jpeg";
// import { AuthContext } from "../Context/AuthContext";
// import useAddToCart from "../Components/AddToCartFun";
// import GoHomeButton from "../Components/GoHomeButton";
// import { showToast } from "../Components/CustomToast";

// const { width } = Dimensions.get("window");

// export default function ProductDetailPage({ route, navigation }) {
//   const { product } = route.params;
//   const [quantity, setQuantity] = useState(1);
//   const [activeIndex, setActiveIndex] = useState(0);
//   const flatListRef = useRef(null);

//   const { user } = useContext(AuthContext);
//   const customer_id = user?.customer_id;

//   const { addToCart, loading: cartLoading } = useAddToCart(customer_id);

//   const images = [
//     product.model_image ? { uri: product.model_image } : fallbackImage,
//     product.image1 ? { uri: product.image1 } : fallbackImage,
//   ];

//   const increaseQty = () => setQuantity((prev) => prev + 1);
//   const decreaseQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

//   const handleScroll = (event) => {
//     const slide = Math.round(event.nativeEvent.contentOffset.x / width);
//     setActiveIndex(slide);
//   };

//   // ✅ handle Add to Cart with Toast
//   const handleAddToCart = async () => {
//     await addToCart(product, quantity);
 
//     showToast("success", "Success!", "Add to Cart successfully!");
    
//   };

//    const handleBuyNow = async (product) => {
//   try {
//     // Step 1: Add to cart (reuse your hook)
//     await addToCart(product, 1);
//     showToast("success", "Success!", "Add to Cart successfully!");

//     // Step 2: Navigate to Checkout
//    navigation.navigate("Home", { screen: "CartScreen" });
//   } catch (error) {
//     console.error("Buy Now error:", error);
//     // Toast.show({
//     //   type: "error",
//     //   text1: "Failed to Buy Now",
//     //   text2: "Please try again later",
//     // });

//     showToast("error", "Failed to Buy Now", "Please try again later!");
//   }
// };
//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.headerRow}>
//         <View style={{ width: 45, alignItems: "flex-start" }}>
//           <GoHomeButton />
//         </View>
//         <Text style={styles.headerText}>{product.model_name}</Text>
//         <View style={{ width: 45 }} />
//       </View>

//       {/* Content */}
//       <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
//         {/* Image Slider */}
//         <FlatList
//           ref={flatListRef}
//           data={images}
//           keyExtractor={(_, index) => index.toString()}
//           horizontal
//           pagingEnabled
//           showsHorizontalScrollIndicator={false}
//           onScroll={handleScroll}
//           renderItem={({ item }) => (
//             <Image source={item} style={styles.image} resizeMode="contain" />
//           )}
//         />

//         {/* Dots */}
//         <View style={styles.dotsRow}>
//           {images.map((_, index) => (
//             <View
//               key={index}
//               style={[styles.dot, { opacity: activeIndex === index ? 1 : 0.3 }]}
//             />
//           ))}
//         </View>

//         {/* Title & Price */}
//         <Text style={styles.title}>{product.model_name}</Text>
//         <Text style={styles.price}>₹ {product.price}</Text>

//         {/* Description */}
//         <Text style={styles.sectionTitle}>Description</Text>
//         <Text style={styles.description}>{product.description}</Text>

//         {/* Extra Details */}
//         <Text style={styles.sectionTitle}>Product Details</Text>
//         <View style={styles.detailsBox}>
//           <Text style={styles.detail}>
//             <Text style={styles.bold}>Segment:</Text> {product.segment}
//           </Text>
//           <Text style={styles.detail}>
//             <Text style={styles.bold}>Plant:</Text> {product.plant}
//           </Text>
//           <Text style={styles.detail}>
//             <Text style={styles.bold}>Weight:</Text> {product.weight}
//           </Text>
//           <Text style={styles.detail}>
//             <Text style={styles.bold}>Maturity:</Text> {product.maturity}
//           </Text>
//         </View>

//         {/* Quantity */}
//         <View style={styles.qtyRow}>
//           <TouchableOpacity style={styles.qtyBtn} onPress={decreaseQty}>
//             <Ionicons name="remove" size={20} color="#fff" />
//           </TouchableOpacity>
//           <Text style={styles.qtyText}>{quantity}</Text>
//           <TouchableOpacity style={styles.qtyBtn} onPress={increaseQty}>
//             <Ionicons name="add" size={20} color="#fff" />
//           </TouchableOpacity>
//         </View>

//         {/* Buttons (moved inside ScrollView) */}
//         <View style={styles.footer}>
//           <TouchableOpacity
//             style={[styles.cartBtn, cartLoading && { opacity: 0.6 }]}
//             onPress={handleAddToCart}
//             disabled={cartLoading}
//           >
//             <Ionicons name="cart" size={20} color="#fff" />
//             <Text style={styles.cartBtnText}>
//               {cartLoading ? "Adding..." : "Add to Cart"}
//             </Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={styles.buyBtn}
//          onPress={() => handleBuyNow(product)}
//           >
//             <Ionicons name="flash" size={20} color="#fff" />
//             <Text style={styles.buyBtnText}>Buy Now</Text>
//           </TouchableOpacity>
//         </View>

//       </ScrollView>

//     </View>
//   );
// }


import React, { useState, useRef, useContext } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  Dimensions,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import fallbackImage from "../assets/Not-Avaliable.jpeg";
import { AuthContext } from "../Context/AuthContext";
import useAddToCart from "../Components/AddToCartFun";
import GoHomeButton from "../Components/GoHomeButton";
import { showToast } from "../Components/CustomToast";

const { width } = Dimensions.get("window");

export default function ProductDetailPage({ route, navigation }) {
  const { product } = route.params;

  const [quantity, setQuantity] = useState(1);
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);

  const { user } = useContext(AuthContext);
  const customer_id = user?.customer_id;

  const { addToCart, loading: cartLoading } = useAddToCart(customer_id);

  // ✅ STOCK LOGIC
  const availableStock = Number(product.available_stock ?? 0);
  const isOutOfStock = availableStock <= 0;

  const images = [
    product.model_image ? { uri: product.model_image } : fallbackImage,
    product.image1 ? { uri: product.image1 } : fallbackImage,
  ];

  const increaseQty = () => {
    if (isOutOfStock) return;

    if (quantity < availableStock) {
      setQuantity((prev) => prev + 1);
    } else {
      showToast("info", "Stock limit reached", "No more stock available");
    }
  };

  const decreaseQty = () => {
    if (isOutOfStock) return;
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleScroll = (event) => {
    const slide = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(slide);
  };

  const handleAddToCart = async () => {
    await addToCart(product, quantity);
    showToast("success", "Success!", "Added to cart successfully!");
  };

  const handleBuyNow = async () => {
    await addToCart(product, 1);
    navigation.navigate("Home", { screen: "CartScreen" });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={{ width: 45 }}>
          <GoHomeButton />
        </View>
        <Text style={styles.headerText}>{product.model_name}</Text>
        <View style={{ width: 45 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Image Slider */}
        <FlatList
          ref={flatListRef}
          data={images}
          keyExtractor={(_, index) => index.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          renderItem={({ item }) => (
            <Image source={item} style={styles.image} resizeMode="contain" />
          )}
        />

        {/* Dots */}
        <View style={styles.dotsRow}>
          {images.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                { opacity: activeIndex === index ? 1 : 0.3 },
              ]}
            />
          ))}
        </View>

        {/* Title & Price */}
        <Text style={styles.title}>{product.model_name}</Text>
        <Text style={styles.price}>₹ {product.price}</Text>

        {/* {isOutOfStock && (
          <Text style={styles.outOfStockText}>Out of Stock</Text>
        )} */}

        {/* Description */}
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{product.description}</Text>

        {/* Product Details */}
        <Text style={styles.sectionTitle}>Product Details</Text>
        <View style={styles.detailsBox}>
          <Text style={styles.detail}>
            <Text style={styles.bold}>Segment:</Text> {product.segment}
          </Text>
          <Text style={styles.detail}>
            <Text style={styles.bold}>Plant:</Text> {product.plant}
          </Text>
          <Text style={styles.detail}>
            <Text style={styles.bold}>Weight:</Text> {product.weight}
          </Text>
          <Text style={styles.detail}>
            <Text style={styles.bold}>Maturity:</Text> {product.maturity}
          </Text>
        </View>

        {/* Quantity */}
        <View style={styles.qtyRow}>
          <TouchableOpacity
            style={[styles.qtyBtn, isOutOfStock && styles.disabledBtn]}
            onPress={decreaseQty}
            disabled={isOutOfStock}
          >
            <Ionicons name="remove" size={20} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.qtyText}>{quantity}</Text>

          <TouchableOpacity
            style={[styles.qtyBtn, isOutOfStock && styles.disabledBtn]}
            onPress={increaseQty}
            disabled={isOutOfStock}
          >
            <Ionicons name="add" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* ACTION BUTTONS */}
        <View style={styles.footer}>
          {isOutOfStock ? (
            <View style={styles.outOfStockBtn}>
              {/* <Ionicons name="close-circle" size={20} color="#fff" /> */}
              <Text style={styles.outOfStockBtnText}>Out of Stock</Text>
            </View>
          ) : (
            <>
              <TouchableOpacity
                style={[
                  styles.cartBtn,
                  cartLoading && { opacity: 0.6 },
                ]}
                onPress={handleAddToCart}
                disabled={cartLoading}
              >
                <Ionicons name="cart" size={20} color="#fff" />
                <Text style={styles.cartBtnText}>
                  {cartLoading ? "Adding..." : "Add to Cart"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.buyBtn} onPress={handleBuyNow}>
                <Ionicons name="flash" size={20} color="#fff" />
                <Text style={styles.buyBtnText}>Buy Now</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerText: { fontSize: 18, fontWeight: "bold", flex: 1, textAlign: "center" },

  image: { width, height: 200, top: 10, marginBottom: 20 },
  dotsRow: { flexDirection: "row", justifyContent: "center", marginVertical: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "green", marginHorizontal: 4 },

  title: { fontSize: 20, fontWeight: "bold", marginBottom: 6, paddingHorizontal: 12 },
  price: { fontSize: 18, color: "red", marginBottom: 10, paddingHorizontal: 12, fontWeight: "bold" },

  sectionTitle: { fontSize: 16, fontWeight: "bold", marginTop: 10, paddingHorizontal: 12 },
  description: { fontSize: 14, color: "#555", paddingHorizontal: 12, marginTop: 4 },

  detailsBox: {
    backgroundColor: "#f8f8f8",
    marginHorizontal: 12,
    marginTop: 6,
    padding: 10,
    borderRadius: 8,
  },
  detail: { fontSize: 14, marginBottom: 4, color: "#444" },
  bold: { fontWeight: "bold" },

  qtyRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 20 },
  qtyBtn: { backgroundColor: "green", padding: 10, borderRadius: 8 },
  qtyText: { fontSize: 18, fontWeight: "bold", marginHorizontal: 15 },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginHorizontal: 12,
  },
  cartBtn: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "green",
    paddingVertical: 14,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  cartBtnText: { color: "#fff", fontSize: 16, marginLeft: 8, fontWeight: "bold" },
  buyBtn: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "orange",
    paddingVertical: 14,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  buyBtnText: { color: "#fff", fontSize: 16, marginLeft: 8, fontWeight: "bold" },

  similarCard: {
    width: 120,
    margin: 10,
    borderRadius: 8,
    backgroundColor: "#f8f8f8",
    alignItems: "center",
    padding: 8,
  },
  similarImage: { width: 100, height: 100, borderRadius: 8 },
  similarText: { fontSize: 12, marginTop: 5, textAlign: "center" },

outOfStockBtn: {
  backgroundColor: "#b00020",
  padding: 16,
  borderRadius: 12,
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
margin:20,
  // ✅ CENTER IT
  alignSelf: "center",
  width: "90%",
},


  outOfStockBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    // marginLeft: 8,
  },
});
