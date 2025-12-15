// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   ScrollView,
//   StyleSheet,
//   TouchableOpacity,
//   Alert,
// } from "react-native";
// import axios from "axios";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import BASE_URL from "../Config/api";
// import { Picker } from "@react-native-picker/picker";
// import Ionicons from "react-native-vector-icons/Ionicons";
// import { useNavigation } from "@react-navigation/native";
// import { showToast } from "../Components/CustomToast";

// export default function AddressScreen() {
//   const navigation = useNavigation();
//   const [addresses, setAddresses] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [sameAsOther, setSameAsOther] = useState(false);

//   const [form, setForm] = useState({
//     id: null,
//     full_name: "",
//     phone: "",
//     address_line1: "",
//     address_line2: "",
//     village: "",
//     district: "",
//     state: "",
//     pincode: "",
//     landmark: "",
//     address_type: "shipping",
//     is_default: false,
//   });
//   const [customerId, setCustomerId] = useState(null);

//   const getCustomerId = async () => {
//     try {
//       const userString = await AsyncStorage.getItem("user");
//       if (userString) {
//         const user = JSON.parse(userString);
//         if (user.customer_id) setCustomerId(user.customer_id);
//       }
//     } catch (err) {
//       console.log("Error getting user object:", err.message);
//     }
//   };

//   useEffect(() => {
//     getCustomerId();
//   }, []);

//   useEffect(() => {
//     if (customerId) fetchAddresses();
//   }, [customerId]);

//   const fetchAddresses = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(
//         `${BASE_URL}/api/addresses/getByCustomer/${customerId}`
//       );
//       const addressesData = res.data.data || [];

//       const hasDefault = addressesData.some((addr) => addr.is_default === 1);
//       if (!hasDefault && addressesData.length > 0) {
//         addressesData[0].is_default = 1;
//       }

//       setAddresses(addressesData);
//     } catch (err) {
//       console.log("Fetch error:", err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Add or Update address
//   const handleSubmit = async () => {
//     if (!form.full_name || !form.phone || !form.address_line1) {
//       Alert.alert("Validation", "Please fill all required fields.");
//       showToast("warning", "Warmomg!", "Please fill all required fields!");
//       return;
//     }

//     try {
//       if (form.id) {
//         await axios.put(`${BASE_URL}/api/addresses/updateAddress/${form.id}`, form);
//         // Alert.alert("Success", "Address updated successfully!");

//               showToast("success", "success!", "Address updated successfully!");

//       } else {
//         await axios.post(`${BASE_URL}/api/addresses/addAddress`, {
//           ...form,
//           customer_id: customerId,
//         });

//         // ✅ If checkbox is checked, automatically add the other address type
//         if (sameAsOther) {
//           const otherType =
//             form.address_type === "shipping" ? "billing" : "shipping";

//           await axios.post(`${BASE_URL}/api/addresses/addAddress`, {
//             ...form,
//             customer_id: customerId,
//             address_type: otherType,
//           });
//         }

//         // Alert.alert("Success", "Address added successfully!");
//         showToast("success", "Success", "Address added successfully!!");
//       }

//       setForm({
//         id: null,
//         full_name: "",
//         phone: "",
//         address_line1: "",
//         address_line2: "",
//         village: "",
//         district: "",
//         state: "",
//         pincode: "",
//         landmark: "",
//         address_type: "shipping",
//         is_default: false,
//       });
//       setSameAsOther(false);
//       fetchAddresses();
//     } catch (err) {
//       console.log("Submit error:", err.response?.data || err.message);
//       Alert.alert(
//         "Error",
//         err.response?.data?.message || "Failed to submit address"
//       );
//       showToast("error", "Error", "Failed to submit address!");
//     }
//   };

//   // const handleDelete = async (id) => {
//   //   Alert.alert("Delete Address", "Are you sure?", [
//   //     { text: "Cancel" },
//   //     {
//   //       text: "Yes",
//   //       onPress: async () => {
//   //         try {
//   //           await axios.delete(`${BASE_URL}/api/addresses/deleteAddress/${id}`);
//   //           fetchAddresses();
//   //         } catch (err) {
//   //           console.log(err.message);
//   //         }
//   //       },
//   //     },
//   //   ]);
//   // };

//   const handleDelete = async (id) => {
//     Alert.alert("Delete Address", "Are you sure?", [
//       { text: "Cancel" },
//       {
//         text: "Yes",
//         onPress: async () => {
//           try {
//             await axios.delete(`${BASE_URL}/api/addresses/deleteAddress/${id}`);

//             // ✅ Instantly update local state
//             setAddresses((prev) => {
//               const updated = prev.filter((item) => item.id !== id);
//               return updated;
//             });
//             // showToast("warning", "Delete", "Deleted Your Address!");
//             // ✅ Optional: if backend changes need confirmation, re-fetch
//             // await fetchAddresses();
//             showToast("warning", "Deleted", "Address Deleted!");

//           } catch (err) {
//             console.log(err.message);
//             showToast("error", "Error", "Check it Once!");
//           }
//         },
//       },
//     ]);
//   };


//   const setDefaultAddress = async (addressId) => {
//     const target = addresses.find((a) => a.id === addressId);
//     if (!target) return;

//     const updatedAddresses = addresses.map((addr) => ({
//       ...addr,
//       is_default:
//         addr.address_type === target.address_type
//           ? addr.id === addressId
//             ? 1
//             : 0
//           : addr.is_default,
//     }));

//     setAddresses(updatedAddresses);

//     try {
//       await axios.patch(`${BASE_URL}/api/addresses/setDefault/${addressId}`);
//       fetchAddresses();
//       showToast("success", "Success ✅", "Your Selected one is Default!");
//     } catch (err) {
//       console.log("Set default error:", err.response?.data || err.message);
//       showToast("error", "Error", "Selected one is Not Default!");
//       fetchAddresses();
//     }
//   };

//   const handleEdit = (addr) => {
//     setForm({
//       ...addr,
//       is_default: addr.is_default === 1,
//     });
//   };

//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.headerRow}>
//         <TouchableOpacity
//           onPress={() => navigation.goBack()}
//           style={styles.backBtn}
//         >
//           <Ionicons name="arrow-back" size={24} color="#333" />
//         </TouchableOpacity>
//         <Text style={styles.header}>Manage Addresses</Text>
//         <View style={{ width: 45 }} />
//       </View>

//       {/* Address Form */}
//       <View style={styles.form}>
//         <Text style={styles.sectionTitle}>
//           {form.id ? "Edit Address" : "Add New Address"}
//         </Text>

//         {/* Two-column fields */}
//         <View style={styles.rowWrap}>
//           <TextInput
//             placeholder="FULL NAME"
//             placeholderTextColor="#000" // ✅ Black placeholder
//             style={[styles.input, styles.halfInput]}
//             value={form.full_name}
//             onChangeText={(v) => setForm({ ...form, full_name: v })}
//           />
//           <TextInput
//             placeholder="PHONE"
//             placeholderTextColor="#000" // ✅ Black placeholder
//             keyboardType="number-pad"
//             style={[styles.input, styles.halfInput]}
//             value={form.phone}
//             onChangeText={(v) => setForm({ ...form, phone: v })}
//           />
//         </View>

