
// import React, { useContext } from "react";
// import { View, Text, Button, StyleSheet, Alert } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import { AuthContext } from "../Context/AuthContext";

// const Profile = () => {
//   const navigation = useNavigation();
//   const { logout } = useContext(AuthContext);

//   const handleLogout = () => {
//     Alert.alert("Logout", "Are you sure you want to log out?", [
//       { text: "Cancel", style: "cancel" },
//       {
//         text: "Logout",
//         style: "destructive",
//         onPress: async () => {
//           await logout(); // ✅ clears AsyncStorage + state
//           navigation.reset({
//             index: 0,
//             routes: [{ name: "Login" }], // ✅ go back to Login
//           });
//         },
//       },
//     ]);
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Profile Screen</Text>
//       <Button title="Logout" onPress={handleLogout} color="#d9534f" />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#fff",
//   },
//   title: {
//     fontSize: 24,
//     marginBottom: 20,
//     fontWeight: "600",
//   },
// });

// export default Profile;



import React, { useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../Context/AuthContext";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import DeliveryAddress from "../Screens/AddressScreen.jsx";

const Profile = () => {
  const navigation = useNavigation();
  const { logout, user } = useContext(AuthContext); // ✅ get user info (from login)
  const fullName = user?.full_name || "User";

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          });
        },
      },
    ]);
  };

  const menuItems = [
    {
      id: 1,
      title: "My Profile",
      icon: <Ionicons name="person-circle-outline" size={26} color="#548C5C" />,
      onPress: () => navigation.navigate("MyProfile"),
    },
    {
      id: 2,
      title: "My Orders",
      icon: <MaterialIcons name="receipt-long" size={26} color="#548C5C" />,
      onPress: () => navigation.navigate("Orders"),
    },
    {
      id: 3,
      title: "Wishlist",
      icon: <Ionicons name="heart-outline" size={26} color="#548C5C" />,
      onPress: () => navigation.navigate("Wishlist"),
    },
    {
      id: 4,
      title: "Delivery Address",
      icon: <Ionicons name="location-outline" size={26} color="#548C5C" />,
      onPress: () => navigation.navigate("DeliveryAddress"),
    },
    {
      id: 5,
      title: "Contact Us",
      icon: <FontAwesome name="phone" size={24} color="#548C5C" />,
      onPress: () => navigation.navigate("ContactUs"),
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Ionicons name="person-circle" size={80} color="#548C5C" />
        <Text style={styles.userName}>Welcome</Text>
                <Text style={styles.userName}>{fullName}</Text>

        
      </View>

      {/* Menu Blocks */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.menuContainer}
      >
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={item.onPress}
            activeOpacity={0.7}
          >
            <View style={styles.menuLeft}>
              {item.icon}
              <Text style={styles.menuText}>{item.title}</Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color="#777" />
          </TouchableOpacity>
        ))}

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          {/* <Ionicons name="log-out-outline" size={22} color="#fff" /> */}
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  headerContainer: {
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    paddingVertical: 30,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  userName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2E7D32",
    marginTop: 2,
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
    marginTop: 3,
  },
  menuContainer: {
    padding: 15,
  },
  menuItem: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 15,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  menuText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  logoutButton: {
    backgroundColor: "#d9534f",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 15,
    marginTop: 20,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
