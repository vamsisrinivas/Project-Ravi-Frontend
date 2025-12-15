
// // src/Screens/ForgotPassword.jsx
// import React, { useEffect, useState, useRef } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Image,
//   ImageBackground,
//   Keyboard,
//   TouchableWithoutFeedback,
//   Platform,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
// import Ionicons from "react-native-vector-icons/Ionicons";
// import BASE_URL from "../Config/api";
// import { showToast } from "../Components/CustomToast";

// export default function ForgotPassword({ navigation }) {
//   const [phone, setPhone] = useState("");
//   const [otp, setOtp] = useState("");
//   const [serverOtp, setServerOtp] = useState(null); // OTP returned by server (if any)
//   const [otpRequested, setOtpRequested] = useState(false);
//   const [otpVerified, setOtpVerified] = useState(false);
//   const [loadingOtp, setLoadingOtp] = useState(false);
//   const [loadingVerify, setLoadingVerify] = useState(false);
//   const [loadingReset, setLoadingReset] = useState(false);

//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);

//   // resend countdown state
//   const [secondsLeft, setSecondsLeft] = useState(0);
//   const timerRef = useRef(null);

//   useEffect(() => {
//     // manage countdown cleanup
//     if (secondsLeft === 0 && timerRef.current) {
//       clearInterval(timerRef.current);
//       timerRef.current = null;
//     }
//     return () => {
//       if (timerRef.current) {
//         clearInterval(timerRef.current);
//         timerRef.current = null;
//       }
//     };
//   }, [secondsLeft]);

//   // start a 60s countdown
//   const startCountdown = (secs = 60) => {
//     setSecondsLeft(secs);
//     if (timerRef.current) clearInterval(timerRef.current);
//     timerRef.current = setInterval(() => {
//       setSecondsLeft((s) => {
//         if (s <= 1) {
//           clearInterval(timerRef.current);
//           timerRef.current = null;
//           return 0;
//         }
//         return s - 1;
//       });
//     }, 1000);
//   };

//   // helper: safe JSON parse
//   const safeParse = (rawText) => {
//     try {
//       return JSON.parse(rawText);
//     } catch (e) {
//       return null;
//     }
//   };

//   // Request OTP from server
//   const requestOtp = async () => {
//     if (!phone) {
//       showToast("error", "Missing Phone", "Please enter phone number");
//       return;
//     }
//     setLoadingOtp(true);
//     try {
//       const res = await fetch(`${BASE_URL}/api/auth/forgot-password`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ phone_no: phone }),
//       });

//       const raw = await res.text();
//       const data = safeParse(raw);

//       if (res.ok && data && data.success) {
//         setOtpRequested(true);
//         startCountdown(60); // start resend cooldown

//         if (data.otp) {
//           // useful for dev/testing
//           setServerOtp(String(data.otp));
//           showToast("success", "OTP Sent", "Use the displayed OTP");
//         } else {
//           setServerOtp(null);
//           showToast("success", "OTP Sent", "Please check your phone for the OTP");
//         }
//       } else {
//         const errMsg = (data && data.message) || `Request failed (${res.status})`;
//         console.log("requestOtp error:", errMsg);
//         showToast("error", "Request Failed", errMsg);
//       }
//     } catch (err) {
//       console.log("requestOtp error:", err);
//       showToast("error", "Network Error", "Server unreachable");
//     } finally {
//       setLoadingOtp(false);
//     }
//   };

//   // Verify OTP (either client-side if server returned it, or via server verify endpoint)
//   const verifyOtp = async () => {
//     if (!otp) {
//       showToast("error", "Missing OTP", "Please enter OTP");
//       return;
//     }

//     // If server gave us the OTP in previous response, validate locally
//     if (serverOtp) {
//       if (String(otp).trim() === String(serverOtp).trim()) {
//         setOtpVerified(true);
//         showToast("success", "Verified", "OTP verified successfully");
//         return;
//       } else {
//         showToast("error", "Invalid OTP", "The OTP you entered is incorrect");
//         return;
//       }
//     }