//         <TextInput
//           placeholder="ADDRESS LINE 1"
//           placeholderTextColor="#000" // ✅ Black placeholder
//           style={styles.input}
//           value={form.address_line1}
//           onChangeText={(v) => setForm({ ...form, address_line1: v })}
//         />
//         <TextInput
//           placeholder="ADDRESS LINE 2"
//           placeholderTextColor="#000" // ✅ Black placeholder
//           style={styles.input}
//           value={form.address_line2}
//           onChangeText={(v) => setForm({ ...form, address_line2: v })}
//         />

//         <View style={styles.rowWrap}>
//           <TextInput
//             placeholder="VILLAGE"
//             placeholderTextColor="#000" // ✅ Black placeholder
//             style={[styles.input, styles.halfInput]}
//             value={form.village}
//             onChangeText={(v) => setForm({ ...form, village: v })}
//           />
//           <TextInput
//             placeholder="DISTRICT"
//             placeholderTextColor="#000" // ✅ Black placeholder
//             style={[styles.input, styles.halfInput]}
//             value={form.district}
//             onChangeText={(v) => setForm({ ...form, district: v })}
//           />
//         </View>

//         <View style={styles.rowWrap}>
//           <TextInput
//             placeholder="STATE"
//             placeholderTextColor="#000" // ✅ Black placeholder
//             style={[styles.input, styles.halfInput]}
//             value={form.state}
//             onChangeText={(v) => setForm({ ...form, state: v })}
//           />
//           <TextInput
//             placeholder="PINCODE"
//             placeholderTextColor="#000" // ✅ Black placeholder
//             keyboardType="number-pad"
//             style={[styles.input, styles.halfInput]}
//             value={form.pincode}
//             onChangeText={(v) => setForm({ ...form, pincode: v })}
//           />
//         </View>

//         <TextInput
//           placeholder="LANDMARK"
//           placeholderTextColor="#000" // ✅ Black placeholder
//           style={styles.input}
//           value={form.landmark}
//           onChangeText={(v) => setForm({ ...form, landmark: v })}
//         />

//         {/* Address Type Picker */}
//         <View style={styles.row}>
//           <Text style={{ marginRight: 10, color: "#000" }}>Address Type:</Text>
//           <View style={{ flex: 1, backgroundColor: "#fff", borderRadius: 8, borderWidth: 1, borderColor: "#050505ff", padding: 1.5 }}>
//             <Picker
//               selectedValue={form.address_type}
//               style={{
//                 color: "#000", // ✅ black text
//                 backgroundColor: "#fff", // ✅ white background
//                 height: 55,
//               }}
//               dropdownIconColor="#000" // ✅ makes the dropdown arrow black (Android)
//               onValueChange={(itemValue) =>
//                 setForm({ ...form, address_type: itemValue })
//               }
//               itemStyle={{ color: "#000" }} // ✅ for iOS
//             >
//               <Picker.Item label="Shipping" value="shipping" />
//               <Picker.Item label="Billing" value="billing" />
//             </Picker>
//           </View>
//         </View>


//         {/* ✅ Checkbox: Same as other address */}
//         <View style={styles.checkboxRow}>
//           <TouchableOpacity
//             style={styles.checkbox}
//             onPress={() => setSameAsOther(!sameAsOther)}
//           >
//             {sameAsOther && <View style={styles.checkboxTick} />}
//           </TouchableOpacity>
//           <Text style={styles.checkboxLabel}>
//             Same as{" "}
//             {form.address_type === "shipping" ? "Billing" : "Shipping"} Address
//           </Text>
//         </View>

//         {/* Set Default */}
//         <View style={styles.row}>
//           <Text style={{ marginRight: 10 }}>Set as Default:</Text>
//           <TouchableOpacity
//             style={styles.radioOuter}
//             onPress={() => setForm({ ...form, is_default: !form.is_default })}
//           >
//             {form.is_default && <View style={styles.radioInner} />}
//           </TouchableOpacity>
//         </View>

//         <TouchableOpacity onPress={handleSubmit} style={styles.addBtn}>
//           <Text style={{ color: "white", fontWeight: "bold" }}>
//             {form.id ? "Update Address" : "Add Address"}
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {/* Saved Addresses */}
//       <Text style={styles.sectionTitle}>Saved Addresses</Text>
//       {loading ? (
//         <Text style={{ textAlign: "center" }}>Loading...</Text>
//       ) : addresses.length === 0 ? (
//         <Text style={{ textAlign: "center" }}>No addresses found</Text>
//       ) : (
//         addresses.map((addr) => (
//           <View key={addr.id} style={styles.card}>
//             <View style={styles.addressHeader}>
//               <Text style={styles.addressType}>
//                 {addr.address_type.toUpperCase()}
//               </Text>
//               {addr.is_default === 1 && (
//                 <Text style={styles.defaultBadge}>DEFAULT</Text>
//               )}
//             </View>

//             <Text style={styles.addressText}>
//               {addr.full_name} | {addr.phone}
//             </Text>
//             <Text style={styles.addressText}>
//               {addr.address_line1} {addr.address_line2}
//             </Text>
//             <Text style={styles.addressText}>
//               {addr.village}, {addr.district}
//             </Text>
//             <Text style={styles.addressText}>
//               {addr.state} - {addr.pincode}
//             </Text>
//             {addr.landmark && (
//               <Text style={styles.addressText}>Landmark: {addr.landmark}</Text>
//             )}


//             <View style={styles.actions}>
//               {addr.is_default !== 1 && (
//                 <TouchableOpacity onPress={() => setDefaultAddress(addr.id)} style={styles.actionButton}>
//                   <Text style={styles.setDefault}>Set Default</Text>
//                 </TouchableOpacity>
//               )}
//               <TouchableOpacity onPress={() => handleEdit(addr)} style={styles.actionButton}>
//                 <Text style={styles.edit}>Edit</Text>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={() => handleDelete(addr.id)} style={styles.actionButton}>
//                 <Text style={styles.delete}>Delete</Text>
//               </TouchableOpacity>
//             </View>

