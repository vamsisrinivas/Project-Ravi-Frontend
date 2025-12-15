// src/Screens/ContactUs.jsx
import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Linking,
  Platform,
  ToastAndroid,
  Share,
  KeyboardAvoidingView,
} from "react-native";
import FastImage from "@d11/react-native-fast-image";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import GoHomeButton from "../Components/GoHomeButton";
import { AuthContext } from "../Context/AuthContext";

export default function ContactUs({ navigation }) {
  const { logout } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // Replace these with your real support info
  const SUPPORT_PHONE = "+91-9949912636";
  const SUPPORT_EMAIL = "support@example.com";
  const SUPPORT_ADDRESS = "123, RV-AgriHub Street, Hyderabad, Telangana";

  const onCall = async () => {
    const url = `tel:${SUPPORT_PHONE}`;
    try {
      await Linking.openURL(url);
    } catch (err) {
      Alert.alert("Error", "Unable to open phone dialer.");
    }
  };

  const onEmail = async () => {
    const url = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
      "Support Request"
    )}&body=${encodeURIComponent("")}`;
    try {
      await Linking.openURL(url);
    } catch (err) {
      Alert.alert("Error", "Unable to open mail client.");
    }
  };

  const onShare = async () => {
    try {
      await Share.share({
        message: `Contact RV-AgriHub Support: ${SUPPORT_PHONE} / ${SUPPORT_EMAIL}`,
      });
    } catch (err) {}
  };

//   const copyToClipboard = (text) => {
//     try {
//       if (Platform.OS === "android") {
//         // Clipboard API differs between RN versions. Use RN global if available.
//         // For production replace with @react-native-clipboard/clipboard
//         // eslint-disable-next-line
//         const Clipboard = require("react-native").Clipboard || null;
//         if (Clipboard && Clipboard.setString) Clipboard.setString(text);
//         ToastAndroid.show("Copied to clipboard", ToastAndroid.SHORT);
//       } else {
//         const Clipboard = require("@react-native-clipboard/clipboard").default;
//         Clipboard.setString(text);
//         Alert.alert("Copied", "Copied to clipboard");
//       }
//     } catch (e) {
//       Alert.alert("Copy failed", "Clipboard not available");
//     }
//   };

  const onSubmit = () => {
    if (!name.trim()) {
      return Alert.alert("Validation", "Please enter your name.");
    }
    if (!email.trim()) {
      return Alert.alert("Validation", "Please enter your email.");
    }
    if (!message.trim()) {
      return Alert.alert("Validation", "Please write your message.");
    }

    // TODO: replace with API call
    Alert.alert(
      "Message Sent",
      "Thanks! Your message has been received. We'll contact you shortly.",
      [{ text: "OK", onPress: () => {
        setName(""); setEmail(""); setMessage("");
      }}]
    );
  };

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

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#F8F9FA" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        {/* Top Row */}
        <View style={styles.headerRow}>
          <GoHomeButton />
          <Text style={styles.headerText}>Contact Us</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero / Illustration */}
          <View style={styles.hero}>
            <FastImage
              source={{
                uri:
                  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=60",
              }}
              style={styles.heroImage}
              resizeMode="cover"
            />
            <View style={styles.heroOverlay}>
              <Text style={styles.heroTitle}>We're here to help</Text>
              <Text style={styles.heroSubtitle}>
                Reach out for support, feedback or partnership.
              </Text>
            </View>
          </View>

          {/* Contact Info Card */}
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="call" size={20} color="#2E7D32" />
              <View style={styles.infoBlock}>
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoValue}>{SUPPORT_PHONE}</Text>
              </View>
              <TouchableOpacity onPress={onCall} style={styles.iconBtn}>
                <Ionicons name="call" size={18} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="mail" size={20} color="#2E7D32" />
              <View style={styles.infoBlock}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{SUPPORT_EMAIL}</Text>
              </View>
              <TouchableOpacity onPress={onEmail} style={styles.iconBtn}>
                <Ionicons name="mail" size={18} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="location" size={20} color="#2E7D32" />
              <View style={styles.infoBlock}>
                <Text style={styles.infoLabel}>Address</Text>
                <Text style={styles.infoValue}>{SUPPORT_ADDRESS}</Text>
              </View>
              <TouchableOpacity
                onPress={() => copyToClipboard(SUPPORT_ADDRESS)}
                style={styles.iconBtnAlt}
              >
                <MaterialIcons name="content-copy" size={18} color="#2E7D32" />
              </TouchableOpacity>
            </View>

            {/* Quick actions */}
            {/* <View style={styles.quickActions}>
              <TouchableOpacity style={styles.quickBtn} onPress={onCall}>
                <Ionicons name="call" size={18} color="#fff" />
                <Text style={styles.quickText}>Call</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickBtn} onPress={onEmail}>
                <Ionicons name="mail" size={18} color="#fff" />
                <Text style={styles.quickText}>Email</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickBtn} onPress={onShare}>
                <Ionicons name="share-social" size={18} color="#fff" />
                <Text style={styles.quickText}>Share</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.quickBtn, { backgroundColor: "#F3F6FA", borderWidth: 1, borderColor: "#E0E0E0" }]}
                onPress={() => copyToClipboard(SUPPORT_PHONE)}
              >
                <MaterialIcons name="content-copy" size={18} color="#2E7D32" />
                <Text style={[styles.quickText, { color: "#2E7D32" }]}>Copy</Text>
              </TouchableOpacity>
            </View> */}
          </View>

          {/* Map placeholder */}
          <View style={styles.mapCard}>
            <FastImage
              source={{
                uri:
                  "https://cdn-icons-png.flaticon.com/512/684/684908.png",
              }}
              style={styles.mapImage}
              resizeMode="contain"
            />
            <Text style={styles.mapLabel}>Our Office Location</Text>
          </View>

          {/* Contact Form */}
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Send us a message</Text>

            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              style={styles.input}
              placeholderTextColor="#999"
            />
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Your email"
              keyboardType="email-address"
              style={styles.input}
              placeholderTextColor="#999"
            />
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Message"
              multiline
              numberOfLines={4}
              style={[styles.input, { height: 110, textAlignVertical: "top" }]}
              placeholderTextColor="#999"
            />

            <TouchableOpacity style={styles.submitBtn} onPress={onSubmit}>
              <Text style={styles.submitText}>Send Message</Text>
            </TouchableOpacity>
          </View>

          {/* Footer / Actions */}
          <View style={styles.footer}>
            <Text style={styles.footerNote}>
              Need urgent help? Call our support line — available 9:00 AM to 6:00 PM IST.
            </Text>

            <TouchableOpacity style={styles.callSupport} onPress={onCall}>
              <Text style={styles.callSupportText}>Call Support</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

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

  content: {
    padding: 16,
    paddingBottom: 36,
  },

  hero: {
    height: 140,
    marginBottom: 14,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
  },
  heroImage: { width: "100%", height: "100%", position: "absolute", opacity: 0.85 },
  heroOverlay: {
    paddingHorizontal: 16,
    zIndex: 2,
  },
  heroTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 6,
    textShadowColor: "rgba(0,0,0,0.12)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  heroSubtitle: {
    color: "#fff",
    fontSize: 13,
    opacity: 0.95,
  },

  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  infoBlock: {
    flex: 1,
    marginLeft: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: "#444",
    fontWeight: "700",
  },
  infoValue: {
    marginTop: 4,
    color: "#666",
    fontSize: 14,
  },
  iconBtn: {
    backgroundColor: "#2E7D32",
    width: 36,
    height: 36,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBtnAlt: {
    backgroundColor: "#F3F6FA",
    width: 36,
    height: 36,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },

  quickActions: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  quickBtn: {
    flex: 1,
    backgroundColor: "#2E7D32",
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  quickText: {
    color: "#fff",
    marginLeft: 8,
    fontWeight: "700",
  },

  mapCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    marginBottom: 12,
    elevation: 1,
  },
  mapImage: { width: 86, height: 86, opacity: 0.9, marginBottom: 8 },
  mapLabel: {
    color: "#444",
    fontWeight: "700",
  },

  formCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 18,
    elevation: 1,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F3F6FA",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    fontSize: 14,
    color: "#222",
  },
  submitBtn: {
    backgroundColor: "#2E7D32",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 6,
  },
  submitText: {
    color: "#fff",
    fontWeight: "800",
  },

  footer: {
    marginTop: 8,
    alignItems: "center",
  },
  footerNote: {
    color: "#666",
    textAlign: "center",
    marginBottom: 12,
  },
  callSupport: {
    backgroundColor: "#F3F6FA",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginBottom: 12,
  },
  callSupportText: {
    color: "#2E7D32",
    fontWeight: "800",
  },

  logoutButton: {
    backgroundColor: "#D9534F",
    paddingVertical: 12,
    borderRadius: 12,
    paddingHorizontal: 30,
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontWeight: "800",
  },
});