//     // Otherwise ask server to verify the OTP
//     setLoadingVerify(true);
//     try {
//       const res = await fetch(`${BASE_URL}/api/auth/verify-otp`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ phone_no: phone, otp }),
//       });

//       const raw = await res.text();
//       const data = safeParse(raw);

//       if (res.ok && data && data.success) {
//         setOtpVerified(true);
//         showToast("success", "Verified", "OTP verified successfully");
//       } else {
//         const errMsg = (data && data.message) || "Invalid OTP";
//         console.log("verifyOtp error:", errMsg);
//         showToast("error", "Verification Failed", errMsg);
//       }
//     } catch (err) {
//       console.log("verifyOtp error:", err);
//       showToast("error", "Server Error", "Unable to verify OTP");
//     } finally {
//       setLoadingVerify(false);
//     }
//   };

//   // Reset password
//   const resetPassword = async () => {
//     if (!newPassword || !confirmPassword) {
//       showToast("error", "Missing Details", "Please fill all password fields");
//       return;
//     }
//     if (newPassword !== confirmPassword) {
//       showToast("error", "Mismatch", "Passwords do not match");
//       return;
//     }
//     if (!otp) {
//       showToast("error", "Missing OTP", "OTP is required");
//       return;
//     }

//     setLoadingReset(true);
//     try {
//       const res = await fetch(`${BASE_URL}/api/auth/reset-password`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           phone_no: phone,
//           otp,
//           new_password: newPassword,
//         }),
//       });

//       const raw = await res.text();
//       const data = safeParse(raw);

//       if (res.ok && data && data.success) {
//         showToast("success", "Success!", "Password reset successful");
//         navigation.navigate("Login");
//       } else {
//         const errMsg = (data && data.message) || "Reset failed";
//         console.log("resetPassword error:", errMsg);
//         showToast("error", "Reset Failed", errMsg);
//       }
//     } catch (err) {
//       console.log("resetPassword error:", err);
//       showToast("error", "Server Error", "Unable to reset password");
//     } finally {
//       setLoadingReset(false);
//     }
//   };

//   // render OTP boxes when serverOtp is present
//   const OtpPreview = ({ value }) => {
//     const digits = (value || "").split("");
//     const maxBoxes = Math.max(4, digits.length); // show at least 4 boxes
//     const boxes = Array.from({ length: maxBoxes }).map((_, i) => digits[i] || "");
//     return (
//       <View style={styles.otpPreviewWrap}>
//         <Text style={styles.otpLabel}>Received OTP</Text>
//         <View style={styles.otpBoxes}>
//           {boxes.map((d, idx) => (
//             <View key={idx} style={styles.otpBox}>
//               <Text style={styles.otpDigit}>{d}</Text>
//             </View>
//           ))}
//         </View>
//         <Text style={styles.otpHint}>Please Enter.</Text>
//       </View>
//     );
//   };

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: "#548c5c" }}>
//       <KeyboardAwareScrollView
//         style={{ flex: 1, backgroundColor: "white" }}
//         contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
//         keyboardShouldPersistTaps="handled"
//         enableOnAndroid={true}
//         extraScrollHeight={20}
//         keyboardOpeningTime={0}
//       >
//         <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//           <View style={{ flex: 1 }}>
//             {/* Top Image */}
//             <View style={styles.curvedHeader}>
//               <Image source={require("../assets/login_image_png.png")} style={styles.farmerImage} />
//             </View>

//             {/* Background + Form */}
//             <View style={{ flex: 1 }}>
//               <ImageBackground
//                 source={require("../assets/register_image_2.png")}
//                 style={styles.background}
//                 resizeMode="cover"
//               >
//                 <View style={styles.formContainer}>
//                   <View style={styles.logoCircle}>
//                     <Image source={require("../assets/Logo_type_2.png")} style={styles.logoText} />
//                   </View>