//           </View>
//         ))
//       )}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 15, backgroundColor: "#fff" },
//   headerRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 5,
//     justifyContent: "space-between",
//     paddingVertical: 2,
//   },
//   header: { fontSize: 20, fontWeight: "bold", textAlign: "center", flex: 1 },
//   form: {
//     marginBottom: 25,
//     padding: 15,
//     backgroundColor: "#f9f9f9",
//     borderRadius: 10,
//   },
//   sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 10 },
//   input: {
//     borderWidth: 1,
//     borderColor: "#050505ff",
//     padding: 10,
//     borderRadius: 8,
//     marginVertical: 5,
//   },
//   rowWrap: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   halfInput: {
//     flex: 1,
//     marginHorizontal: 5,
//   },
//   checkboxRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginVertical: 10,
//   },
//   checkbox: {
//     width: 22,
//     height: 22,
//     borderWidth: 2,
//     borderColor: "#548c5c",
//     borderRadius: 4,
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 10,
//   },
//   checkboxTick: {
//     width: 12,
//     height: 12,
//     backgroundColor: "#548c5c",
//   },
//   checkboxLabel: { fontSize: 15, color: "#333" },
//   addBtn: {
//     marginTop: 10,
//     backgroundColor: "#548c5c",
//     padding: 12,
//     alignItems: "center",
//     borderRadius: 8,
//   },
//   card: {
//     padding: 15,
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 10,
//     marginBottom: 10,
//   },
//   addressHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   addressType: { fontWeight: "bold", color: "#444" },
//   defaultBadge: {
//     backgroundColor: "#4CAF50",
//     color: "#fff",
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 5,
//     fontSize: 12,
//   },
//   addressText: { marginVertical: 2, color: "#555" },
//   row: { flexDirection: "row", alignItems: "center", marginVertical: 5 },
//   radioOuter: {
//     width: 20,
//     height: 20,
//     borderRadius: 10,
//     borderWidth: 2,
//     borderColor: "#555",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   radioInner: {
//     width: 10,
//     height: 10,
//     borderRadius: 5,
//     backgroundColor: "#548c5c",
//   },
//   // actions: { flexDirection: "row", justifyContent: "flex-end", marginTop: 10 },
//   // setDefault: { color: "#1976D2", marginRight: 15 },
//   // edit: { color: "#FFA500", marginRight: 15 ,width:40},
//   // delete: { color: "red" ,width:40},
//   actions: {
//     flexDirection: 'row',
//     alignItems: 'right',
//     justifyContent: "flex-end", // even spacing
//     marginTop: 10,
//   },
//   actionButton: {
//     paddingHorizontal: 9,
//     paddingVertical: 6,
//     borderRadius: 8,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   setDefault: {
//     color: '#1976D2',
//     fontWeight: '600',
//   },
//   edit: {
//     color: '#FFA500',
//     fontWeight: '600',
//   },
//   delete: {
//     color: '#dc3545',
//     fontWeight: '600',
//   },
// });



//new code 

// // AddressScreen.js
// import React, { useEffect, useState, useCallback } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   ScrollView,
//   StyleSheet,
//   TouchableOpacity,
//   Alert,
//   ActivityIndicator,
//   Platform,
//   FlatList,
// } from "react-native";
// import axios from "axios";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import BASE_URL from "../Config/api";
// import DropDownPicker from "react-native-dropdown-picker";
// import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
// import Ionicons from "react-native-vector-icons/Ionicons";
// import { useNavigation } from "@react-navigation/native";
// import { showToast } from "../Components/CustomToast";

// export default function AddressScreen() {
//   const navigation = useNavigation();

//   // data
//   const [customerId, setCustomerId] = useState(null);
//   const [addresses, setAddresses] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [pincodeLoading, setPincodeLoading] = useState(false);
//   const [sameAsOther, setSameAsOther] = useState(false);

//   // form state
//   const [form, setForm] = useState({
//     id: null,
//     full_name: "",
//     phone: "",
//     address_line1: "",
//     address_line2: "",
//     village: "",
//     district: "",
//     state: "",
//     pincode: "",
//     landmark: "",
//     address_type: "shipping",
//     is_default: false,
//   });

//   // dropdown states (react-native-dropdown-picker)
//   const [districtOpen, setDistrictOpen] = useState(false);
//   const [villageOpen, setVillageOpen] = useState(false);

//   const [districtItems, setDistrictItems] = useState([]); // [{label, value}]
//   const [villageItems, setVillageItems] = useState([]); // filtered by selected district

//   // helper mapping: { districtName: [villageName1, villageName2, ...] }
//   const [villagesByDistrict, setVillagesByDistrict] = useState({});

//   // ------------------ Init ------------------
//   const getCustomerId = async () => {
//     try {
//       const userString = await AsyncStorage.getItem("user");
//       if (userString) {
//         const user = JSON.parse(userString);
//         if (user.customer_id) setCustomerId(user.customer_id);
//       }
//     } catch (err) {
//       console.log("Error getting user object:", err.message);
//     }
//   };

//   useEffect(() => {
//     getCustomerId();
//   }, []);

//   useEffect(() => {
//     if (customerId) fetchAddresses();
//   }, [customerId]);

//   // ------------------ Fetch saved addresses ------------------
//   const fetchAddresses = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(`${BASE_URL}/api/addresses/getByCustomer/${customerId}`);
//       const addressesData = res.data.data || [];

//       // convert backend is_default (1/0) to boolean for UI and ensure one default
//       const hasDefault = addressesData.some((a) => a.is_default === 1);
//       const normalized = addressesData.map((a, idx) => {
//         return {
//           ...a,
//           is_default: a.is_default === 1,
//         };
//       });

//       if (!hasDefault && normalized.length > 0) {
//         normalized[0].is_default = true;
//       }

//       setAddresses(normalized);
//     } catch (err) {
//       console.log("Fetch addresses error:", err.message || err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ------------------ Pincode API + populate dropdown data ------------------
//   useEffect(() => {
//     // only when 6 digits
//     if (form.pincode && form.pincode.length === 6) {
//       setPincodeLoading(true);
//       fetch(`https://api.postalpincode.in/pincode/${form.pincode}`)
//         .then((res) => res.json())
//         .then((data) => {
//           const response = data[0];
//           if (response && response.Status === "Success") {
//             // collect unique districts and villages and map villages by district
//             const postOffices = response.PostOffice || [];

//             // map district => villages
//             const map = {};
//             postOffices.forEach((po) => {
//               const district = po.District || "";
//               const village = po.Name || "";
//               if (!map[district]) map[district] = new Set();
//               map[district].add(village);
//             });

//             // convert map to plain arrays
//             const districtList = Object.keys(map).sort();
//             const villagesMap = {};
//             districtList.forEach((d) => {
//               villagesMap[d] = Array.from(map[d]).sort();
//             });

//             // prepare dropdown items
//             const districtDropdown = districtList.map((d) => ({ label: d, value: d }));
//             // pick first district as default selection
//             const defaultDistrict = districtList[0] || "";
//             const defaultVillage = villagesMap[defaultDistrict] ? villagesMap[defaultDistrict][0] : "";

//             const villageDropdown = (villagesMap[defaultDistrict] || []).map((v) => ({ label: v, value: v }));

//             // set state
//             setDistrictItems(districtDropdown);
//             setVillagesByDistrict(villagesMap);
//             setVillageItems(villageDropdown);

//             setForm((prev) => ({
//               ...prev,
//               district: defaultDistrict,
//               village: defaultVillage,
//               state: postOffices[0]?.State || "",
//             }));

//             showToast("success", "Pincode Valid", "Location autofilled!");
//           } else {
//             // invalid pincode
//             // clear dropdowns
//             setDistrictItems([]);
//             setVillageItems([]);
//             setVillagesByDistrict({});
//             setForm((prev) => ({ ...prev, village: "", district: "", state: "" }));
//             showToast("error", "Invalid Pincode", "Please check and try again");
//           }
//         })
//         .catch((err) => {
//           console.log("Pincode API Error:", err.message || err);
//           showToast("error", "Error", "Failed to fetch pincode info!");
//         })
//         .finally(() => {
//           setPincodeLoading(false);
//         });
//     } else if (!form.pincode) {
//       // if pincode cleared, reset dropdowns
//       setDistrictItems([]);
//       setVillageItems([]);
//       setVillagesByDistrict({});
//       setForm((prev) => ({ ...prev, village: "", district: "", state: "" }));
//     }
//   }, [form.pincode]);

