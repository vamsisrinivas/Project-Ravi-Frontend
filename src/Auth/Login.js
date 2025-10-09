
import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";
import BASE_URL from "../Config/api";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { AuthContext } from "../Context/AuthContext";
import Toast from "react-native-toast-message";


const Login = ({ navigation }) => {
  const [phone_no, setPhoneNo] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);


  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    if (loading) return;
    if (!phone_no || !password) {
      // Alert.alert("Validation Error", "Please enter both phone number and password");
      Toast.show({
      type: "error",
      text1: "Validation Error",
      text2: "Please enter both phone number and password",
      position: "bottom",
      visibilityTime: 3000,
      text1Style: { fontSize: 15, fontWeight: "bold" },
      text2Style: { fontSize: 12 },
    });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone_no, password }),
      });

      const data = await response.json();
      console.log(data)
      if (data.success) {
        await AsyncStorage.setItem("user", JSON.stringify(data.user));
        // ✅ store in AuthContext
        await login(data.user, data.token);

        Toast.show({
          type: "success",
          text1: "Login Success ✅",
          position: "bottom",
          visibilityTime: 3000,
          text1Style: { fontSize: 15, fontWeight: "bold" }, // Large toast
          text2Style: { fontSize: 12 },
        });

        navigation.reset({ index: 0, routes: [{ name: "MainApp" }] });
      } else {
        // Alert.alert("Login Failed", data.message || "Invalid credentials");
        Toast.show({
          type: "error",
          text1: data.message || "Invalid credentials",
          position: "bottom",
          visibilityTime: 3000,
          text1Style: { fontSize: 15, fontWeight: "bold" }, // Large toast
          text2Style: { fontSize: 12 },
        });
      }
    } catch (error) {
      // Alert.alert("Error", "Failed to login. Please try again later.");
      Toast.show({
        type: "error",
        text1: "Failed to login. Please try again later.",
        position: "bottom",
        visibilityTime: 3000,
        text1Style: { fontSize: 15, fontWeight: "bold" }, // Large toast
        text2Style: { fontSize: 12 },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#548c5c" }}>
      <KeyboardAwareScrollView
        style={{ flex: 1, backgroundColor: "white" }}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        extraScrollHeight={20} // space above keyboard
        keyboardOpeningTime={0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            {/* Top Image */}
            <View style={styles.curvedHeader}>
              <Image
                source={require("../assets/login_image_png.png")}
                style={styles.farmerImage}
              />
            </View>

            {/* Background + Form */}
            <View style={{ flex: 1 }}>
              <ImageBackground
                source={require("../assets/register_image_2.png")}
                style={styles.background}
                resizeMode="cover"
              >
                <View style={styles.formContainer}>
                  <View style={styles.logoCircle}>
                    <Image
                      source={require("../assets/Logo_type_2.png")}
                      style={styles.logoText}
                    />
                  </View>

                  <Text style={styles.title}>LOGIN</Text>
                  <Text style={styles.subtitle}>Enter your credentials</Text>

                  {/* Phone Input */}
                  <TextInput
                    placeholder="Phone Number"
                    placeholderTextColor="black"
                    value={phone_no}
                    onChangeText={setPhoneNo}
                    keyboardType="phone-pad"
                    style={styles.input}
                  />

                  {/* Password Input */}
                  <View style={styles.passwordContainer}>
                    <TextInput
                      placeholder="Password"
                      placeholderTextColor="black"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      style={styles.inputPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                      <Ionicons
                        name={showPassword ? "eye-off" : "eye"}
                        size={24}
                        color="grey"
                      />
                    </TouchableOpacity>
                  </View>

                  {/* Login Button */}
                  <TouchableOpacity
                    style={[styles.registerButton, loading && { opacity: 0.6 }]}
                    onPress={handleLogin}
                    disabled={loading}
                  >
                    <Text style={styles.registerButtonText}>
                      {loading ? "Logging in..." : "Login"}
                    </Text>
                  </TouchableOpacity>

                  {/* Footer */}
                  <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 10 }}>
                    <Text style={styles.footerText}>Don't have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                      <Text style={styles.loginLink}>Register</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ImageBackground>
            </View>
               <Toast position="bottom" bottomOffset={90} />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    minHeight: "100%",
  },
  curvedHeader: {
    backgroundColor: "#ffffff",
    alignItems: "center",
    paddingTop: 0,
  },
  farmerImage: {
    width: 300,
    height: 200,
    top: 20,
    resizeMode: "cover",
  },
  formContainer: {
    padding: 10,
    alignItems: "center",
    marginTop: 70,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -40,
  },
  logoText: {
    width: 150,
    height: 150,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    marginTop: 20,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#ffffff",
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    width: "85%",
    height: 40,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 9,
    marginVertical: 4,
  },
  registerButton: {
    backgroundColor: "#009b77",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    width: "80%",
    alignItems: "center",
  },
  registerButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
  footerText: {
    fontSize: 19,
    color: "black",

  },
  loginLink: {
    fontSize: 16,
    color: "white",
    textDecorationLine: "underline",
  },
  passwordContainer: {
    width: "85%",
    height: 40,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 9,
    marginVertical: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  inputPassword: {
    flex: 1,
    color: "black",
  },
});