//                   <Text style={styles.title}>FORGOT PASSWORD</Text>
//                   <Text style={styles.subtitle}>Enter phone & verify OTP</Text>

//                   {/* Phone */}
//                   <TextInput
//                     placeholder="Phone Number"
//                     placeholderTextColor="black"
//                     value={phone}
//                     onChangeText={(t) => {
//                       setPhone(t);
//                       // reset states when phone changes
//                       setOtp("");
//                       setServerOtp(null);
//                       setOtpRequested(false);
//                       setOtpVerified(false);
//                       setSecondsLeft(0);
//                     }}
//                     keyboardType="phone-pad"
//                     style={styles.input}
//                   />

//                   {/* Get OTP & resend timer */}
//                   <View style={{ width: "85%", alignItems: "center" }}>
//                     <TouchableOpacity
//                       style={[styles.registerButton, loadingOtp && { opacity: 0.6 }]}
//                       onPress={requestOtp}
//                       disabled={loadingOtp || secondsLeft > 0}
//                     >
//                       <Text style={styles.registerButtonText}>
//                         {loadingOtp
//                           ? "Requesting..."
//                           : secondsLeft > 0
//                           ? `Resend OTP (${secondsLeft}s)`
//                           : otpRequested
//                           ? "Resend OTP"
//                           : "Get OTP"}
//                       </Text>
//                     </TouchableOpacity>
//                   </View>
//                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
//                                     <Text style={styles.footerText}>Do you Remember Password? </Text>
//                                     <TouchableOpacity onPress={() => navigation.navigate('Login')}>
//                                       <Text style={styles.loginLink}>Log In</Text>
//                                     </TouchableOpacity>
//                                   </View>

//                   {/* Show on-screen OTP preview if server returned one */}
//                   {serverOtp ? <OtpPreview value={serverOtp} /> : null}

//                   {/* OTP input */}
//                   {otpRequested && !otpVerified && (
//                     <>
//                       <TextInput
//                         placeholder="Enter OTP"
//                         placeholderTextColor="black"
//                         value={otp}
//                         onChangeText={setOtp}
//                         keyboardType="numeric"
//                         style={styles.input}
//                       />

//                       <TouchableOpacity
//                         style={[styles.registerButton, loadingVerify && { opacity: 0.6 }]}
//                         onPress={verifyOtp}
//                         disabled={loadingVerify}
//                       >
//                         <Text style={styles.registerButtonText}>
//                           {loadingVerify ? "Verifying..." : "Verify OTP"}
//                         </Text>
//                       </TouchableOpacity>
//                     </>
//                   )}

//                   {/* Password change fields (only after OTP verified) */}
//                   {otpVerified && (
//                     <>
//                       <View style={styles.passwordContainer}>
//                         <TextInput
//                           placeholder="New password"
//                           placeholderTextColor="black"
//                           value={newPassword}
//                           onChangeText={setNewPassword}
//                           secureTextEntry={!showPassword}
//                           style={styles.inputPassword}
//                         />
//                         <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
//                           <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color="grey" />
//                         </TouchableOpacity>
//                       </View>

//                       <TextInput
//                         placeholder="Confirm password"
//                         placeholderTextColor="black"
//                         value={confirmPassword}
//                         onChangeText={setConfirmPassword}
//                         secureTextEntry={!showPassword}
//                         style={styles.input}
//                       />

//                       <TouchableOpacity
//                         style={[styles.registerButton, loadingReset && { opacity: 0.6 }]}
//                         onPress={resetPassword}
//                         disabled={loadingReset}
//                       >
//                         <Text style={styles.registerButtonText}>
//                           {loadingReset ? "Resetting..." : "Reset Password"}
//                         </Text>
//                       </TouchableOpacity>
//                     </>
//                   )}
//                 </View>
//               </ImageBackground>
//             </View>
//           </View>
//         </TouchableWithoutFeedback>
//       </KeyboardAwareScrollView>
//     </SafeAreaView>
//   );
// }