//   // when district changes, update villageItems from villagesByDistrict
//   useEffect(() => {
//     if (form.district && villagesByDistrict[form.district]) {
//       const items = villagesByDistrict[form.district].map((v) => ({ label: v, value: v }));
//       setVillageItems(items);

//       // If current village not in items, set the first village
//       if (!villagesByDistrict[form.district].includes(form.village)) {
//         setForm((prev) => ({ ...prev, village: items[0]?.value || "" }));
//       }
//     }
//   }, [form.district, villagesByDistrict]);

//   // ------------------ Add / Update ------------------
//   const handleSubmit = async () => {
//     if (!form.full_name || !form.phone || !form.address_line1) {
//       showToast("warning", "Warning", "Please fill all required fields!");
//       return;
//     }

//     try {
//       const payload = { ...form, is_default: form.is_default ? 1 : 0 };
//       if (form.id) {
//         await axios.put(`${BASE_URL}/api/addresses/updateAddress/${form.id}`, payload);
//         showToast("success", "Success!", "Address updated successfully!");
//       } else {
//         await axios.post(`${BASE_URL}/api/addresses/addAddress`, { ...payload, customer_id: customerId });

//         if (sameAsOther) {
//           const otherType = form.address_type === "shipping" ? "billing" : "shipping";
//           await axios.post(`${BASE_URL}/api/addresses/addAddress`, {
//             ...payload,
//             customer_id: customerId,
//             address_type: otherType,
//           });
//         }

//         showToast("success", "Success!", "Address added successfully!");
//       }

//       // reset form
//       setForm({
//         id: null,
//         full_name: "",
//         phone: "",
//         address_line1: "",
//         address_line2: "",
//         village: "",
//         district: "",
//         state: "",
//         pincode: "",
//         landmark: "",
//         address_type: "shipping",
//         is_default: false,
//       });
//       setSameAsOther(false);
//       // clear dropdowns
//       setDistrictItems([]);
//       setVillageItems([]);
//       setVillagesByDistrict({});

//       fetchAddresses();
//     } catch (err) {
//       console.log("Submit error:", err.response?.data || err.message || err);
//       showToast("error", "Error", "Failed to submit address!");
//     }
//   };

//   // ------------------ Delete ------------------
//   const handleDelete = async (id) => {
//     Alert.alert("Delete Address", "Are you sure?", [
//       { text: "Cancel" },
//       {
//         text: "Yes",
//         onPress: async () => {
//           try {
//             await axios.delete(`${BASE_URL}/api/addresses/deleteAddress/${id}`);
//             // update local UI
//             setAddresses((prev) => prev.filter((i) => i.id !== id));
//             showToast("warning", "Deleted", "Address Deleted!");
//           } catch (err) {
//             console.log("Delete error:", err.message || err);
//             showToast("error", "Error", "Check it Once!");
//           }
//         },
//       },
//     ]);
//   };

//   // ------------------ Set Default ------------------
//   const setDefaultAddress = async (addressId) => {
//     try {
//       await axios.patch(`${BASE_URL}/api/addresses/setDefault/${addressId}`);
//       fetchAddresses();
//       showToast("success", "Success", "Default address updated!");
//     } catch (err) {
//       console.log("Set default error:", err.message || err);
//       showToast("error", "Error", "Could not update default address!");
//     }
//   };

//   // ------------------ Edit ------------------
//   const handleEdit = (addr) => {
//     // prepare dropdown data for pincode if available
//     setForm({
//       ...addr,
//       is_default: addr.is_default === 1 || addr.is_default === true,
//     });

//     // If addr has pincode, trigger pincode useEffect to populate district/village lists
//     if (addr.pincode && addr.pincode.length === 6) {
//       // temporarily set pincode which will trigger the effect to fetch dropdown items
//       setForm((prev) => ({ ...prev, pincode: addr.pincode }));
//     }
//   };

//   // ------------------ Render ------------------
//   return (
//     <KeyboardAwareScrollView 
//     style={styles.container} 
//     contentContainerStyle={{ paddingBottom: 40 }}
//     enableOnAndroid
//   extraHeight={120}
//   extraScrollHeight={120}
//   keyboardShouldPersistTaps="handled"
//   showsVerticalScrollIndicator={false}
//     >
//       {/* HEADER */}
//       <View style={styles.headerRow}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
//           <Ionicons name="arrow-back" size={22} color="#333" />
//         </TouchableOpacity>
//         <Text style={styles.header}>Manage Addresses</Text>
//         <View style={{ width: 36 }} />
//       </View>

//       {/* FORM CARD */}
//       <View style={styles.formCard}>
//         <Text style={styles.formTitle}>{form.id ? "Edit Address" : "Add New Address"}</Text>

//         {/* PINCODE */}
//         <View style={{ marginBottom: 8 }}>
//           <Text style={styles.label}>Pincode</Text>
//           <View style={{ flexDirection: "row", alignItems: "center" }}>
//             <TextInput
//               value={form.pincode}
//               onChangeText={(v) => setForm((prev) => ({ ...prev, pincode: v.replace(/[^0-9]/g, "") }))}
//               placeholder="Enter 6-digit pincode"
//               placeholderTextColor="#666"
//               keyboardType="number-pad"
//               maxLength={6}
//               style={[styles.input, { flex: 1 }]}
//             />
//             {pincodeLoading && <ActivityIndicator style={{ marginLeft: 8 }} size="small" />}
//           </View>
//           <Text style={styles.hint}>Enter pincode first to auto-populate district & villages</Text>
//         </View>

//         {/* Name + Phone */}
//         <View style={styles.rowWrap}>
//           <View style={{ flex: 1 }}>
//             <Text style={styles.label}>Full Name</Text>
//             <TextInput
//               value={form.full_name}
//               onChangeText={(v) => setForm((prev) => ({ ...prev, full_name: v }))}
//               placeholder="Full name"
//               placeholderTextColor="#666"
//               style={[styles.input, { marginBottom: 0 }]}
//             />
//           </View>

//           <View style={{ width: 12 }} />

//           <View style={{ flex: 1 }}>
//             <Text style={styles.label}>Phone</Text>
//             <TextInput
//               value={form.phone}
//               onChangeText={(v) => setForm((prev) => ({ ...prev, phone: v.replace(/[^0-9]/g, "") }))}
//               placeholder="Mobile number"
//               placeholderTextColor="#666"
//               keyboardType="phone-pad"
//               style={[styles.input, { marginBottom: 0 }]}
//             />
//           </View>
//         </View>

//         {/* Address lines */}
//         <View>
//           <Text style={styles.label}>Address Line 1</Text>
//           <TextInput
//             value={form.address_line1}
//             onChangeText={(v) => setForm((prev) => ({ ...prev, address_line1: v }))}
//             placeholder="House / Building / Street"
//             placeholderTextColor="#666"
//             style={styles.input}
//           />
//         </View>

//         <View>
//           <Text style={styles.label}>Address Line 2</Text>
//           <TextInput
//             value={form.address_line2}
//             onChangeText={(v) => setForm((prev) => ({ ...prev, address_line2: v }))}
//             placeholder="Area / Locality (optional)"
//             placeholderTextColor="#666"
//             style={styles.input}
//           />
//         </View>

