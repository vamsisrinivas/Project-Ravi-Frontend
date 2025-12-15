// src/Screens/ProfileScreen.jsx
import React, { useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Share,
  Platform,
  Clipboard,
  ToastAndroid,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import FastImage from "@d11/react-native-fast-image";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { AuthContext } from "../Context/AuthContext";
import GoHomeButton from "../Components/GoHomeButton";

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { logout, user } = useContext(AuthContext);

  const fullName = user?.full_name || "User";
  const email = user?.email || "";
  const phone = user?.phone_no || "";
  const customerId = user?.customer_id ?? "";

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

  const handleEditProfile = () => {
    // navigate to edit profile screen (rename route if different)
    navigation.navigate("EditProfile");
  };

  const handleCall = () => {
    // Open phone dialer — leave implementation to react-native Linking in your app
    navigation.navigate("ContactUs"); // placeholder if you have a contact screen
  };

  const handleEmail = async () => {
    // placeholder navigate to email/compose screen or use Linking.mailto
    navigation.navigate("ContactUs");
  };

  const handleCopyId = async () => {
    // react-native Clipboard: use @react-native-clipboard/clipboard or Clipboard API
    try {
      if (Platform.OS === "android") {
        Clipboard.setString(String(customerId));
        ToastAndroid.show("Customer ID copied", ToastAndroid.SHORT);
      } else {
        Clipboard.setString(String(customerId));
        // iOS: you might want to show a toast/snackbar - implement in your app
      }
    } catch (e) {
      // fallback
    }
  };

  const onShare = async () => {
    try {
      await Share.share({
        message: `Check out this app — great features!`,
      });
    } catch (error) {
      // noop
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Row: Go Home / Title / spacer */}
      <View style={styles.headerRow}>
        <GoHomeButton />
        <Text style={styles.headerText}>My Profile</Text>
        <TouchableOpacity onPress={handleEditProfile} style={styles.headerAction}>
          <Ionicons name="pencil" size={20} color="#2E7D32" />
        </TouchableOpacity>
      </View>

      {/* Header / Profile Card */}
      <View style={styles.headerContainer}>
        <FastImage
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
          }}
          style={styles.avatar}
        />
        <Text style={styles.userName}>{fullName}</Text>
        {email ? <Text style={styles.userEmail}>{email}</Text> : null}
        {!email && phone ? <Text style={styles.userEmail}>{phone}</Text> : null}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.menuContainer}
      >
        {/* Compact Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="id-card" size={20} color="#2E7D32" />
            <View style={styles.infoBlock}>
              <Text style={styles.infoLabel}>Customer ID</Text>
              <Text style={styles.infoValue}>{String(customerId)}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="call" size={20} color="#2E7D32" />
            <View style={styles.infoBlock}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{phone || "-"}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="mail" size={20} color="#2E7D32" />
            <View style={styles.infoBlock}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{email || "-"}</Text>
            </View>
          </View>
        </View>

        {/* Action Row */}
        {/* <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={handleCall} activeOpacity={0.7}>
            <Ionicons name="call" size={20} color="#fff" />
            <Text style={styles.actionText}>Call</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={handleEmail} activeOpacity={0.7}>
            <Ionicons name="mail" size={20} color="#fff" />
            <Text style={styles.actionText}>Email</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={handleCopyId} activeOpacity={0.7}>
            <MaterialIcons name="content-copy" size={20} color="#fff" />
            <Text style={styles.actionText}>Copy ID</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={onShare} activeOpacity={0.7}>
            <Ionicons name="share-social" size={20} color="#fff" />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
        </View> */}

        {/* Small help card */}
        <View style={styles.helpCard}>
          <Text style={styles.helpTitle}>Need help?</Text>
          <Text style={styles.helpText}>
            For support, tap Contact Us in the menu or email support@example.com
          </Text>
          <TouchableOpacity
            style={styles.helpButton}
            onPress={() => navigation.navigate("ContactUs")}
            activeOpacity={0.8}
          >
            <Text style={styles.helpButtonText}>Contact Support</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

/* Styles */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 6,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222",
  },
  headerAction: {
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerContainer: {
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    paddingVertical: 26,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginHorizontal: 12,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 999,
    marginBottom: 10,
  },
  userName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2E7D32",
    marginTop: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
    marginTop: 6,
  },
  menuContainer: {
    padding: 16,
    paddingTop: 20,
    paddingBottom: 32,
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  infoBlock: {
    marginLeft: 12,
  },
  infoLabel: {
    color: "#444",
    fontWeight: "600",
    fontSize: 13,
  },
  infoValue: {
    color: "#666",
    marginTop: 2,
    fontSize: 15,
  },

  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 18,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: "#2E7D32",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 4,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  actionText: {
    color: "#fff",
    marginLeft: 8,
    fontWeight: "600",
  },

  helpCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.02,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 1,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },
  helpText: {
    color: "#666",
    marginBottom: 12,
  },
  helpButton: {
    backgroundColor: "#F3F6FA",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  helpButtonText: {
    color: "#2E7D32",
    fontWeight: "700",
  },

  logoutButton: {
    backgroundColor: "#D9534F",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 6,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
