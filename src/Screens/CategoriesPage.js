// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   Image,
//   StyleSheet,
//   TouchableOpacity,
// } from 'react-native';
// import axios from 'axios';
// import { useRoute } from '@react-navigation/native';
// import BASE_URL from '../Config/api';
// import GoHomeButton from '../Components/GoHomeButton';
// import SearchwithCart from '../Components/SearchwithCart';
// import { useNavigation } from '@react-navigation/native';

// export default function CategoriesPage() {
//   const route = useRoute();
//   const { brandId, brandName } = route.params;
//   // inside CategoriesPage
//   const navigation = useNavigation();

//   const [categories, setCategories] = useState([]);
//   const [filteredCategories, setFilteredCategories] = useState([]);
//   const [query, setQuery] = useState('');

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   useEffect(() => {
//     if (query.trim() === '') {
//       setFilteredCategories(categories);
//     } else {
//       const lowerQuery = query.toLowerCase();
//       setFilteredCategories(
//         categories.filter(c => c.category_name.toLowerCase().includes(lowerQuery))
//       );
//     }
//   }, [query, categories]);

//   const fetchCategories = async () => {
//     try {
//       const res = await axios.get(`${BASE_URL}/api/categories/brand/${brandId}`);
//       setCategories(res.data);
//       setFilteredCategories(res.data);
//     } catch (error) {
//       console.error('Error fetching categories:', error);
//     }
//   };

//   const renderCategory = ({ item }) => (
//     <TouchableOpacity
//       style={styles.card}
//       onPress={() =>
//         navigation.navigate('ModelsPage', {
//           brandId: brandId,
//           brandName: brandName,
//           categoryId: item.id,
//           categoryName: item.category_name,
//         })
//       }
//     >
//       <Image
//         source={{ uri: item.category_image }}
//         style={styles.image}
//         resizeMode="contain"
//       />
//       <Text style={styles.name}>{item.category_name}</Text>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       {/* Header Row */}
//       <View style={styles.headerRow}>
//         <View style={{ width: 45, alignItems: 'flex-start' }}>
//           <GoHomeButton />
//         </View>
//         <View style={{ flex: 1, alignItems: 'center' }}>
//           <Text style={styles.headerText}>{brandName} - Categories</Text>
//         </View>
//         <View style={{ width: 40 }} />
//       </View>

//       {/* Search Bar */}
//       <SearchwithCart
//         searchValue={query}
//         onSearchChange={setQuery}
//         onCartPress={() => alert('Cart pressed!')}
//       />

//       {/* {Array.isArray(filteredCategories) && filteredCategories.length === 0 ? (
//         <View style={styles.noDataContainer}>
//           <Image
//             source={require("../assets/No-Product.png")}
//             style={styles.noDataImage}
//             resizeMode="contain"
//           />
//           <Text style={styles.noDataText}>No Categories Available</Text>
//         </View>
//       ) : (
//         <FlatList
//           data={filteredCategories || []}   // ✅ ensures array
//           renderItem={renderCategory}
//           keyExtractor={(item) => item.id.toString()}
//           numColumns={2}
//           columnWrapperStyle={{ justifyContent: "space-between" }}
//           contentContainerStyle={styles.listContent}
//         />
//       )} */}

// {loading ? (
//   <ActivityIndicator size="large" color="green" style={{ marginTop: 50 }} />
// ) : filteredItems.length === 0 ? (   // ✅ fixed
//   <View style={styles.noDataContainer}>
//     <Image
//       source={require("../assets/No-Product.png")}
//       style={styles.noDataImage}
//       resizeMode="contain"
//     />
//     <Text style={styles.noDataText}>No Categories Available</Text>
//   </View>
// ) : (
//   <FlatList
//     data={filteredItems}           // ✅ fixed
//     renderItem={renderItem}        // ✅ fixed
//     keyExtractor={(item) => item.id.toString()}
//     numColumns={2}
//     columnWrapperStyle={{ justifyContent: "space-between" }}
//     contentContainerStyle={styles.listContent}
//   />
// )}


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


//   noDataContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: 50,
//   },
//   noDataImage: {
//     width: 180,
//     height: 180,
//     marginBottom: 15,
//   },
//   noDataText: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#666",
//   },

// });


import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
// import FastImage from 'react-native-fast-image'

import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';
import BASE_URL from '../Config/api';
import GoHomeButton from '../Components/GoHomeButton';
import SearchwithCart from '../Components/SearchwithCart';

export default function CategoriesPage() {
  const route = useRoute();
  const { brandId, brandName } = route.params;
  const navigation = useNavigation();

  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);   // ✅ define loading

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (query.trim() === '') {
      setFilteredCategories(categories);
    } else {
      const lowerQuery = query.toLowerCase();
      setFilteredCategories(
        categories.filter(c =>
          c.category_name.toLowerCase().includes(lowerQuery)
        )
      );
    }
  }, [query, categories]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/categories/brand/${brandId}`);
      setCategories(res.data);
      setFilteredCategories(res.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('ModelsPage', {
          brandId: brandId,
          brandName: brandName,
          categoryId: item.id,
          categoryName: item.category_name,
        })
      }
    >
      <Image
        source={{ uri: item.category_image }}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.name}>{item.category_name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={{ width: 45, alignItems: 'flex-start' }}>
          <GoHomeButton />
        </View>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={styles.headerText}>{brandName} - Categories</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

     {/* Search */}
      <SearchwithCart
        searchValue={query}
        onSearchChange={setQuery}
        onCartPress={() => navigation.navigate("CartScreen")}
      />

      {/* List */}
      {loading ? (
        // <ActivityIndicator size="large" color="green" style={{ marginTop: 50 }} />
          <View>
    <FastImage
      source={require("../assets/loading.gif")}
      style={styles.gif}
      resizeMode={FastImage.resizeMode.contain}
    />
  </View>
      ) : filteredCategories.length === 0 ? (
        <View style={styles.noDataContainer}>
          <Image
            source={require('../assets/No-Product.png')}
            style={styles.noDataImage}
            resizeMode="contain"
          />
          <Text style={styles.noDataText}>No Categories Available</Text>
        </View>
      ) : (
        <FlatList
          data={filteredCategories}    // ✅ correct
          renderItem={renderCategory}  // ✅ correct
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 12, paddingTop: 5 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5, justifyContent: 'space-between', paddingVertical: 2 },
  headerText: { fontSize: 20, fontWeight: 'bold' },
  listContent: { paddingBottom: 20 },
  card: { width: '48%', backgroundColor: '#f9f9f9', borderRadius: 8, paddingVertical: 12, alignItems: 'center', marginBottom: 14, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  image: { width: '80%', height: 100, marginBottom: 8 },
  name: { fontSize: 14, textAlign: 'center', flexWrap: 'wrap' },
  noDataContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
  noDataImage: { width: 180, height: 180, marginBottom: 15 },
  noDataText: { fontSize: 16, fontWeight: '600', color: '#666' },
   gif: {
    width: "100%",
    height: "80%",
  },
});
