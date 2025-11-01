// 📁 src/components/CustomToast.js
import React from "react";
import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import Toast from "react-native-toast-message";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const icons = {
  success: "https://cdn-icons-png.flaticon.com/512/845/845646.png",
  warning: "https://cdn-icons-png.flaticon.com/512/564/564619.png",
  error: "https://cdn-icons-png.flaticon.com/512/753/753345.png",
};

// 🔹 Reusable Toast Layout
const CustomToast = ({ text1, text2, iconUri, containerStyle, titleStyle, subtitleStyle }) => (
  <View style={[styles.toastContainer, containerStyle]}>
    <Image source={{ uri: iconUri }} style={styles.icon} />
    <View style={styles.textContainer}>
      <Text style={[styles.toastTitle, titleStyle]}>{text1}</Text>
      {text2 ? <Text style={[styles.toastSubtitle, subtitleStyle]}>{text2}</Text> : null}
    </View>
  </View>
);

// 🔹 Toast configuration
export const toastConfig = {
  success: (props) => (
    <CustomToast
      {...props}
      iconUri={icons.success}
      containerStyle={[styles.toastBase, styles.successToast]}
      titleStyle={styles.successTitle}
      subtitleStyle={styles.successSubtitle}
    />
  ),
  warning: (props) => (
    <CustomToast
      {...props}
      iconUri={icons.warning}
      containerStyle={[styles.toastBase, styles.warningToast]}
      titleStyle={styles.warningTitle}
      subtitleStyle={styles.warningSubtitle}
    />
  ),
  error: (props) => (
    <CustomToast
      {...props}
      iconUri={icons.error}
      containerStyle={[styles.toastBase, styles.errorToast]}
      titleStyle={styles.errorTitle}
      subtitleStyle={styles.errorSubtitle}
    />
  ),
};

// ✅ Global toast function (works anywhere)
export const showToast = (type, title, message, duration = 3000, position = "top") => {
  // Auto top offset for notch devices
  const topOffset = 60;

  Toast.show({
    type,
    text1: title,
    text2: message,
    position,
    topOffset,
    visibilityTime: duration,
  });
};

// 🔹 Styles
const styles = StyleSheet.create({
  toastBase: {
    width: width * 0.9,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 6,
  },
  toastContainer: { flexDirection: "row", alignItems: "center" },
  icon: { width: 22, height: 22, marginRight: 10, resizeMode: "contain" },
  textContainer: { flex: 1 },
  toastTitle: { fontWeight: "600", fontSize: 15 },
  toastSubtitle: { fontSize: 13, opacity: 0.9, marginTop: 1 },

  successToast: {
    backgroundColor: "#e8f5e9",
    borderColor: "#a5d6a7",
  },
  successTitle: { color: "#2e7d32" },
  successSubtitle: { color: "#1b5e20" },

  warningToast: {
    backgroundColor: "#fff3e0",
    borderColor: "#ffcc80",
  },
  warningTitle: { color: "#ef6c00" },
  warningSubtitle: { color: "#e65100" },

  errorToast: {
    backgroundColor: "#ffebee",
    borderColor: "#ef9a9a",
  },
  errorTitle: { color: "#b71c1c" },
  errorSubtitle: { color: "#7f0000" },
});

export default Toast;
