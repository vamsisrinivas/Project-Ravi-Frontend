import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
  StatusBar,
  FlatList,
  ActivityIndicator,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import axios from "axios";

import BASE_URL from "../Config/api";
import SearchwithCart from "../Components/SearchwithCart";
import Banners from "./Banners";

const { width } = Dimensions.get("window");

const Home = () => {
  const [user, setUser] = useState(null);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const userData = await AsyncStorage.getItem("user");
      if (userData) setUser(JSON.parse(userData));
    })();
    fetchBrands();
    fetchCategories();
  }, []);

  const fetchBrands = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/brands`);
      setBrands(res.data);
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/categories`);
      setCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewAllBrands = () => {
    navigation.navigate("BrandsPage");
  };

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("token");
              await AsyncStorage.removeItem("user");
              setTimeout(() => {
                navigation.replace("Login");
              }, 100);
            } catch (error) {
              console.error("Logout error:", error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (!user) return null;

  return (
    <>
      <StatusBar
        backgroundColor="transparent"
        translucent
        barStyle="light-content"
      />

      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
          keyboardVerticalOffset={
            Platform.OS === "ios" ? 0 : StatusBar.currentHeight
          }
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView
              style={styles.container}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* Header */}
              <View style={styles.headerContainer}>
                <Image
                  source={require("../assets/Main_page_screen_1080x1920.png")}
                  style={styles.headerBackground}
                />
                <Image
                  source={require("../assets/Logo_type_2.png")}
                  style={styles.logoImage}
                />

                <TouchableOpacity
                  style={styles.userContainer}
                  onPress={handleLogout}
                >
                  <Text style={styles.greetingText}>Hi, {user.full_name}</Text>
                  <FontAwesome5 name="user" size={22} color="#fff" solid />
                </TouchableOpacity>

                <View style={styles.topBar}>
                  <SearchwithCart
                    searchValue={query}
                    onSearchChange={setQuery}
                    onCartPress={() => alert("Cart pressed!")}
                  />
                </View>
              </View>

              {/* Categories */}
              <View style={styles.contentContainer}>
                <View style={styles.brandHeader}>
                  <Text style={styles.sectionTitle}>Categories</Text>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("CategoryBrands", { all: true })
                    }
                  >
                    <Text style={styles.viewAllText}>View All</Text>
                  </TouchableOpacity>
                </View>

                {loading ? (
                  <ActivityIndicator size="large" color="green" />
                ) : (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{ marginVertical: 10 }}
                  >
                    {categories.slice(0, 8).map((cat) => (
                      <TouchableOpacity
                        key={cat.id}
                        style={styles.categoryItem}
                        onPress={() =>
                          navigation.navigate("CategoryBrands", {
                            categoryId: cat.id,
                            categoryName: cat.category_name,
                          })
                        }
                      >
                        <View style={styles.categoryCircle}>
                          <Image
                            source={{ uri: cat.category_image }}
                            style={styles.categoryIcon}
                          />
                        </View>
                        <Text style={styles.categoryLabel}>
                          {cat.category_name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                )}

                {/* Banners */}
                <Banners />
              </View>

              {/* Top Brands */}
              <View style={styles.contentContainer}>
                <View style={styles.brandHeader}>
                  <Text style={styles.sectionTitle}>Top Brands</Text>
                  <TouchableOpacity onPress={handleViewAllBrands}>
                    <Text style={styles.viewAllText}>View All</Text>
                  </TouchableOpacity>
                </View>

                <FlatList
                  data={brands.slice(0, 8)}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.brandCard}
                      onPress={() =>
                        navigation.navigate("CategoriesPage", {
                          brandId: item.id,
                          brandName: item.brand_name, // 👈 pass name also
                        })
                      }
                      activeOpacity={0.8}
                    >
                      <View style={styles.brandCircle}>
                        <Image
                          source={{ uri: item.brand_image }}
                          style={styles.brandImage}
                          resizeMode="contain"
                        />
                      </View>
                      <Text style={styles.brandName} numberOfLines={1}>
                        {item.brand_name}
                      </Text>
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item) => item.id.toString()}
                  numColumns={4}
                  scrollEnabled={false}
                  columnWrapperStyle={{
                    justifyContent: "space-between",
                    marginBottom: 20,
                  }}
                  contentContainerStyle={styles.brandGrid}
                />

              </View>

              <View style={{ height: 20 }} />
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  /* ---------- HEADER ---------- */
  headerContainer: {
    position: "relative",
    width: "100%",
    height: 240,
    overflow: "hidden",
  },
  headerBackground: {
    width: "100%",
    height: 750,
    resizeMode: "cover",
    position: "absolute",
  },
  logoImage: {
    position: "absolute",
    top: 30,
    left: 10,
    width: 120,
    height: 120,
    resizeMode: "contain",
  },
  userContainer: {
    position: "absolute",
    top: Platform.OS === "android" ? 15 : 20,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    zIndex: 10,
  },
  greetingText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    marginRight: 4,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 25,
    marginVertical: 20,
    top: 140,
  },

  /* ---------- CONTENT SECTIONS ---------- */
  contentContainer: {
    marginTop: 20,
  },
  brandHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  viewAllText: {
    fontSize: 14,
    color: "green",
    fontWeight: "600",
  },

  /* ---------- CATEGORIES ---------- */
  categoryItem: {
    alignItems: "center",
    marginHorizontal: 10,
  },
  categoryCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#f2f2f2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  categoryIcon: {
    width: 35,
    height: 35,
    resizeMode: "contain",
  },
  categoryLabel: {
    fontSize: 12,
    color: "black",
    textAlign: "center",
  },

  /* ---------- BRANDS ---------- */
  brandGrid: {
    paddingHorizontal: 10,
  },
  brandCard: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 5,
    margin: 3,
  },
  brandCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  brandImage: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  brandName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#444",
    textAlign: "center",
  },
});
