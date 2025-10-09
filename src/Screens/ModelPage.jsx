// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   Image,
//   StyleSheet,
//   TouchableOpacity,
//   ActivityIndicator,
// } from "react-native";
// import axios from "axios";
// import BASE_URL from "../Config/api";
// import GoHomeButton from "../Components/GoHomeButton";

// export default function ModelsPage({ route, navigation }) {
//   const { categoryId, categoryName } = route.params;

//   const [models, setModels] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchModels();
//   }, []);

//   const fetchModels = async () => {
//     try {
//       const res = await axios.get(`${BASE_URL}/api/models/category/${categoryId}`);
//       setModels(res.data);
//     } catch (error) {
//       console.error("Error fetching models:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderModel = ({ item }) => (
//     <TouchableOpacity
//       style={styles.card}
//       onPress={() => alert(`Clicked ${item.model_name}`)}
//     >
//       <Image source={{ uri: item.model_image }} style={styles.image} resizeMode="contain" />
//       <Text style={styles.name} numberOfLines={2}>{item.model_name}</Text>
//       <Text style={styles.price}>₹{item.price}</Text>
//       {item.discount_percent !== "0.00" && (
//         <Text style={styles.discount}>{item.discount_percent}% OFF</Text>
//       )}
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.headerRow}>
//         <GoHomeButton />
//         <Text style={styles.headerText}>{categoryName} - Models</Text>
//         <View style={{ width: 45 }} />
//       </View>

//       {loading ? (
//         <ActivityIndicator size="large" color="green" style={{ marginTop: 30 }} />
//       ) : (
//         <FlatList
//           data={models}
//           renderItem={renderModel}
//           keyExtractor={(item) => item.id.toString()}
//           numColumns={2}
//           columnWrapperStyle={{ justifyContent: "space-between" }}
//           contentContainerStyle={styles.listContent}
//         />
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     paddingHorizontal: 12,
//     paddingTop: 5,
//   },
//   headerRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 10,
//     justifyContent: "space-between",
//     paddingVertical: 5,
//   },
//   headerText: {
//     fontSize: 20,
//     fontWeight: "bold",
//     textAlign: "center",
//     flex: 1,
//   },
//   listContent: {
//     paddingBottom: 20,
//   },
//   card: {
//     width: "48%",
//     backgroundColor: "#f9f9f9",
//     borderRadius: 10,
//     padding: 10,
//     alignItems: "center",
//     marginBottom: 15,
//     elevation: 2,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     shadowOffset: { width: 0, height: 2 },
//   },
//   image: {
//     width: "80%",
//     height: 120,
//     marginBottom: 8,
//   },
//   name: {
//     fontSize: 14,
//     fontWeight: "600",
//     textAlign: "center",
//     marginBottom: 4,
//   },
//   price: {
//     fontSize: 14,
//     fontWeight: "700",
//     color: "green",
//   },
//   discount: {
//     fontSize: 12,
//     color: "red",
//     fontWeight: "600",
//   },
// });



import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import BASE_URL from "../Config/api";
import SearchwithCart from "../Components/SearchwithCart"; // ✅ IMPORT
import Ionicons from "react-native-vector-icons/Ionicons"; // add at top

export default function ModelsPage({ route, navigation }) {
  const { categoryId, categoryName } = route.params;

  const [models, setModels] = useState([]);
  const [filteredModels, setFilteredModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(''); // ✅ SEARCH STATE

  useEffect(() => {
    fetchModels();
  }, []);

  useEffect(() => {
    if (query.trim() === '') {
      setFilteredModels(models);
    } else {
      const lowerQuery = query.toLowerCase();
      setFilteredModels(
        models.filter(model =>
          model.model_name.toLowerCase().includes(lowerQuery)
        )
      );
    }
  }, [query, models]); // ✅ FILTER LOGIC

  const fetchModels = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/models/category/${categoryId}`);
      setModels(res.data);
      setFilteredModels(res.data); // ✅ INIT FILTERED DATA
    } catch (error) {
      console.error("Error fetching models:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderModel = ({ item }) => (
  <TouchableOpacity
  style={styles.card}
  onPress={() =>
    navigation.navigate("ProductDetailPage", { product: item })
  }
>
      <Image source={{ uri: item.model_image }} style={styles.image} resizeMode="contain" />
      <Text style={styles.name} numberOfLines={2}>{item.model_name}</Text>
      <Text style={styles.price}>₹{item.price}</Text>
      {item.discount_percent !== "0.00" && (
        <Text style={styles.discount}>{item.discount_percent}% OFF</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerText}>{categoryName} - Models</Text>
        <View style={{ width: 45 }} />
      </View>

      {/* ✅ Search Bar with Cart */}
      <SearchwithCart
        searchValue={query}
        onSearchChange={setQuery}
        onCartPress={() => navigation.navigate("CartScreen")}
      />

      {/* Models List */}
      {loading ? (
        <ActivityIndicator size="large" color="green" style={{ marginTop: 30 }} />
      ) :
       filteredModels.length === 0 ? (
        <View style={styles.noDataContainer}>
          <Image
            source={require("../assets/No-Product.png")} // ✅ put your image in assets
            style={styles.noDataImage}
            resizeMode="contain"
          />
          <Text style={styles.noDataText}>No Products Available</Text>
        </View> ):(
        <FlatList
          data={filteredModels} // ✅ filtered list
          renderItem={renderModel}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingTop: 5,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    width: "48%",
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    marginBottom: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  image: {
    width: "80%",
    height: 120,
    marginBottom: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: "700",
    color: "green",
  },
  discount: {
    fontSize: 12,
    color: "red",
    fontWeight: "600",
  },

  backBtn: {
    padding: 6,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingVertical: 5,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
noDataContainer: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  marginTop: 50,
},
noDataImage: {
  width: 180,
  height: 180,
  marginBottom: 15,
},
noDataText: {
  fontSize: 16,
  fontWeight: "600",
  color: "#666",
},

});
