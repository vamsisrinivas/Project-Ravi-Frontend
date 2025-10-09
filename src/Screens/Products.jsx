


import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Picker } from "@react-native-picker/picker";
import SearchwithCart from "../Components/SearchwithCart";
import BASE_URL from "../Config/api";
import { AuthContext } from "../Context/AuthContext"; // ✅ import context
import useAddToCart from "../Components/AddToCartFun"; // ✅ import hook
import Toast from "react-native-toast-message";

export default function Products({ navigation }) {

  const { user } = useContext(AuthContext); // ✅ get logged in user
  const customer_id = user?.customer_id;    // ✅ extract customer_id


  // ✅ hook for add-to-cart
  const { addToCart, loading: cartLoading } = useAddToCart(customer_id);

  const [models, setModels] = useState([]);
  const [filteredModels, setFilteredModels] = useState([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [gridView, setGridView] = useState(true);

  const [categoryTypes, setCategoryTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [selectedType, setSelectedType] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [favorites, setFavorites] = useState({});



  // Fetch Models
  useEffect(() => {
    fetch(`${BASE_URL}/api/models`)
      .then((res) => res.json())
      .then((data) => {
        setModels(data);
        setFilteredModels(data);

        const types = [...new Set(data.map((m) => m.category?.category_type))];
        setCategoryTypes(types);

        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);


  // Filters
  useEffect(() => {
    let result = [...models];

    if (query) {
      result = result.filter((m) =>
        m.model_name.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (selectedType) {
      result = result.filter((m) => m.category?.category_type === selectedType);

      const cats = [
        ...new Map(
          result.map((m) => [
            m.category?.id,
            { id: m.category?.id, name: m.category?.category_name },
          ])
        ).values(),
      ];
      setCategories(cats);
    } else {
      setCategories([]);
    }

    if (selectedCategory) {
      result = result.filter((m) => m.category?.id === selectedCategory);

      const brs = [
        ...new Map(
          models
            .filter((m) => m.category?.id === selectedCategory)
            .map((m) => [
              m.brand?.id,
              { id: m.brand?.id, name: m.brand?.brand_name },
            ])
        ).values(),
      ];
      setBrands(brs);
    } else {
      setBrands([]);
    }

    if (selectedBrand) {
      result = result.filter((m) => m.brand?.id === selectedBrand);
    }

    if (sortOrder === "low") {
      result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (sortOrder === "high") {
      result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    }

    setFilteredModels(result);
  }, [query, sortOrder, selectedType, selectedCategory, selectedBrand, models]);


  const renderCard = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, gridView ? styles.cardGrid : styles.cardList]}
      activeOpacity={0.9}
      onPress={() =>
        navigation.navigate("ProductDetailPage", { product: item })
      }
    >
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: item.model_image }}
          style={gridView ? styles.image : styles.imageList}
          resizeMode="cover"
        />

        {/* Keep favorite button separate so only it intercepts its own taps */}
        <TouchableOpacity
          style={styles.favoriteBtn}
          onPress={() => alert("Favorite clicked!")}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="favorite-border" size={22} color="#ff4081" />
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1, paddingLeft: gridView ? 0 : 12 }}>
        <Text style={styles.name} numberOfLines={1}>
          {item.model_name}
        </Text>
        <Text style={styles.segment}>{item.segment}</Text>
        <Text style={styles.detail}>
          <Icon name="timelapse" size={14} color="#999" /> {item.maturity}
        </Text>
        <Text style={styles.price}>₹ {item.price}</Text>

        <View style={styles.btnRow}>
          <TouchableOpacity
            style={styles.cartBtn}
            onPress={() => addToCart(item, 1)} // ✅ reuse hook
            disabled={cartLoading}
          >
            <Icon name="shopping-cart" size={18} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buyBtn}
          // onPress={handleAddToCart}
          >
            <Text style={styles.buyText}>Buy Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );


  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerText}>All Products</Text>
        <View style={{ width: 45 }} />
      </View>
      <SearchwithCart
        searchValue={query}
        onSearchChange={setQuery}
        onCartPress={() => navigation.navigate("CartScreen")}
      />


      {/* Filter Bar */}
      {/* 🔼 Clear + Sort Row */}
      <View style={styles.actionRow}>
        {/* Clear All */}
        <TouchableOpacity
          style={[styles.actionChip, styles.clearChip]}
          onPress={() => {
            setSelectedType("");
            setSelectedCategory("");
            setSelectedBrand("");
            setSortOrder("");
          }}
        >
          <Ionicons name="close-circle" size={16} color="#b30000" />
          <Text style={styles.clearText}>Clear Filters</Text>
        </TouchableOpacity>

        {/* Sort */}
        <TouchableOpacity
          style={[styles.actionChip, sortOrder && styles.sortChipActive]}
          onPress={() => {
            if (sortOrder === "") setSortOrder("low");
            else if (sortOrder === "low") setSortOrder("high");
            else setSortOrder("");
          }}
        >
          <Ionicons name="swap-vertical" size={16} color={sortOrder ? "#fff" : "#333"} />
          <Text
            style={[
              styles.sortText,
              sortOrder && { color: "#fff", fontWeight: "600" },
            ]}
          >
            {sortOrder === "low"
              ? "Price: Low→High"
              : sortOrder === "high"
                ? "Price: High→Low"
                : "Sort"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 🔽 Filter Bar with Chips + Dropdowns */}
      <View style={styles.filterBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, alignItems: "center" }}
        >
          {/* Type Chips */}
          {categoryTypes.map((t, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                styles.filterChip,
                selectedType === t && styles.filterChipActive,
              ]}
              onPress={() => {
                setSelectedType(selectedType === t ? "" : t);
                setSelectedCategory("");
                setSelectedBrand("");
              }}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedType === t && styles.filterTextActive,
                ]}
              >
                {t}
              </Text>
            </TouchableOpacity>
          ))}

          {/* Category Dropdown */}
          <View style={styles.dropdownSmall}>
            <Picker
              selectedValue={selectedCategory}
              style={styles.dropdown}
              dropdownIconColor="#548c5c"
              onValueChange={(val) => {
                setSelectedCategory(val);
                setSelectedBrand("");
              }}
            >
              <Picker.Item label="Category" value="" color="#888" />
              {categories.map((c) => (
                <Picker.Item key={c.id} label={c.name} value={c.id} color="#222" />
              ))}
            </Picker>
          </View>

          {/* Brand Dropdown */}
          <View style={styles.dropdownSmall}>
            <Picker
              selectedValue={selectedBrand}
              style={styles.dropdown}
              dropdownIconColor="#548c5c"
              onValueChange={(val) => setSelectedBrand(val)}
            >
              <Picker.Item label="Brand" value="" color="#888" />
              {brands.map((b) => (
                <Picker.Item key={b.id} label={b.name} value={b.id} color="#222" />
              ))}
            </Picker>
          </View>
        </ScrollView>

      </View>


      {loading ? (
        <ActivityIndicator size="large" color="green" style={{ marginTop: 10 }} />
      ) : (
        <FlatList
          key={gridView ? "grid" : "list"}
          data={filteredModels}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCard}
          numColumns={gridView ? 2 : 1}
          columnWrapperStyle={gridView ? styles.row : null}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 5 }}
        />
      )}

                       <Toast position="bottom" bottomOffset={90} />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
    paddingHorizontal: 6,
    paddingTop: 8,
  },

  row: { justifyContent: "space-between" },

  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 10,
    marginBottom: 10,
    flex: 1,
    marginHorizontal: 1,
    elevation: 3,
  },
  cardGrid: { maxWidth: "50%" },
  cardList: { flexDirection: "row", alignItems: "center" },

  imageWrapper: { position: "relative" },
  image: { width: "100%", height: 140, borderRadius: 12 },
  imageList: { width: 100, height: 100, borderRadius: 12 },
  favoriteBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 20,
    padding: 4,
  },

  name: { fontSize: 15, fontWeight: "600", color: "#222", marginTop: 6 },
  segment: { fontSize: 12, color: "#4caf50", marginVertical: 2 },
  detail: { fontSize: 12, color: "#777", marginVertical: 2 },
  price: { fontSize: 16, fontWeight: "bold", color: "#e91e63", marginTop: 4 },

  btnRow: { flexDirection: "row", marginTop: 8 },
  cartBtn: {
    flex: 0.3,
    backgroundColor: "#4caf50",
    padding: 8,
    borderRadius: 10,
    alignItems: "center",
    marginRight: 6,
  },
  buyBtn: {
    flex: 0.7,
    backgroundColor: "#ff5722",
    padding: 8,
    borderRadius: 10,
    alignItems: "center",
  },
  buyText: { color: "#fff", fontWeight: "600", fontSize: 14 },

  filterBarCompact: {
    flexDirection: "row",
    backgroundColor: "#fff",
    margin: 10,
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 12,
    elevation: 2,
    alignItems: "center",
    justifyContent: "space-between",
  },
  filterChip: {
    backgroundColor: "#f5f5f5",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: "#4caf50",
  },
  filterText: { fontSize: 13, color: "#333" },
  filterTextActive: { color: "#fff", fontWeight: "600" },
  iconChip: {
    backgroundColor: "#eee",
    padding: 8,
    borderRadius: 20,
    marginRight: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  clearAllChip: {
    backgroundColor: "#ffcccc",
    borderColor: "#ff4d4d",
    textAlign: "center"
  },

  clearAllText: {
    color: "#b30000",
    fontWeight: "600",
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
  dropdownWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    marginHorizontal: 6,
    backgroundColor: "#fff",
    justifyContent: "center",
    overflow: "hidden", // keeps text inside rounded border
  },

  dropdown: {
    height: 55,
    minWidth: 150,
    paddingHorizontal: 10, // spacing so text is visible
    color: "#222",         // makes text visible
    fontSize: 14,          // readable size
  },


  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 10,
    marginBottom: 6,
  },

  actionChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    elevation: 1,
  },

  clearChip: {
    backgroundColor: "#ffe6e6",
  },
  clearText: {
    marginLeft: 6,
    color: "#b30000",
    fontWeight: "600",
  },

  sortChipActive: {
    backgroundColor: "#4caf50",
  },
  sortText: {
    marginLeft: 6,
    fontSize: 13,
    color: "#333",
  },

  filterBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 10,
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 12,
    elevation: 2,
  },

  filterChip: {
    backgroundColor: "#f5f5f5",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: "#4caf50",
  },
  filterText: { fontSize: 13, color: "#333" },
  filterTextActive: { color: "#fff", fontWeight: "600" },

  dropdownSmall: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 16,
    marginHorizontal: 6,
    backgroundColor: "#fff",
    overflow: "hidden",
    width: 130, // 👈 smaller width
    height: 35,
    justifyContent: "center",
  },
  dropdown: {
    height: 55,
    width: "100%",
    fontSize: 13,
    color: "#222",
  },

});