//         {/* District dropdown + Village dropdown (cascading) */}
//         <View style={styles.rowWrap}>
//           <View style={{ flex: 1, zIndex: Platform.OS === "android" ? 5000 : 2000 }}>
//             <Text style={styles.label}>District</Text>
//             <DropDownPicker
//               open={districtOpen}
//               value={form.district}
//               items={districtItems}
//               setOpen={setDistrictOpen}
//               setValue={(fn) => {
//                 const value = typeof fn === "function" ? fn() : fn;
//                 setForm((prev) => ({ ...prev, district: value }));
//               }}
//               placeholder="Select district"
//               containerStyle={{ marginBottom: 8 }}
//               dropDownContainerStyle={styles.dropDownContainer}
//               style={styles.dropdown}
//               zIndex={5000}
//             />
//           </View>

//           <View style={{ width: 12 }} />

//           <View style={{ flex: 1, zIndex: Platform.OS === "android" ? 4000 : 1500 }}>
//             <Text style={styles.label}>Village</Text>
//             <DropDownPicker
//               open={villageOpen}
//               value={form.village}
//               items={villageItems}
//               setOpen={setVillageOpen}
//               setValue={(fn) => {
//                 const value = typeof fn === "function" ? fn() : fn;
//                 setForm((prev) => ({ ...prev, village: value }));
//               }}
//               placeholder="Select village"
//               containerStyle={{ marginBottom: 8 }}
//               dropDownContainerStyle={styles.dropDownContainer}
//               style={styles.dropdown}
//               zIndex={2000}
//             />
//           </View>
//         </View>

//         {/* State (readonly) + Landmark */}
//         <View style={styles.rowWrap}>
//           <View style={{ flex: 1 }}>
//             <Text style={styles.label}>State</Text>
//             <TextInput
//               value={form.state}
//               editable={false}
//               placeholder="State"
//               placeholderTextColor="#666"
//               style={[styles.input, { backgroundColor: "#f2f2f2" }]}
//             />
//           </View>

//           <View style={{ width: 12 }} />

//           <View style={{ flex: 1 }}>
//             <Text style={styles.label}>Landmark</Text>
//             <TextInput
//               value={form.landmark}
//               onChangeText={(v) => setForm((prev) => ({ ...prev, landmark: v }))}
//               placeholder="Landmark (optional)"
//               placeholderTextColor="#666"
//               style={styles.input}
//             />
//           </View>
//         </View>

//         {/* Address type & same-as-other & default */}
//         <View style={[styles.row, { marginTop: 6 }]}>
//           <View style={{ flex: 1 }}>
//             <Text style={styles.labelSmall}>Address Type</Text>
//             <View style={styles.pickerRow}>
//               <TouchableOpacity
//                 onPress={() => setForm((prev) => ({ ...prev, address_type: "shipping" }))}
//                 style={[
//                   styles.typeChip,
//                   form.address_type === "shipping" && styles.typeChipActive,
//                 ]}
//               >
//                 <Text style={[styles.typeChipText, form.address_type === "shipping" && styles.typeChipTextActive]}>Shipping</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 onPress={() => setForm((prev) => ({ ...prev, address_type: "billing" }))}
//                 style={[
//                   styles.typeChip,
//                   form.address_type === "billing" && styles.typeChipActive,
//                 ]}
//               >
//                 <Text style={[styles.typeChipText, form.address_type === "billing" && styles.typeChipTextActive]}>Billing</Text>
//               </TouchableOpacity>
//             </View>
//           </View>

//           <View style={{ width: 12 }} />

//           <View style={{ flex: 1 }}>
//             <Text style={styles.labelSmall}>Options</Text>
//             <View style={{ flexDirection: "row", alignItems: "center" }}>
//               {/* Same as other */}
//               <TouchableOpacity style={styles.checkbox} onPress={() => setSameAsOther((s) => !s)}>
//                 {sameAsOther && <View style={styles.checkboxTick} />}
//               </TouchableOpacity>
//               <Text style={{ marginRight: 12 }}>Same as other</Text>

//               {/* Default */}
//               <TouchableOpacity
//                 style={styles.radioOuter}
//                 onPress={() => setForm((prev) => ({ ...prev, is_default: !prev.is_default }))}
//               >
//                 {form.is_default ? <View style={styles.radioInner} /> : null}
//               </TouchableOpacity>
//               <Text style={{ marginLeft: 8 }}>Default</Text>
//             </View>
//           </View>
//         </View>

//         {/* Submit */}
//         <TouchableOpacity onPress={handleSubmit} style={styles.saveBtn}>
//           <Text style={styles.saveBtnText}>{form.id ? "Update Address" : "Add Address"}</Text>
//         </TouchableOpacity>
//       </View>

//       {/* SAVED ADDRESSES */}
//       <Text style={[styles.sectionTitle, { marginTop: 6 }]}>Saved Addresses</Text>

//       {/* {loading ? (
//         <View style={{ padding: 20 }}><ActivityIndicator /></View>
//       ) : addresses.length === 0 ? (
//         <Text style={{ textAlign: "center", color: "#666", marginTop: 8 }}>No addresses found</Text>
//       ) : (
//         addresses.map((addr) => (
//           <View key={addr.id} style={styles.card}>
//             <View style={styles.cardHeader}>
//               <View>
//                 <Text style={styles.cardTitle}>{addr.full_name}</Text>
//                 <Text style={styles.cardSub}>{addr.phone}</Text>
//               </View>

//               <View style={{ alignItems: "flex-end" }}>
//                 <Text style={styles.typeBadge}>{addr.address_type?.toUpperCase()}</Text>
//                 {addr.is_default ? <Text style={styles.defaultBadge}>DEFAULT</Text> : null}
//               </View>
//             </View>

//             <Text style={styles.cardLine}>{addr.address_line1} {addr.address_line2}</Text>
//             <Text style={styles.cardLine}>{addr.village}, {addr.district}</Text>
//             <Text style={styles.cardLine}>{addr.state} - {addr.pincode}</Text>
//             {addr.landmark ? <Text style={styles.cardLine}>Landmark: {addr.landmark}</Text> : null}

//             <View style={styles.cardActions}>
//               {!addr.is_default && (
//                 <TouchableOpacity onPress={() => setDefaultAddress(addr.id)} style={styles.actionBtn}>
//                   <Text style={styles.actionTextPrimary}>Set Default</Text>
//                 </TouchableOpacity>
//               )}

//               <TouchableOpacity onPress={() => handleEdit(addr)} style={styles.actionBtn}>
//                 <Text style={styles.actionText}>Edit</Text>
//               </TouchableOpacity>

//               <TouchableOpacity onPress={() => handleDelete(addr.id)} style={styles.actionBtn}>
//                 <Text style={[styles.actionText, { color: "#d32f2f" }]}>Delete</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         ))
//       )} */}

//       {loading ? (
//   <View style={{ padding: 20 }}>
//     <ActivityIndicator />
//   </View>
// ) : (
//   <FlatList
//     data={addresses}
//     keyExtractor={(item) => item.id.toString()}
//     contentContainerStyle={{ paddingBottom: 40 }}
//     ListEmptyComponent={
//       <Text style={{ textAlign: "center", color: "#666", marginTop: 8 }}>
//         No addresses found
//       </Text>
//     }
//     renderItem={({ item: addr }) => (
//       <View style={styles.card}>
//         <View style={styles.cardHeader}>
//           <View>
//             <Text style={styles.cardTitle}>{addr.full_name}</Text>
//             <Text style={styles.cardSub}>{addr.phone}</Text>
//           </View>

