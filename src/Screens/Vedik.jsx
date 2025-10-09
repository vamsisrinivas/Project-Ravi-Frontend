// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   StyleSheet,
//   Alert,
//   KeyboardAvoidingView,
//   Platform,
// } from "react-native";
// import Ionicons from "react-native-vector-icons/Ionicons";

// export default function Vedik() {
//   const [form, setForm] = useState({
//     name: "",
//     phone: "",
//     village: "",
//     district: "",
//     variety: "",
//     quantity: "",
//   });

//   const handleChange = (key, value) => {
//     setForm((prev) => ({ ...prev, [key]: value }));
//   };

//   const handleSubmit = () => {
//     if (
//       !form.name ||
//       !form.phone ||
//       !form.village ||
//       !form.district ||
//       !form.variety ||
//       !form.quantity
//     ) {
//       Alert.alert("Please fill in all fields!");
//       return;
//     }

//     Alert.alert("✅ Success", "Form submitted successfully!");
//     console.log("Form Data:", form);

//     // You can post to backend like this:
//     // axios.post("http://192.168.0.6:3000/api/vedik", form)
//   };

//   return (
//     <KeyboardAvoidingView
//       style={{ flex: 1, backgroundColor: "#f3f8f4" }}
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//     >
//       <ScrollView contentContainerStyle={styles.container}>
//         <Text style={styles.title}>🌿 Vedik Farmer Form</Text>

//         {/* Name */}
//         <View style={styles.inputContainer}>
//           <Ionicons name="person-outline" size={22} color="#548c5c" />
//           <TextInput
//             style={styles.input}
//             placeholder="Full Name"
//             placeholderTextColor="#888"
//             value={form.name}
//             onChangeText={(text) => handleChange("name", text)}
//           />
//         </View>

//         {/* Phone Number */}
//         <View style={styles.inputContainer}>
//           <Ionicons name="call-outline" size={22} color="#548c5c" />
//           <TextInput
//             style={styles.input}
//             placeholder="Phone Number"
//             placeholderTextColor="#888"
//             keyboardType="phone-pad"
//             value={form.phone}
//             onChangeText={(text) => handleChange("phone", text)}
//             maxLength={10}
//           />
//         </View>

//         {/* Village */}
//         <View style={styles.inputContainer}>
//           <Ionicons name="home-outline" size={22} color="#548c5c" />
//           <TextInput
//             style={styles.input}
//             placeholder="Village"
//             placeholderTextColor="#888"
//             value={form.village}
//             onChangeText={(text) => handleChange("village", text)}
//           />
//         </View>

//         {/* District */}
//         <View style={styles.inputContainer}>
//           <Ionicons name="map-outline" size={22} color="#548c5c" />
//           <TextInput
//             style={styles.input}
//             placeholder="District"
//             placeholderTextColor="#888"
//             value={form.district}
//             onChangeText={(text) => handleChange("district", text)}
//           />
//         </View>

//         {/* Variety */}
//         <View style={styles.inputContainer}>
//           <Ionicons name="leaf-outline" size={22} color="#548c5c" />
//           <TextInput
//             style={styles.input}
//             placeholder="Crop Variety"
//             placeholderTextColor="#888"
//             value={form.variety}
//             onChangeText={(text) => handleChange("variety", text)}
//           />
//         </View>

//         {/* Quantity */}
//         <View style={styles.inputContainer}>
//           <Ionicons name="cube-outline" size={22} color="#548c5c" />
//           <TextInput
//             style={styles.input}
//             placeholder="Quantity (in Kg or Bags)"
//             placeholderTextColor="#888"
//             keyboardType="numeric"
//             value={form.quantity}
//             onChangeText={(text) => handleChange("quantity", text)}
//           />
//         </View>

//         {/* Submit Button */}
//         <TouchableOpacity style={styles.button} onPress={handleSubmit}>
//           <Ionicons name="send" size={20} color="#fff" />
//           <Text style={styles.buttonText}>Submit</Text>
//         </TouchableOpacity>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 25,
//     paddingBottom: 80,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "700",
//     color: "#2e6930",
//     textAlign: "center",
//     marginBottom: 30,
//   },
//   inputContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#fff",
//     borderRadius: 15,
//     paddingHorizontal: 15,
//     paddingVertical: 10,
//     marginBottom: 18,
//     elevation: 2,
//   },
//   input: {
//     flex: 1,
//     fontSize: 16,
//     color: "#333",
//     marginLeft: 10,
//   },
//   button: {
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#548c5c",
//     paddingVertical: 15,
//     borderRadius: 15,
//     marginTop: 15,
//     elevation: 4,
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "600",
//     marginLeft: 8,
//   },
// });



