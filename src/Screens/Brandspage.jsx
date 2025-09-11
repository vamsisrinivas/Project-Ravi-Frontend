

// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   Image,
//   StyleSheet,
//   TouchableOpacity,
//   Platform,
//   SafeAreaView,
//   StatusBar,
// } from 'react-native';
// import axios from 'axios';
// import { useNavigation } from '@react-navigation/native';
// import BASE_URL from '../Config/api';
// import GoHomeButton from '../Components/GoHomeButton';
// import SearchwithCart from '../Components/SearchwithCart';

// export default function BrandsPage() {
//   const [brands, setBrands] = useState([]);
//   const [filteredBrands, setFilteredBrands] = useState([]);
//   const [query, setQuery] = useState('');

//   const navigation = useNavigation();

//   useEffect(() => {
//     fetchBrands();
//   }, []);

//   useEffect(() => {
//     if (query.trim() === '') {
//       setFilteredBrands(brands);
//     } else {
//       const lowerQuery = query.toLowerCase();
//       setFilteredBrands(
//         brands.filter(b => b.brand_name.toLowerCase().includes(lowerQuery))
//       );
//     }
//   }, [query, brands]);

//   const fetchBrands = async () => {
//     try {
//       const res = await axios.get(`${BASE_URL}/api/brands`);
//       setBrands(res.data);
//       setFilteredBrands(res.data);
//     } catch (error) {
//       console.error('Error fetching brands:', error);
//     }
//   };

//   const renderBrand = ({ item }) => (
//     // <View style={styles.card}>
//     //   <Image
//     //     source={{ uri: item.brand_image }}
//     //     style={styles.image}
//     //     resizeMode="contain"
//     //   />
//     //   <Text style={styles.name}>{item.brand_name}</Text>
//     // </View>

//     <TouchableOpacity
//     style={styles.card}
//     onPress={() => navigation.navigate('CategoriesPage', { brandId: item.id, brandName: item.brand_name })}
//   >
//     <Image
//       source={{ uri: item.brand_image }}
//       style={styles.image}
//       resizeMode="contain"
//     />
//     <Text style={styles.name}>{item.brand_name}</Text>
//   </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.headerRow}>
//         <View style={{ width: 45, alignItems: 'flex-start' }}>
//           <GoHomeButton />
//         </View>
//         <View style={{ flex: 1, alignItems: 'center' }}>
//           <Text style={styles.headerText}>All Brands</Text>
//         </View>
//         <View style={{ width: 40 }} />
//       </View>

//       {/* Search Bar */}
//       <View>
//         <SearchwithCart
//           searchValue={query}
//           onSearchChange={setQuery}
//           onCartPress={() => alert('Cart pressed!')}
//         />
//       </View>

//       {/* Brand List */}
//       <FlatList
//         data={filteredBrands}
//         renderItem={renderBrand}
//         keyExtractor={(item) => item.id.toString()}
//         numColumns={2}
//         columnWrapperStyle={{ justifyContent: 'space-between' }}
//         contentContainerStyle={styles.listContent}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     paddingHorizontal: 12,
//     paddingTop: 5,
//   },
//   headerRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 5,
//     justifyContent: 'space-between',
//     paddingVertical: 2,
//   },
//   headerText: {
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   listContent: {
//     paddingBottom: 20,
//   },
//   card: {
//     width: '48%',
//     backgroundColor: '#f9f9f9',
//     borderRadius: 8,
//     paddingVertical: 12,
//     alignItems: 'center',
//     marginBottom: 14,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     shadowOffset: { width: 0, height: 2 },
//   },
//   image: {
//     width: '80%',
//     height: 100,
//     marginBottom: 8,
//   },
//   name: {
//     fontSize: 14,
//     textAlign: 'center',
//     flexWrap: 'wrap',
//   },
// });


//Design two
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import BASE_URL from "../Config/api";
import GoHomeButton from "../Components/GoHomeButton";
import SearchwithCart from "../Components/SearchwithCart";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.45;

export default function BrandsPage() {
  const [brands, setBrands] = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [query, setQuery] = useState("");

  const navigation = useNavigation();

  useEffect(() => {
    fetchBrands();
  }, []);

  useEffect(() => {
    if (query.trim() === "") {
      setFilteredBrands(brands);
    } else {
      const lowerQuery = query.toLowerCase();
      setFilteredBrands(
        brands.filter((b) => b.brand_name.toLowerCase().includes(lowerQuery))
      );
    }
  }, [query, brands]);

  const fetchBrands = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/brands`);
      setBrands(res.data);
      setFilteredBrands(res.data);
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  const BrandCard = ({ item }) => {
    const scale = new Animated.Value(1);

    const onPressIn = () => {
      Animated.spring(scale, {
        toValue: 0.95, // shrink a little
        useNativeDriver: true,
      }).start();
    };

    const onPressOut = () => {
      Animated.spring(scale, {
        toValue: 1,
        friction: 4,
        tension: 100,
        useNativeDriver: true,
      }).start();
    };

    return (
      <TouchableWithoutFeedback
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={() =>
          navigation.navigate("CategoriesPage", {
            brandId: item.id,
            brandName: item.brand_name,
          })
        }
      >
        <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: item.brand_image }}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.name} numberOfLines={2}>
            {item.brand_name}
          </Text>
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={{ width: 45, alignItems: "flex-start" }}>
          <GoHomeButton />
        </View>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={styles.headerText}>All Brands</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Search Bar */}
      <SearchwithCart
        searchValue={query}
        onSearchChange={setQuery}
        onCartPress={() => alert("Cart pressed!")}
      />

      {/* Brand List */}
      <FlatList
        data={filteredBrands}
        renderItem={({ item }) => <BrandCard item={item} />}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
    paddingHorizontal: 12,
    paddingTop: 5,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#222",
    letterSpacing: 0.5,
  },
  listContent: {
    paddingBottom: 30,
    paddingTop: 10,
  },
card: {
  width: CARD_WIDTH,
  backgroundColor: "#fff",
  borderRadius: 14,
  paddingVertical: 8,   // 👈 less vertical padding
  alignItems: "center",
  marginBottom: 14,

  // Shadows
  elevation: 4,
  shadowColor: "#000",
  shadowOpacity: 0.1,
  shadowRadius: 5,
  shadowOffset: { width: 0, height: 2 },
},
imageWrapper: {
  width: 120,   // 👈 slightly bigger
  height: 120,
  borderRadius: 60,
  backgroundColor: "#f4fdf6",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 6,  // 👈 tighter space to text
  borderWidth: 1,
  borderColor: "#e6f2e9",
  overflow: "hidden",  // 👈 ensures image stays inside circle
},
image: {
  width: "95%",  
  height: "95%",
  resizeMode: "contain",
},
name: {
  fontSize: 14,
  fontWeight: "600",
  textAlign: "center",
  color: "#333",
  paddingHorizontal: 4,
},

});