//           <View style={{ alignItems: "flex-end" }}>
//             <Text style={styles.typeBadge}>{addr.address_type?.toUpperCase()}</Text>
//             {addr.is_default ? <Text style={styles.defaultBadge}>DEFAULT</Text> : null}
//           </View>
//         </View>

//         <Text style={styles.cardLine}>{addr.address_line1} {addr.address_line2}</Text>
//         <Text style={styles.cardLine}>{addr.village}, {addr.district}</Text>
//         <Text style={styles.cardLine}>{addr.state} - {addr.pincode}</Text>
//         {addr.landmark ? <Text style={styles.cardLine}>Landmark: {addr.landmark}</Text> : null}

//         <View style={styles.cardActions}>
//           {!addr.is_default && (
//             <TouchableOpacity
//               onPress={() => setDefaultAddress(addr.id)}
//               style={styles.actionBtn}
//             >
//               <Text style={styles.actionTextPrimary}>Set Default</Text>
//             </TouchableOpacity>
//           )}

//           <TouchableOpacity onPress={() => handleEdit(addr)} style={styles.actionBtn}>
//             <Text style={styles.actionText}>Edit</Text>
//           </TouchableOpacity>

//           <TouchableOpacity onPress={() => handleDelete(addr.id)} style={styles.actionBtn}>
//             <Text style={[styles.actionText, { color: "#d32f2f" }]}>Delete</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     )}
//   />
// )}

//     </KeyboardAwareScrollView>
//   );
// }

// // ------------------ styles ------------------
// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#fff", padding: 14 },

//   headerRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 10,
//     justifyContent: "space-between",
//   },
//   backBtn: {
//     width: 36,
//     height: 36,
//     borderRadius: 10,
//     backgroundColor: "#f2f2f2",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   header: { fontSize: 18, fontWeight: "700", color: "#111" },

//   formCard: {
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     padding: 14,
//     marginBottom: 14,
//     // subtle shadow
//     ...Platform.select({
//       ios: {
//         shadowColor: "#000",
//         shadowOffset: { width: 0, height: 6 },
//         shadowOpacity: 0.06,
//         shadowRadius: 12,
//       },
//       android: {
//         elevation: 3,
//       },
//     }),
//   },
//   formTitle: { fontSize: 16, fontWeight: "700", marginBottom: 8 },

//   label: { fontSize: 12, color: "#444", marginBottom: 6 },
//   labelSmall: { fontSize: 12, color: "#444", marginBottom: 6 },

//   input: {
//     borderWidth: 1,
//     borderColor: "#e6e6e6",
//     borderRadius: 10,
//     paddingVertical: 10,
//     paddingHorizontal: 12,
//     marginBottom: 10,
//     color: "#111",
//     backgroundColor: "#fff",
//   },

//   hint: { fontSize: 11, color: "#888", marginTop: 4 },

//   rowWrap: { flexDirection: "row", alignItems: "flex-start" },

//   dropdown: {
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: "#e6e6e6",
//     height: 48,
//   },
//   dropDownContainer: {
//     borderColor: "#e6e6e6",
//     borderRadius: 10,
//   },

//   pickerRow: { flexDirection: "row", alignItems: "center" },
//   typeChip: {
//     paddingVertical: 8,
//     paddingHorizontal: 14,
//     borderRadius: 20,
//     backgroundColor: "#f2f2f2",
//     marginRight: 8,
//   },
//   typeChipActive: {
//     backgroundColor: "#2FAF63",
//   },
//   typeChipText: { color: "#333", fontWeight: "600" },
//   typeChipTextActive: { color: "#fff" },

//   checkbox: {
//     width: 20,
//     height: 20,
//     borderWidth: 2,
//     borderColor: "#bbb",
//     borderRadius: 4,
//     marginRight: 8,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   checkboxTick: {
//     width: 12,
//     height: 12,
//     backgroundColor: "#2FAF63",
//     borderRadius: 2,
//   },

//   radioOuter: {
//     width: 20,
//     height: 20,
//     borderRadius: 12,
//     borderWidth: 2,
//     borderColor: "#bbb",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   radioInner: {
//     width: 10,
//     height: 10,
//     borderRadius: 8,
//     backgroundColor: "#2FAF63",
//   },

//   saveBtn: {
//     marginTop: 6,
//     backgroundColor: "#2FAF63",
//     paddingVertical: 12,
//     borderRadius: 10,
//     alignItems: "center",
//   },
//   saveBtnText: { color: "#fff", fontWeight: "700" },

//   sectionTitle: { fontSize: 16, fontWeight: "700", marginVertical: 8 },

//   card: {
//     backgroundColor: "#fff",
//     padding: 12,
//     borderRadius: 12,
//     marginBottom: 10,
//     borderWidth: 1,
//     borderColor: "#f0f0f0",
//     ...Platform.select({
//       ios: {
//         shadowColor: "#000",
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.04,
//         shadowRadius: 8,
//       },
//       android: {
//         elevation: 1,
//       },
//     }),
//   },
//   cardHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
//   cardTitle: { fontSize: 15, fontWeight: "700" },
//   cardSub: { color: "#666", fontSize: 12 },
//   typeBadge: {
//     backgroundColor: "#f2f2f2",
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 8,
//     fontSize: 12,
//   },
//   defaultBadge: {
//     marginTop: 6,
//     backgroundColor: "#2FAF63",
//     color: "#fff",
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 8,
//     fontSize: 11,
//     color: "#fff",
//   },

//   cardLine: { color: "#444", fontSize: 13, marginBottom: 4 },

//   cardActions: { flexDirection: "row", justifyContent: "flex-end", marginTop: 6 },
//   actionBtn: { marginLeft: 12 },
//   actionText: { color: "#1976D2", fontWeight: "700" },
//   actionTextPrimary: { color: "#2FAF63", fontWeight: "700" },
// });



// AddressScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
  FlatList,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BASE_URL from "../Config/api";
import DropDownPicker from "react-native-dropdown-picker";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { showToast } from "../Components/CustomToast";
// import GoHomeButton from "../Components/GoHomeButton";