import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Picker } from "@react-native-picker/picker";
import Toast from "react-native-toast-message";
import axios from "axios";
import BASE_URL from "../Config/api";


export default function Vedik() {
    const [form, setForm] = useState({
        name: "",
        phone: "",
        village: "",
        district: "",
        variety: "",
        quantity: "",
    });

    const [loading, setLoading] = useState(false);
    const handleChange = (key, value) => {
         // Convert the value to integer for quantity
    if (key === "quantity") {
        value = value ? parseInt(value, 10) : ""; // Convert to integer, if value is not empty
    }
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    // const handleSubmit = async () => {
    //     if (
    //         !form.name ||
    //         !form.phone ||
    //         !form.village ||
    //         !form.district ||
    //         !form.variety ||
    //         !form.quantity
    //     ) {
    //         Toast.show({
    //             type: "error",
    //             text1: "Please fill all fields ⚠️",
    //             position: "bottom",
    //             visibilityTime: 3000,
    //             text1Style: { fontSize: 16, fontWeight: "bold" },
    //         });
    //         return;
    //     }
    //     setLoading(true);
    //          console.log(form)
    //     try {
    //         const res = await axios.post(`${BASE_URL}/api/vedik/addVedik`, form);
    //         console.log("✅ API Response:", res.data);
       

    //         if (res.data.success === 1) {
    //             Toast.show({
    //                 type: "success",
    //                 text1: "Form Submitted Successfully 🎉",
    //                 position: "bottom",
    //                 visibilityTime: 3500,
    //                 text1Style: { fontSize: 17, fontWeight: "bold" },
    //             });

    //             // Reset form
    //             setForm({
    //                 name: "",
    //                 phone: "",
    //                 village: "",
    //                 district: "",
    //                 variety: "",
    //                 quantity: "",
    //             });
    //         } else {
    //             Toast.show({
    //                 type: "error",
    //                 text1: res.data.message || "Something went wrong",
    //                 position: "bottom",
    //                 visibilityTime: 3000,
    //                 text1Style: { fontSize: 16, fontWeight: "bold" },
    //             });
    //         }
    //     } catch (err) {
    //         console.error("❌ Vedik submit error:", err);
    //         Toast.show({
    //             type: "error",
    //             text1: "Failed to submit. Please try again later.",
    //             position: "bottom",
    //             visibilityTime: 3500,
    //             text1Style: { fontSize: 16, fontWeight: "bold" },
    //         });
    //     } finally {
    //         setLoading(false);
    //     }
    // };
    
    
    const handleSubmit = async () => {
    if (
        !form.name ||
        !form.phone ||
        !form.village ||
        !form.district ||
        !form.variety ||
        !form.quantity
    ) {
        Toast.show({
            type: "error",
            text1: "Please fill all fields ⚠️",
            position: "bottom",
            visibilityTime: 3000,
            text1Style: { fontSize: 16, fontWeight: "bold" },
        });
        return;
    }
    setLoading(true);
    console.log("Form Data Submitted:", form); // Log the form data

    try {
        const res = await axios.post(`${BASE_URL}/api/vedik/addVedik`, form);
        
        console.log("✅ API Response:", res);  // Log the full response for debugging

        // Check if the response contains the 'success' field inside the 'data' object
        if (res.data && res.data.success === 1) {
            Toast.show({
                type: "success",
                text1: "Form Submitted Successfully 🎉",
                position: "bottom",
                visibilityTime: 3500,
                text1Style: { fontSize: 17, fontWeight: "bold" },
            });

            // Reset form
            setForm({
                name: "",
                phone: "",
                village: "",
                district: "",
                variety: "",
                quantity: "",
            });
        } else {
            // If success flag isn't 1, display an error
            const errorMessage = res.data?.message || "Something went wrong";
            Toast.show({
                type: "error",
                text1: errorMessage,
                position: "bottom",
                visibilityTime: 3000,
                text1Style: { fontSize: 16, fontWeight: "bold" },
            });
        }
    } catch (err) {
        console.error("❌ Vedik submit error:", err);

        // Log full error details
        if (err.response) {
            console.error("Error Response:", err.response);
            console.error("Error Data:", err.response.data);
            console.error("Error Status:", err.response.status);
        }

        Toast.show({
            type: "error",
            text1: "Failed to submit. Please try again later.",
            position: "bottom",
            visibilityTime: 3500,
            text1Style: { fontSize: 16, fontWeight: "bold" },
        });
    } finally {
        setLoading(false);
    }
};



    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: "#f3f8f4" }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.formWrapper}>
                    <Text style={styles.title}>🌾 RV AGRI HUB Vedik</Text>

                    {/* Name */}
                    <View style={styles.inputContainer}>
                        <Ionicons name="person-outline" size={22} color="#548c5c" />
                        <TextInput
                            style={styles.input}
                            placeholder="Full Name"
                            placeholderTextColor="#888"
                            value={form.name}
                            onChangeText={(text) => handleChange("name", text)}
                        />
                    </View>

                    {/* Phone Number */}
                    <View style={styles.inputContainer}>
                        <Ionicons name="call-outline" size={22} color="#548c5c" />
                        <TextInput
                            style={styles.input}
                            placeholder="Phone Number"
                            placeholderTextColor="#888"
                            keyboardType="phone-pad"
                            value={form.phone}
                            onChangeText={(text) => handleChange("phone", text)}
                            maxLength={10}
                        />
                    </View>

                    {/* Village */}
                    <View style={styles.inputContainer}>
                        <Ionicons name="home-outline" size={22} color="#548c5c" />
                        <TextInput
                            style={styles.input}
                            placeholder="Village"
                            placeholderTextColor="#888"
                            value={form.village}
                            onChangeText={(text) => handleChange("village", text)}
                        />
                    </View>

                    {/* District */}
                    <View style={styles.inputContainer}>
                        <Ionicons name="map-outline" size={22} color="#548c5c" />
                        <TextInput
                            style={styles.input}
                            placeholder="District"
                            placeholderTextColor="#888"
                            value={form.district}
                            onChangeText={(text) => handleChange("district", text)}
                        />
                    </View>

                    {/* Variety (Dropdown) */}
                    <View style={styles.inputContainerDropdown}>
                        <Ionicons name="leaf-outline" size={22} color="#548c5c" style={{ marginLeft: 8 }} />
                        <Picker
                            selectedValue={form.variety}
                            style={styles.picker}
                            dropdownIconColor="#548c5c"
                            onValueChange={(value) => handleChange("variety", value)}
                        >
                            <Picker.Item label="Select Variety" value="" />
                            <Picker.Item label="Tomato - NS 502" value="Tomato - NS 502" />
                            <Picker.Item label="Chilli - Teja" value="Chilli - Teja" />
                            <Picker.Item label="Okra - 101" value="Okra - 101" />
                            <Picker.Item label="Brinjal - 2005" value="Brinjal - 2005" />
                            <Picker.Item label="Watermelon - 999" value="Watermelon - 999" />
                        </Picker>
                    </View>

                    {/* Quantity */}
                    <View style={styles.inputContainer}>
                        <Ionicons name="cube-outline" size={22} color="#548c5c" />
                        <TextInput
                            style={styles.input}
                            placeholder="Quantity (in Kg or Bags)"
                            placeholderTextColor="#888"
                            keyboardType="numeric"
                            value={form.quantity}
                            onChangeText={(text) => handleChange("quantity", text)}
                        />
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity
                        style={[styles.button, loading && { opacity: 0.6 }]}
                        onPress={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" size="small" />
                        ) : (
                            <>
                                {/* <Ionicons name="send" size={20} color="#fff" /> */}
                                <Text style={styles.buttonText}>Submit</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <Toast />
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: "center", // Centers form vertically
        paddingHorizontal: 25,
        paddingVertical: 40,
        backgroundColor: "#f3f8f4",
    },
    formWrapper: {
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 25,
        elevation: 4,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: "700",
        color: "#2e6930",
        textAlign: "center",
        marginBottom: 25,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f8f8f8",
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 18,
        borderWidth: 1,
        borderColor: "#e0e0e0",
    },
    inputContainerDropdown: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f8f8f8",
        borderRadius: 12,
        paddingHorizontal: 8,
        marginBottom: 18,
        borderWidth: 1,
        borderColor: "#e0e0e0",
    },
    picker: {
        flex: 1,
        color: "#333",
        marginLeft: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: "#333",
        marginLeft: 10,
    },
    button: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#548c5c",
        paddingVertical: 15,
        borderRadius: 15,
        marginTop: 10,
        elevation: 3,
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
        marginLeft: 8,
    },
});
