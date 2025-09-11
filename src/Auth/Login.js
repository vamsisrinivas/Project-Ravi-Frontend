


// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Image,
//   ImageBackground,
//   ScrollView,
//   Alert,
//   KeyboardAvoidingView,
//   Platform,
//   Keyboard,
//   TouchableWithoutFeedback,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import BASE_URL from '../Config/api';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';



// const Login = ({ navigation }) => {
//   const [phone_no, setPhoneNo] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const handleLogin = async () => {
//     if (loading) return;
//     if (!phone_no || !password) {
//       Alert.alert('Validation Error', 'Please enter both phone number and password');
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await fetch(`${BASE_URL}/api/login`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ phone_no, password }),
//       });

//       const data = await response.json();
//       if (data.success) {
//         await AsyncStorage.setItem('user', JSON.stringify(data.user));
//         navigation.reset({ index: 0, routes: [{ name: 'MainApp' }] });
//       } else {
//         Alert.alert('Login Failed', data.message || 'Invalid credentials');
//       }
//     } catch (error) {
//       Alert.alert('Error', 'Failed to login. Please try again later.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: '#548c5c' }}>
//       <KeyboardAwareScrollView
//         style={{ flex: 1, backgroundColor: 'white' }}
//   contentContainerStyle={{ flexGrow: 1, paddingBottom: 0 }}
//   keyboardShouldPersistTaps="handled"
//   enableOnAndroid={true}
//   extraScrollHeight={20}   // pushes input above keyboard
//       >
//         <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//           <ScrollView
//             style={{ flex: 1 }}
//             // contentContainerStyle={{ flexGrow: 1, paddingBottom: '46%' }}
//             // keyboardShouldPersistTaps="handled"
//           >
//             <View style={{ flexGrow: 1 }}>
//               <View style={styles.curvedHeader}>
//                 <Image source={require('../assets/login_image_png.png')} style={styles.farmerImage} />
//               </View>
//               <View style={{ flexGrow: 1 }}>
//                 <ImageBackground
//                   source={require('../assets/register_image_2.png')}
//                   style={styles.background}
//                   resizeMode="cover"
//                 >
//                   <View style={styles.formContainer}>
//                     <View style={styles.logoCircle}>
//                       <Image source={require('../assets/Logo_type_1.png')} style={styles.logoText} />
//                     </View>

//                     <Text style={styles.title}>LOGIN</Text>
//                     <Text style={styles.subtitle}>Enter your credentials</Text>

//                     <TextInput
//                       placeholder="Phone Number"
//                       placeholderTextColor="black"
//                       value={phone_no}
//                       onChangeText={setPhoneNo}
//                       keyboardType="phone-pad"
//                       style={styles.input}
//                     />

//                     <View style={styles.passwordContainer}>
//                       <TextInput
//                         placeholder="Password"
//                         placeholderTextColor="black"
//                         value={password}
//                         onChangeText={setPassword}
//                         secureTextEntry={!showPassword}
//                         style={styles.inputPassword}
//                       />
//                       <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
//                         <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color="grey" />
//                       </TouchableOpacity>
//                     </View>

//                     <TouchableOpacity
//                       style={[styles.registerButton, loading && { opacity: 0.6 }]}
//                       onPress={handleLogin}
//                       disabled={loading}
//                     >
//                       <Text style={styles.registerButtonText}>
//                         {loading ? 'Logging in...' : 'Login'}
//                       </Text>
//                     </TouchableOpacity>

//                     <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
//                       <Text style={styles.footerText}>Don't have an account? </Text>
//                       <TouchableOpacity onPress={() => navigation.navigate('Register')}>
//                         <Text style={styles.loginLink}>Register</Text>
//                       </TouchableOpacity>
//                     </View>
//                   </View>
//                 </ImageBackground>
//               </View>
//             </View>
//           </ScrollView>
//         </TouchableWithoutFeedback>
//       </KeyboardAwareScrollView>
//     </SafeAreaView>
//   );
// };



// export default Login;

// const styles = StyleSheet.create({
//   background: {
//     flex: 1,
//     width: '100%',
//     minHeight: '100%',
//     // position: 'absolute',
//     // top: 140,
//     flexGrow: 1
//   },
//   curvedHeader: {
//     backgroundColor: '#ffffff',
//     alignItems: 'center',
//     margin: 0,
//     paddingTop: 0,
//   },
//   farmerImage: {
//     width: 300,
//     height: 200,
//     marginTop: 0,
//     top: 20,
//     resizeMode: 'cover',
//     zIndex: 1,
//   },
//   formContainer: {
//     padding: 10,
//     alignItems: 'center',
//     marginTop: 70,
//   },

//   logoCircle: {
//     width: 100,
//     height: 100,
//     borderRadius: 30,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: -40,
//     zIndex: 2,
//   },
//   logoText: {
//     width: 150,
//     height: 150,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#ffffff',
//     top: 20,
//     marginBottom: 5,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#ffffff',
//     marginBottom: 5,
//     marginTop: 10,
//   },
//   input: {
//     width: '85%',
//     height: 40,
//     backgroundColor: '#ffffffff',
//     borderRadius: 8,
//     paddingHorizontal: 9,
//     marginVertical: 4,
//   },
//   dropdown: {
//     width: '85%',
//     height: 40,
//     backgroundColor: '#ffffff',
//     borderRadius: 8,
//     paddingHorizontal: 9,
//     marginVertical: 4,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     justifyContent: 'center',
//   },
//   row: {
//     width: '90%',
//     marginLeft: 18,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     gap: 5,
//   },
//   column: {
//     flex: 2,
//   },
//   registerButton: {
//     backgroundColor: '#009b77',
//     padding: 10,
//     borderRadius: 8,
//     marginTop: 5,
//     width: '80%',
//     alignItems: 'center',
//   },
//   registerButtonText: {
//     color: '#ffffff',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   footerText: {
//     fontSize: 16,
//     color: 'black',
//   },
//   loginLink: {
//     fontSize: 16,
//     color: 'white',
//     textDecorationLine: 'underline',
//   },

//   //passowrd code

//   passwordContainer: {
//     width: '85%',
//     height: 40,
//     backgroundColor: '#ffffffff',
//     borderRadius: 8,
//     paddingHorizontal: 9,
//     marginVertical: 4,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },

//   inputPassword: {
//     flex: 1,
//     color: 'black',
//   },



// });




import React, { useState } from "react";
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

const Login = ({ navigation }) => {
  const [phone_no, setPhoneNo] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (loading) return;
    if (!phone_no || !password) {
      Alert.alert("Validation Error", "Please enter both phone number and password");
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
      if (data.success) {
        await AsyncStorage.setItem("user", JSON.stringify(data.user));
        navigation.reset({ index: 0, routes: [{ name: "MainApp" }] });
      } else {
        Alert.alert("Login Failed", data.message || "Invalid credentials");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to login. Please try again later.");
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
                      source={require("../assets/Logo_type_1.png")}
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