export default function AddressScreen() {
  const navigation = useNavigation();

  // Data
  const [customerId, setCustomerId] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [sameAsOther, setSameAsOther] = useState(false);

  // Form state
  const [form, setForm] = useState({
    id: null,
    full_name: "",
    phone: "",
    address_line1: "",
    address_line2: "",
    village: "",
    district: "",
    state: "",
    pincode: "",
    landmark: "",
    address_type: "shipping",
    is_default: false,
  });

  // Dropdowns
  const [districtOpen, setDistrictOpen] = useState(false);
  const [villageOpen, setVillageOpen] = useState(false);

  const [districtItems, setDistrictItems] = useState([]);
  const [villageItems, setVillageItems] = useState([]);
  const [villagesByDistrict, setVillagesByDistrict] = useState({});

  // Load user ID
  useEffect(() => {
    (async () => {
      const userString = await AsyncStorage.getItem("user");
      if (userString) {
        const user = JSON.parse(userString);
        setCustomerId(user.customer_id);
      }
    })();
  }, []);

  // Load addresses
  useEffect(() => {
    if (customerId) fetchAddresses();
  }, [customerId]);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/addresses/getByCustomer/${customerId}`);
      const arr = res.data.data || [];

      const formatted = arr.map((a) => ({
        ...a,
        is_default: a.is_default === 1,
      }));

      // ensure one default
      if (!formatted.some((a) => a.is_default) && formatted.length > 0) {
        formatted[0].is_default = true;
      }

      setAddresses(formatted);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // -------- PINCODE HANDLER --------
  useEffect(() => {
    if (form.pincode.length === 6) {
      setPincodeLoading(true);

      fetch(`https://api.postalpincode.in/pincode/${form.pincode}`)
        .then((res) => res.json())
        .then((data) => {
          const resp = data[0];

          if (resp.Status !== "Success") {
            setDistrictItems([]);
            setVillageItems([]);
            setVillagesByDistrict({});
            setForm((prev) => ({ ...prev, state: "", village: "", district: "" }));
            showToast("error", "Invalid Pincode", "Please check again!");
            return;
          }

          const offices = resp.PostOffice;
          const map = {};

          offices.forEach((po) => {
            if (!map[po.District]) map[po.District] = new Set();
            map[po.District].add(po.Name);
          });

          const districtList = Object.keys(map).sort();
          const cleanedMap = {};

          districtList.forEach((d) => {
            cleanedMap[d] = [...map[d]].sort();
          });

          const defaultDistrict = districtList[0];
          const defaultVillage = cleanedMap[defaultDistrict]?.[0];

          setDistrictItems(districtList.map((d) => ({ label: d, value: d })));
          setVillagesByDistrict(cleanedMap);
          setVillageItems(cleanedMap[defaultDistrict].map((v) => ({ label: v, value: v })));

          setForm((prev) => ({
            ...prev,
            district: defaultDistrict,
            village: defaultVillage,
            state: offices[0]?.State || "",
          }));

          showToast("success", "Pincode Valid", "Location autofilled!");
        })
        .catch(() => {
          showToast("error", "Error", "Failed to fetch pincode details!");
        })
        .finally(() => setPincodeLoading(false));
    }
  }, [form.pincode]);

  // When district changes, update villages
  useEffect(() => {
    if (!form.district) return;
    if (!villagesByDistrict[form.district]) return;

    const list = villagesByDistrict[form.district];

    setVillageItems(list.map((v) => ({ label: v, value: v })));

    if (!list.includes(form.village)) {
      setForm((prev) => ({ ...prev, village: list[0] }));
    }
  }, [form.district]);

  // SAVE / UPDATE ADDRESS
  const handleSubmit = async () => {
    if (!form.full_name || !form.phone || !form.address_line1) {
      showToast("warning", "Warning", "Please fill all required fields!");
      return;
    }

    try {
      const payload = { ...form, is_default: form.is_default ? 1 : 0 };

      if (form.id) {
        await axios.put(`${BASE_URL}/api/addresses/updateAddress/${form.id}`, payload);
      } else {
        await axios.post(`${BASE_URL}/api/addresses/addAddress`, {
          ...payload,
          customer_id: customerId,
        });

        if (sameAsOther) {
          const other = form.address_type === "shipping" ? "billing" : "shipping";
          await axios.post(`${BASE_URL}/api/addresses/addAddress`, {
            ...payload,
            address_type: other,
            customer_id: customerId,
          });
        }
      }

      showToast("success", "Success", "Address saved!");

      setForm({
        id: null,
        full_name: "",
        phone: "",
        address_line1: "",
        address_line2: "",
        village: "",
        district: "",
        state: "",
        pincode: "",
        landmark: "",
        address_type: "shipping",
        is_default: false,
      });

      setDistrictItems([]);
      setVillageItems([]);

      fetchAddresses();
    } catch (err) {
      console.log(err);
    }
  };

  // DELETE ADDRESS
  const handleDelete = (id) => {
    Alert.alert("Delete", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "Yes",
        onPress: async () => {
          try {
            await axios.delete(`${BASE_URL}/api/addresses/deleteAddress/${id}`);
            setAddresses((prev) => prev.filter((a) => a.id !== id));
          } catch (err) {
            console.log(err);
          }
        },
      },
    ]);
  };

  // EDIT ADDRESS
  const handleEdit = (addr) => {
    setForm({
      ...addr,
      is_default: addr.is_default === true || addr.is_default === 1,
    });

    if (addr.pincode?.length === 6) {
      setForm((prev) => ({ ...prev, pincode: addr.pincode }));
    }
  };

  // SET DEFAULT ADDRESS
  const setDefaultAddress = async (addressId) => {
    await axios.patch(`${BASE_URL}/api/addresses/setDefault/${addressId}`);
    fetchAddresses();
  };

  // -------- RENDER --------

  const renderAddressCard = ({ item: addr }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.cardTitle}>{addr.full_name}</Text>
          <Text style={styles.cardSub}>{addr.phone}</Text>
        </View>

        <View style={{ alignItems: "flex-end" }}>
          <Text style={styles.typeBadge}>{addr.address_type.toUpperCase()}</Text>
          {addr.is_default && <Text style={styles.defaultBadge}>DEFAULT</Text>}
        </View>
      </View>

      <Text style={styles.cardLine}>{addr.address_line1} {addr.address_line2}</Text>
      <Text style={styles.cardLine}>{addr.village}, {addr.district}</Text>
      <Text style={styles.cardLine}>{addr.state} - {addr.pincode}</Text>
      {addr.landmark ? <Text style={styles.cardLine}>Landmark: {addr.landmark}</Text> : null}

      <View style={styles.cardActions}>
        {!addr.is_default && (
          <TouchableOpacity onPress={() => setDefaultAddress(addr.id)}>
            <Text style={styles.actionPrimary}>Set Default</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={() => handleEdit(addr)}>
          <Text style={styles.action}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleDelete(addr.id)}>
          <Text style={[styles.action, { color: "#d32f2f" }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <FlatList
      data={addresses}
      keyExtractor={(item) => item.id?.toString()}
      ListHeaderComponent={
        <>
          {/* Header */}
          {/* <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={22} color="#333" />
            </TouchableOpacity>
            <Text style={styles.header}>Addresses</Text>
            <View style={{ width: 40 }} />
          </View> */}

          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={22} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerText}>Address</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Form */}
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>{form.id ? "Edit Address" : "Add New Address"}</Text>

            {/* PINCODE */}
            <Text style={styles.label}>Pincode</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TextInput
                value={form.pincode}
                onChangeText={(v) =>
                  setForm((prev) => ({ ...prev, pincode: v.replace(/[^0-9]/g, "") }))
                }
                placeholder="Enter pincode"
                maxLength={6}
                keyboardType="number-pad"
                style={[styles.input, { flex: 1 }]}
              />
              {pincodeLoading && <ActivityIndicator size="small" style={{ marginLeft: 8 }} />}
            </View>

            {/* NAME / PHONE */}
            <View style={styles.rowWrap}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  value={form.full_name}
                  placeholder="Enter Name"
                  onChangeText={(v) => setForm({ ...form, full_name: v })}
                  style={styles.input}
                />
              </View>

              <View style={{ width: 10 }} />

              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Phone</Text>
                <TextInput
                  value={form.phone}
                  keyboardType="phone-pad"
                  placeholder="Enter Mobile No"

                  maxLength={10}
                  onChangeText={(v) => setForm({ ...form, phone: v.replace(/[^0-9]/g, "") })}
                  style={styles.input}
                />
              </View>
            </View>

            {/* ADDRESS LINES */}
            <Text style={styles.label}>Address Line 1</Text>
            <TextInput
              value={form.address_line1}
              placeholder="Enter Door No"

              onChangeText={(v) => setForm({ ...form, address_line1: v })}
              style={styles.input}
            />

            <Text style={styles.label}>Address Line 2</Text>
            <TextInput
              value={form.address_line2}
              placeholder="Enter Address"

              onChangeText={(v) => setForm({ ...form, address_line2: v })}
              style={styles.input}
            />

            {/* DISTRICT / VILLAGE */}
            <View style={styles.rowWrap}>
              <View style={{ flex: 1, zIndex: 2000 }}>
                <Text style={styles.label}>District</Text>
                <DropDownPicker
                  open={districtOpen}
                  value={form.district}
                  items={districtItems}
                  setOpen={setDistrictOpen}
                  setValue={(cb) => {
                    const value = typeof cb === "function" ? cb() : cb;
                    setForm((p) => ({ ...p, district: value }));
                  }}
                  placeholder="Select district"
                  style={styles.dropdown}
                  dropDownContainerStyle={styles.dropDownBox}
                />
              </View>

              <View style={{ width: 10 }} />

              <View style={{ flex: 1, zIndex: 1000 }}>
                <Text style={styles.label}>Village</Text>
                <DropDownPicker
                  open={villageOpen}
                  value={form.village}
                  items={villageItems}
                  setOpen={setVillageOpen}
                  setValue={(cb) => {
                    const value = typeof cb === "function" ? cb() : cb;
                    setForm((p) => ({ ...p, village: value }));
                  }}
                  placeholder="Select village"
                  style={styles.dropdown}
                  dropDownContainerStyle={styles.dropDownBox}
                />
              </View>
            </View>

            {/* STATE / LANDMARK */}
            <View style={styles.rowWrap}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>State</Text>
                <TextInput
                  value={form.state}
                  editable={false}
                  style={[styles.input, { backgroundColor: "#f2f2f2" }]}
                />
              </View>

              <View style={{ width: 10 }} />

              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Landmark</Text>
                <TextInput
                  value={form.landmark}
                  placeholder="Near LandMark"

                  onChangeText={(v) => setForm({ ...form, landmark: v })}
                  style={styles.input}
                />
              </View>
            </View>

            {/* Address Type */}
            <Text style={styles.label}>Address Type</Text>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={[styles.chip, form.address_type === "shipping" && styles.chipActive]}
                onPress={() => setForm({ ...form, address_type: "shipping" })}
              >
                <Text style={[styles.chipText, form.address_type === "shipping" && styles.chipTextActive]}>
                  Shipping
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.chip, form.address_type === "billing" && styles.chipActive]}
                onPress={() => setForm({ ...form, address_type: "billing" })}
              >
                <Text style={[styles.chipText, form.address_type === "billing" && styles.chipTextActive]}>
                  Billing
                </Text>
              </TouchableOpacity>
            </View>

            {/* SAME AS OTHER + DEFAULT */}
            <View style={{ flexDirection: "row", marginTop: 12, alignItems: "center" }}>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => setSameAsOther((v) => !v)}
              >
                {sameAsOther && <View style={styles.checkboxTick} />}
              </TouchableOpacity>
              <Text style={{ marginRight: 20 }}>Same as other</Text>

              <TouchableOpacity
                style={styles.radioOuter}
                onPress={() => setForm((p) => ({ ...p, is_default: !p.is_default }))}
              >
                {form.is_default && <View style={styles.radioInner} />}
              </TouchableOpacity>
              <Text style={{ marginLeft: 8 }}>Default</Text>
            </View>

            {/* SAVE BUTTON */}
            <TouchableOpacity style={styles.saveBtn} onPress={handleSubmit}>
              <Text style={styles.saveText}>{form.id ? "Update Address" : "Add Address"}</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Saved Addresses</Text>
        </>
      }
      renderItem={renderAddressCard}
      ListEmptyComponent={
        !loading && (
          <Text style={{ textAlign: "center", marginVertical: 20, color: "#777" }}>
            No addresses found
          </Text>
        )
      }
      ListFooterComponent={loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 80 }}
    />
  );
}

