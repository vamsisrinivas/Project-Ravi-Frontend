import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

export default function RvHubScreen({ navigation }) {
  return (
    <View style={styles.container}>

      {/* 🌿 Vedik */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.navigate("Vedik")}
      >
        <LinearGradient colors={["#66BB6A", "#2E7D32"]} style={styles.card}>
          <Ionicons name="leaf" size={42} color="#fff" />
          <Text style={styles.title}>Vedik</Text>
          <Text style={styles.sub}>Natural & Organic Products</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* 🌱 Seedlings */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.navigate("Seedlings")}
      >
        <LinearGradient colors={["#8BC34A", "#558B2F"]} style={styles.card}>
          <FontAwesome5 name="seedling" size={40} color="#fff" />
          <Text style={styles.title}>Seedlings</Text>
          <Text style={styles.sub}>Nursery & Plant Orders</Text>
        </LinearGradient>
      </TouchableOpacity>

    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f4f6f5",
  },
  card: {
    height: 160,
    borderRadius: 22,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    marginTop: 12,
  },
  sub: {
    fontSize: 13,
    color: "#E8F5E9",
    marginTop: 6,
  },
});