// // styles (keeps look consistent with your app)
// const styles = StyleSheet.create({
//   background: {
//     flex: 1,
//     width: "100%",
//     minHeight: "100%",
//   },
//   curvedHeader: {
//     backgroundColor: "#ffffff",
//     alignItems: "center",
//     paddingTop: 0,
//   },
//   farmerImage: {
//     width: 300,
//     height: 200,
//     top: 20,
//     resizeMode: "cover",
//   },
//   formContainer: {
//     padding: 10,
//     alignItems: "center",
//     marginTop: 40,
//   },
//   logoCircle: {
//     width: 100,
//     height: 100,
//     borderRadius: 30,
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: -40,
//   },
//   logoText: {
//     width: 150,
//     height: 150,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#ffffff",
//     marginTop: 25,
//     marginBottom: 4,
//   },
//   subtitle: {
//     fontSize: 14,
//     color: "#ffffff",
//     marginBottom: 10,
//   },
//   input: {
//     width: "85%",
//     height: 44,
//     backgroundColor: "#fff",
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     marginVertical: 6,
//     color: "black",
//     borderWidth: 1,
//     borderColor: "#e0e0e0",
//   },
//   registerButton: {
//     backgroundColor: "#009b77",
//     padding: 12,
//     borderRadius: 8,
//     marginTop: 10,
//     width: "100%",
//     alignItems: "center",
//   },
//   registerButtonText: {
//     color: "#ffffff",
//     fontWeight: "bold",
//     fontSize: 16,
//   },
//   passwordContainer: {
//     width: "85%",
//     height: 44,
//     backgroundColor: "#fff",
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     marginVertical: 6,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     borderWidth: 1,
//     borderColor: "#e0e0e0",
//   },
//   inputPassword: {
//     flex: 1,
//     color: "black",
//   },