// -------- STYLES --------
const styles = StyleSheet.create({
  container: { flex: 1 },

  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 6, justifyContent: "space-between", paddingVertical: 5 },
  headerText: { fontSize: 20, fontWeight: "bold" },

  backBtn: {
    width: 40,
    height: 40,
    // backgroundColor: "#9b9898ff",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  // header: {
  //   fontSize: 18,
  //   fontWeight: "700",
  //   color: "#222",
  // },
  header: { fontSize: 20, fontWeight: "bold" },


  formCard: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 3,
  },

  formTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
  },

  label: { fontSize: 13, marginBottom: 6, color: "#000000ff", fontWeight: 600 },

  input: {
    borderWidth: 1,
    borderColor: "#dcdcdc",
    borderRadius: 10,
    height: 45,
    paddingHorizontal: 12,
    marginBottom: 10,
    
  },
  

  rowWrap: { flexDirection: "row", marginBottom: 10 },

  dropdown: {
    borderWidth: 1,
    borderColor: "#dcdcdc",
    borderRadius: 10,
    height: 48,
  },

  dropDownBox: {
    borderWidth: 1,
    borderColor: "#dcdcdc",
    borderRadius: 10,
  },

  chip: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 10,
    borderRadius: 20,
  },

  chipActive: {
    backgroundColor: "#2FAF63",
  },

  chipText: { color: "#444", fontWeight: "600" },
  chipTextActive: { color: "#fff" },

  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#777",
    borderRadius: 5,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  checkboxTick: {
    width: 12,
    height: 12,
    backgroundColor: "#2FAF63",
    borderRadius: 3,
  },

  radioOuter: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#777",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  radioInner: {
    width: 10,
    height: 10,
    backgroundColor: "#2FAF63",
    borderRadius: 10,
  },

  saveBtn: {
    backgroundColor: "#2FAF63",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },

  saveText: { color: "#fff", fontWeight: "700" },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
    textAlign:"center"
  },

  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#eee",
    marginBottom: 12,
    elevation: 2,
    margin:5,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  cardTitle: { fontSize: 15, fontWeight: "700" },
  cardSub: { fontSize: 13, color: "#666" },

  typeBadge: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 10,
  },

  defaultBadge: {
    backgroundColor: "#2FAF63",
    color: "#fff",
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 10,
  },

  cardLine: {
    fontSize: 13,
    color: "#444",
    marginBottom: 4,
  },

  cardActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },

  action: { color: "#1976D2", marginLeft: 12, fontWeight: "600" },
  actionPrimary: { color: "#2FAF63", marginLeft: 12, fontWeight: "700" },
});