//   /* OTP preview styles */
//   otpPreviewWrap: {
//     marginTop: 12,
//     width: "78%",
//     alignItems: "center",
//     backgroundColor: "rgba(255,255,255,0.95)",
//     paddingVertical: 8,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#e6e6e6",
//   },
//   otpLabel: {
//     fontSize: 12,
//     color: "#333",
//     marginBottom: 8,
//   },
//   otpBoxes: {
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   otpBox: {
//     width: 30,
//     height: 30,
//     borderRadius: 8,
//     backgroundColor: "#fff",
//     borderWidth: 1,
//     borderColor: "#ddd",
//     justifyContent: "center",
//     alignItems: "center",
//     marginHorizontal: 4,
//     shadowColor: Platform.OS === "android" ? "#000" : undefined,
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.06,
//     shadowRadius: 2,
//   },
//   otpDigit: {
//     fontSize: 18,
//     fontWeight: "700",
//     color: "#111",
//   },
//   otpHint: {
//     marginTop: 8,
//     fontSize: 11,
//     color: "#666",
//     paddingHorizontal: 10,
//     textAlign: "center",
//   },
  
//   footerText: {
//     fontSize: 16,
//     color: 'black',
//   },
//   loginLink: {
//     fontSize: 18,
//     color: 'white',
//     textDecorationLine: 'underline',
//   },

// });


// src/Screens/ForgotPassword.jsx
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Ionicons from "react-native-vector-icons/Ionicons";
import BASE_URL from "../Config/api";
import { showToast } from "../Components/CustomToast";

// Reusable OTP input component (renders individual boxes as TextInputs)
const OtpInput = ({ length = 4, value = "", onChange }) => {
  const refs = useRef([]);
  const digits = Array.from({ length }).map((_, i) => (value[i] ? value[i] : ""));

  useEffect(() => {
    // ensure refs array length
    refs.current = refs.current.slice(0, length);
  }, [length]);

  const focusNext = (i) => {
    if (i < length - 1 && refs.current[i + 1]) refs.current[i + 1].focus();
  };
  const focusPrev = (i) => {
    if (i > 0 && refs.current[i - 1]) refs.current[i - 1].focus();
  };

  const handleChange = (text, i) => {
    // if user pasted entire OTP (text length > 1), spread it
    if (!text) {
      const newVal = value.split("").map((c, idx) => (idx === i ? "" : c)).join("");
      onChange(newVal);
      return;
    }

    if (text.length > 1) {
      // paste handling: fill from this position
      const paste = text.slice(0, length - i).split("");
      const curr = value.split("");
      for (let k = 0; k < paste.length; k++) curr[i + k] = paste[k];
      const newVal = curr.join("").slice(0, length);
      onChange(newVal);
      // focus after the last pasted char
      const nextIndex = Math.min(i + paste.length, length - 1);
      setTimeout(() => refs.current[nextIndex]?.focus?.(), 50);
      return;
    }

    // single character typed
    const ch = text[0];
    const curr = value.split("");
    curr[i] = ch;
    const newVal = curr.join("").slice(0, length);
    onChange(newVal);
    // move focus
    if (ch) setTimeout(() => focusNext(i), 50);
  };

  const handleKeyPress = ({ nativeEvent }, i) => {
    if (nativeEvent.key === "Backspace") {
      if (!digits[i]) {
        // current is empty -> move back and clear previous
        focusPrev(i);
        const curr = value.split("");
        if (i > 0) {
          curr[i - 1] = "";
          onChange(curr.join(""));
        }
      } else {
        // clear current digit
        const curr = value.split("");
        curr[i] = "";
        onChange(curr.join(""));
      }
    }
  };

  return (
    <View style={styles.otpBoxes}>
      {Array.from({ length }).map((_, i) => (
        <TextInput
          key={i}
          ref={(el) => (refs.current[i] = el)}
          value={digits[i]}
          onChangeText={(t) => handleChange(t, i)}
          onKeyPress={(e) => handleKeyPress(e, i)}
          keyboardType="numeric"
          returnKeyType="done"
          maxLength={length > 1 ? 1 : 1}
          style={styles.otpBox}
          placeholder=""
          placeholderTextColor="#999"
          textContentType="oneTimeCode"
        />
      ))}
    </View>
  );
};

export default function ForgotPassword({ navigation }) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [serverOtp, setServerOtp] = useState(null); // OTP returned by server (if any)
  const [otpRequested, setOtpRequested] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loadingOtp, setLoadingOtp] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [loadingReset, setLoadingReset] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // resend countdown state
  const [secondsLeft, setSecondsLeft] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    // manage countdown cleanup
    if (secondsLeft === 0 && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [secondsLeft]);

  // start a 60s countdown
  const startCountdown = (secs = 60) => {
    setSecondsLeft(secs);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  // helper: safe JSON parse
  const safeParse = (rawText) => {
    try {
      return JSON.parse(rawText);
    } catch (e) {
      return null;
    }
  };

  // Request OTP from server
  const requestOtp = async () => {
    if (!phone) {
      showToast("error", "Missing Phone", "Please enter phone number");
      return;
    }
    setLoadingOtp(true);
    try {
      const res = await fetch(`${BASE_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone_no: phone }),
      });

      const raw = await res.text();
      const data = safeParse(raw);

      if (res.ok && data && data.success) {
        setOtpRequested(true);
        startCountdown(60); // start resend cooldown

        if (data.otp) {
          // useful for dev/testing
          setServerOtp(String(data.otp));
          showToast("success", "OTP Sent", "Use the displayed OTP");
        } else {
          setServerOtp(null);
          showToast("success", "OTP Sent", "Please check your phone for the OTP");
        }
      } else {
        const errMsg = (data && data.message) || `Request failed (${res.status})`;
        console.log("requestOtp error:", errMsg);
        showToast("error", "Request Failed", errMsg);
      }
    } catch (err) {
      console.log("requestOtp error:", err);
      showToast("error", "Network Error", "Server unreachable");
    } finally {
      setLoadingOtp(false);
    }
  };

  // Verify OTP (either client-side if server returned it, or via server verify endpoint)
  const verifyOtp = async () => {
    if (!otp) {
      showToast("error", "Missing OTP", "Please enter OTP");
      return;
    }

    // If server gave us the OTP in previous response, validate locally
    if (serverOtp) {
      if (String(otp).trim() === String(serverOtp).trim()) {
        setOtpVerified(true);
        showToast("success", "Verified", "OTP verified successfully");
        return;
      } else {
        showToast("error", "Invalid OTP", "The OTP you entered is incorrect");
        return;
      }
    }

    // Otherwise ask server to verify the OTP
    setLoadingVerify(true);
    try {
      const res = await fetch(`${BASE_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone_no: phone, otp }),
      });

      const raw = await res.text();
      const data = safeParse(raw);

      if (res.ok && data && data.success) {
        setOtpVerified(true);
        showToast("success", "Verified", "OTP verified successfully");
      } else {
        const errMsg = (data && data.message) || "Invalid OTP";
        console.log("verifyOtp error:", errMsg);
        showToast("error", "Verification Failed", errMsg);
      }
    } catch (err) {
      console.log("verifyOtp error:", err);
      showToast("error", "Server Error", "Unable to verify OTP");
    } finally {
      setLoadingVerify(false);
    }
  };

  // Reset password
  const resetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      showToast("error", "Missing Details", "Please fill all password fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("error", "Mismatch", "Passwords do not match");
      return;
    }
    if (!otp) {
      showToast("error", "Missing OTP", "OTP is required");
      return;
    }

    setLoadingReset(true);
    try {
      const res = await fetch(`${BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone_no: phone,
          otp,
          new_password: newPassword,
        }),
      });

      const raw = await res.text();
      const data = safeParse(raw);

      if (res.ok && data && data.success) {
        showToast("success", "Success!", "Password reset successful");
        navigation.navigate("Login");
      } else {
        const errMsg = (data && data.message) || "Reset failed";
        console.log("resetPassword error:", errMsg);
        showToast("error", "Reset Failed", errMsg);
      }
    } catch (err) {
      console.log("resetPassword error:", err);
      showToast("error", "Server Error", "Unable to reset password");
    } finally {
      setLoadingReset(false);
    }
  };

  // render OTP boxes when serverOtp is present (read-only preview)
  const OtpPreview = ({ value }) => {
    const digits = (value || "").split("");
    const maxBoxes = Math.max(4, digits.length); // show at least 4 boxes
    const boxes = Array.from({ length: maxBoxes }).map((_, i) => digits[i] || "");
    return (
      <View style={styles.otpPreviewWrap}>
        <Text style={styles.otpLabel}>Received OTP</Text>
        <View style={styles.otpBoxes}>
          {boxes.map((d, idx) => (
            <View key={idx} style={styles.otpBoxReadonly}>
              <Text style={styles.otpDigit}>{d}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.otpHint}>Please enter the OTP into the boxes below.</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#548c5c" }}>
      <KeyboardAwareScrollView
        style={{ flex: 1, backgroundColor: "white" }}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        extraScrollHeight={20}
        keyboardOpeningTime={0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            {/* Top Image */}
            <View style={styles.curvedHeader}>
              <Image source={require("../assets/login_image_png.png")} style={styles.farmerImage} />
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
                    <Image source={require("../assets/Logo_type_2.png")} style={styles.logoText} />
                  </View>

                  <Text style={styles.title}>FORGOT PASSWORD</Text>
                  <Text style={styles.subtitle}>Enter phone & verify OTP</Text>

                  {/* Phone */}
                  <TextInput
                    placeholder="Phone Number"
                    placeholderTextColor="black"
                    value={phone}
                    onChangeText={(t) => {
                      setPhone(t);
                      // reset states when phone changes
                      setOtp("");
                      setServerOtp(null);
                      setOtpRequested(false);
                      setOtpVerified(false);
                      setSecondsLeft(0);
                    }}
                    keyboardType="phone-pad"
                    style={styles.input}
                  />

                  {/* Get OTP & resend timer */}
                  <View style={{ width: "85%", alignItems: "center" }}>
                    <TouchableOpacity
                      style={[styles.registerButton, loadingOtp && { opacity: 0.6 }]}
                      onPress={requestOtp}
                      disabled={loadingOtp || secondsLeft > 0}
                    >
                      <Text style={styles.registerButtonText}>
                        {loadingOtp
                          ? "Requesting..."
                          : secondsLeft > 0
                          ? `Resend OTP (${secondsLeft}s)`
                          : otpRequested
                          ? "Resend OTP"
                          : "Get OTP"}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                    <Text style={styles.footerText}>Do you Remember Password? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                      <Text style={styles.loginLink}>Log In</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Show on-screen OTP preview if server returned one */}
                  {serverOtp ? <OtpPreview value={serverOtp} /> : null}

                  {/* OTP input boxes (shown when OTP requested and not verified) */}
                  {otpRequested && !otpVerified && (
                    <>
                      <OtpInput length={Math.max(4, serverOtp ? String(serverOtp).length : 4)} value={otp} onChange={setOtp} />

                      <TouchableOpacity
                        style={[styles.registerButton, loadingVerify && { opacity: 0.6 }]}
                        onPress={verifyOtp}
                        disabled={loadingVerify}
                      >
                        <Text style={styles.registerButtonText}>
                          {loadingVerify ? "Verifying..." : "Verify OTP"}
                        </Text>
                      </TouchableOpacity>
                    </>
                  )}

                  {/* Password change fields (only after OTP verified) */}
                  {otpVerified && (
                    <>
                      <View style={styles.passwordContainer}>
                        <TextInput
                          placeholder="New password"
                          placeholderTextColor="black"
                          value={newPassword}
                          onChangeText={setNewPassword}
                          secureTextEntry={!showPassword}
                          style={styles.inputPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                          <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color="grey" />
                        </TouchableOpacity>
                      </View>

                      <TextInput
                        placeholder="Confirm password"
                        placeholderTextColor="black"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={!showPassword}
                        style={styles.input}
                      />

                      <TouchableOpacity
                        style={[styles.registerButton, loadingReset && { opacity: 0.6 }]}
                        onPress={resetPassword}
                        disabled={loadingReset}
                      >
                        <Text style={styles.registerButtonText}>
                          {loadingReset ? "Resetting..." : "Reset Password"}
                        </Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </ImageBackground>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

// styles (keeps look consistent with your app)
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
    marginTop: 40,
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
    marginTop: 25,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#ffffff",
    marginBottom: 10,
  },
  input: {
    width: "85%",
    height: 44,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginVertical: 6,
    color: "black",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  registerButton: {
    backgroundColor: "#009b77",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  registerButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
  passwordContainer: {
    width: "85%",
    height: 44,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  inputPassword: {
    flex: 1,
    color: "black",
  },

  /* OTP preview styles */
  otpPreviewWrap: {
    marginTop: 12,
    width: "78%",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.95)",
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e6e6e6",
        marginBottom:10

  },
  otpLabel: {
    fontSize: 12,
    color: "#333",
    marginBottom: 8,
  },
  otpBoxes: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  otpBox: {
    width: 44,
    height: 52,
    borderRadius: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 6,
    shadowColor: Platform.OS === "android" ? "#000" : undefined,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
  },
  otpBoxReadonly: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
  },
  otpDigit: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },
  otpHint: {
    marginTop: 8,
    fontSize: 11,
    color: "#666",
    paddingHorizontal: 10,
    textAlign: "center",
  },

  footerText: {
    fontSize: 16,
    color: "black",
  },
  loginLink: {
    fontSize: 18,
    color: "white",
    textDecorationLine: "underline",
  },
});



