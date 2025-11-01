

// import React, { useEffect, useState } from "react";
// import {
//     View,
//     Text,
//     TextInput,
//     ScrollView,
//     StyleSheet,
//     TouchableOpacity,
//     Alert,
// } from "react-native";
// import axios from "axios";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import BASE_URL from "../Config/api";
// import { Picker } from '@react-native-picker/picker';
// import Ionicons from "react-native-vector-icons/Ionicons"; // add at top
// import { useNavigation } from "@react-navigation/native";

// export default function AddressScreen() {
//      const navigation = useNavigation();
//     const [addresses, setAddresses] = useState([]);
//     const [loading, setLoading] = useState(false);

//     const [form, setForm] = useState({
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
//     });
//     const [customerId, setCustomerId] = useState(null);

//     const getCustomerId = async () => {
//         try {
//             const userString = await AsyncStorage.getItem("user");
//             if (userString) {
//                 const user = JSON.parse(userString);
//                 if (user.customer_id) setCustomerId(user.customer_id);
//             }
//         } catch (err) {
//             console.log("Error getting user object:", err.message);
//         }
//     };

//     useEffect(() => { getCustomerId(); }, []);
//     useEffect(() => { if (customerId) fetchAddresses(); }, [customerId]);

//     const fetchAddresses = async () => {
//         try {
//             setLoading(true);
//             const res = await axios.get(
//                 `${BASE_URL}/api/addresses/getByCustomer/${customerId}`
//             );
//             const addressesData = res.data.data || [];

//             const hasDefault = addressesData.some(addr => addr.is_default === 1);
//             if (!hasDefault && addressesData.length > 0) {
//                 addressesData[0].is_default = 1;
//             }

//             setAddresses(addressesData);
//         } catch (err) {
//             console.log("Fetch error:", err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Add or Update address
//     const handleSubmit = async () => {
//         if (!form.full_name || !form.phone || !form.address_line1) {
//             Alert.alert("Validation", "Please fill all required fields.");
//             return;
//         }

//         try {
//             if (form.id) {
//                 await axios.put(`${BASE_URL}/api/addresses/updateAddress/${form.id}`, form);
//                 Alert.alert("Success", "Address updated successfully!");
//             } else {
//                 await axios.post(`${BASE_URL}/api/addresses/addAddress`, {
//                     ...form,
//                     customer_id: customerId,
//                 });
//                 Alert.alert("Success", "Address added successfully!");
//             }

//             setForm({
//                 id: null,
//                 full_name: "",
//                 phone: "",
//                 address_line1: "",
//                 address_line2: "",
//                 village: "",
//                 district: "",
//                 state: "",
//                 pincode: "",
//                 landmark: "",
//                 address_type: "shipping",
//                 is_default: false,
//             });

//             fetchAddresses();
//         } catch (err) {
//             console.log("Submit error:", err.response?.data || err.message);
//             Alert.alert(
//                 "Error",
//                 err.response?.data?.message || "Failed to submit address"
//             );
//         }
//     };

//     // Delete
//     const handleDelete = async (id) => {
//         Alert.alert("Delete Address", "Are you sure?", [
//             { text: "Cancel" },
//             {
//                 text: "Yes",
//                 onPress: async () => {
//                     try {
//                         await axios.delete(`${BASE_URL}/api/addresses/deleteAddress/${id}`);
//                         fetchAddresses();
//                     } catch (err) {
//                         console.log(err.message);
//                     }
//                 },
//             },
//         ]);
//     };

//     // // Set default address
//     // const setDefaultAddress = async (addressId) => {
//     //     const updatedAddresses = addresses.map((addr) => ({
//     //         ...addr,
//     //         is_default: addr.id === addressId ? 1 : addr.is_default && addr.address_type === addresses.find(a => a.id === addressId).address_type ? 0 : addr.is_default,
//     //     }));
//     //     setAddresses(updatedAddresses);

//     //     try {
//     //         await axios.patch(`${BASE_URL}/api/addresses/setDefault/${addressId}`);
//     //         fetchAddresses();
//     //     } catch (err) {
//     //         console.log("Set default error:", err.response?.data || err.message);
//     //         fetchAddresses();
//     //     }
//     // };

//     const setDefaultAddress = async (addressId) => {
//         const target = addresses.find(a => a.id === addressId);
//         if (!target) return;

//         const updatedAddresses = addresses.map(addr => ({
//             ...addr,
//             // Only unset default for same type, keep others intact
//             is_default: addr.address_type === target.address_type
//                 ? (addr.id === addressId ? 1 : 0)
//                 : addr.is_default,
//         }));

//         setAddresses(updatedAddresses);

//         try {
//             await axios.patch(`${BASE_URL}/api/addresses/setDefault/${addressId}`);
//             fetchAddresses();
//         } catch (err) {
//             console.log("Set default error:", err.response?.data || err.message);
//             fetchAddresses();
//         }
//     };


//     // Edit
//     const handleEdit = (addr) => {
//         setForm({
//             ...addr,
//             is_default: addr.is_default === 1,
//         });
//     };

//     return (
//         <ScrollView style={styles.container}>
//             <View style={styles.headerRow}>
//                 <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
//                     <Ionicons name="arrow-back" size={24} color="#333" />
//                 </TouchableOpacity>
//                 <Text style={styles.header}>Manage Addresses</Text>
//                 <View style={{ width: 45 }} />
//             </View>



//             {/* Address Form */}
//             <View style={styles.form}>
//                 <Text style={styles.sectionTitle}>
//                     {form.id ? "Edit Address" : "Add New Address"}
//                 </Text>

//                 {["full_name", "phone", "address_line1", "address_line2", "village", "district", "state", "pincode", "landmark"].map((field) => (
//                     <TextInput
//                         key={field}
//                         placeholder={field.replace("_", " ").toUpperCase()}
//                         style={styles.input}
//                         keyboardType={field === "phone" || field === "pincode" ? "number-pad" : "default"}
//                         value={form[field]}
//                         onChangeText={(v) => setForm({ ...form, [field]: v })}
//                     />
//                 ))}

//                 {/* Address Type Picker */}
//                 <View style={styles.row}>
//                     <Text style={{ marginRight: 10 }}>Address Type:</Text>
//                     <Picker
//                         selectedValue={form.address_type}
//                         style={{ flex: 1, height: 65 }}
//                         onValueChange={(itemValue) =>
//                             setForm({ ...form, address_type: itemValue })
//                         }
//                     >
//                         <Picker.Item label="Shipping" value="shipping" />
//                         <Picker.Item label="Billing" value="billing" />
//                     </Picker>
//                 </View>

//                 {/* Set Default */}
//                 <View style={styles.row}>
//                     <Text style={{ marginRight: 10 }}>Set as Default:</Text>
//                     <TouchableOpacity
//                         style={styles.radioOuter}
//                         onPress={() => setForm({ ...form, is_default: !form.is_default })}
//                     >
//                         {form.is_default && <View style={styles.radioInner} />}
//                     </TouchableOpacity>
//                 </View>

//                 <TouchableOpacity onPress={handleSubmit} style={styles.addBtn}>
//                     <Text style={{ color: "white", fontWeight: "bold" }}>
//                         {form.id ? "Update Address" : "Add Address"}
//                     </Text>
//                 </TouchableOpacity>
//             </View>

//             {/* Address List */}
//             <Text style={styles.sectionTitle}>Saved Addresses</Text>
//             {loading ? (
//                 <Text style={{ textAlign: "center" }}>Loading...</Text>
//             ) : addresses.length === 0 ? (
//                 <Text style={{ textAlign: "center" }}>No addresses found</Text>
//             ) : (
//                 addresses.map((addr) => (
//                     <View key={addr.id} style={styles.card}>
//                         <View style={styles.addressHeader}>
//                             <Text style={styles.addressType}>{addr.address_type.toUpperCase()}</Text>
//                             {addr.is_default === 1 && <Text style={styles.defaultBadge}>DEFAULT</Text>}
//                         </View>

//                         <Text style={styles.addressText}>{addr.full_name} | {addr.phone}</Text>
//                         <Text style={styles.addressText}>{addr.address_line1} {addr.address_line2}</Text>
//                         <Text style={styles.addressText}>{addr.village}, {addr.district}</Text>
//                         <Text style={styles.addressText}>{addr.state} - {addr.pincode}</Text>
//                         {addr.landmark && <Text style={styles.addressText}>Landmark: {addr.landmark}</Text>}

//                         <View style={styles.actions}>
//                             {addr.is_default !== 1 && (
//                                 <TouchableOpacity onPress={() => setDefaultAddress(addr.id)}>
//                                     <Text style={styles.setDefault}>Set Default</Text>
//                                 </TouchableOpacity>
//                             )}
//                             <TouchableOpacity onPress={() => handleEdit(addr)}>
//                                 <Text style={styles.edit}>Edit</Text>
//                             </TouchableOpacity>
//                             <TouchableOpacity onPress={() => handleDelete(addr.id)}>
//                                 <Text style={styles.delete}>Delete</Text>
//                             </TouchableOpacity>
//                         </View>
//                     </View>
//                 ))
//             )}
//         </ScrollView>
//     );
// }

// const styles = StyleSheet.create({
//     container: { flex: 1, padding: 15, backgroundColor: "#fff" },
//     headerRow: {
//         flexDirection: "row",
//         alignItems: "center",
//         marginBottom: 5,
//         justifyContent: "space-between",
//         paddingVertical: 2,
//     },
//     header: {
//         fontSize: 20,
//         fontWeight: "bold",
//         textAlign: "center",
//         flex: 1,
//     },
//     // header: { fontSize: 22, fontWeight: "bold", marginBottom: 15, textAlign: "center" },
//     form: { marginBottom: 25, padding: 15, backgroundColor: "#f9f9f9", borderRadius: 10 },
//     sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 10 },
//     input: { borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 8, marginVertical: 5 },
//     addBtn: { marginTop: 10, backgroundColor: "#548c5c", padding: 12, alignItems: "center", borderRadius: 8 },
//     card: { padding: 15, borderWidth: 1, borderColor: "#ddd", borderRadius: 10, marginBottom: 10 },
//     addressHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
//     addressType: { fontWeight: "bold", color: "#444" },
//     defaultBadge: { backgroundColor: "#4CAF50", color: "#fff", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 5, fontSize: 12 },
//     addressText: { marginVertical: 2, color: "#555" },
//     row: { flexDirection: "row", alignItems: "center", marginVertical: 5 },
//     radioOuter: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: "#555", justifyContent: "center", alignItems: "center" },
//     radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#548c5c" },
//     actions: { flexDirection: "row", justifyContent: "flex-end", marginTop: 10 },
//     setDefault: { color: "#1976D2", marginRight: 15 },
//     edit: { color: "#FFA500", marginRight: 15 },
//     delete: { color: "red" },
// });





import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BASE_URL from "../Config/api";
import { Picker } from "@react-native-picker/picker";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { showToast } from "../Components/CustomToast";

export default function AddressScreen() {
  const navigation = useNavigation();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sameAsOther, setSameAsOther] = useState(false);

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
  const [customerId, setCustomerId] = useState(null);

  const getCustomerId = async () => {
    try {
      const userString = await AsyncStorage.getItem("user");
      if (userString) {
        const user = JSON.parse(userString);
        if (user.customer_id) setCustomerId(user.customer_id);
      }
    } catch (err) {
      console.log("Error getting user object:", err.message);
    }
  };

  useEffect(() => {
    getCustomerId();
  }, []);

  useEffect(() => {
    if (customerId) fetchAddresses();
  }, [customerId]);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${BASE_URL}/api/addresses/getByCustomer/${customerId}`
      );
      const addressesData = res.data.data || [];

      const hasDefault = addressesData.some((addr) => addr.is_default === 1);
      if (!hasDefault && addressesData.length > 0) {
        addressesData[0].is_default = 1;
      }

      setAddresses(addressesData);
    } catch (err) {
      console.log("Fetch error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Add or Update address
  const handleSubmit = async () => {
    if (!form.full_name || !form.phone || !form.address_line1) {
      Alert.alert("Validation", "Please fill all required fields.");
      showToast("warning", "Warmomg!", "Please fill all required fields!");
      return;
    }

    try {
      if (form.id) {
        await axios.put(`${BASE_URL}/api/addresses/updateAddress/${form.id}`, form);
        Alert.alert("Success", "Address updated successfully!");
      } else {
        await axios.post(`${BASE_URL}/api/addresses/addAddress`, {
          ...form,
          customer_id: customerId,
        });

        // ✅ If checkbox is checked, automatically add the other address type
        if (sameAsOther) {
          const otherType =
            form.address_type === "shipping" ? "billing" : "shipping";

          await axios.post(`${BASE_URL}/api/addresses/addAddress`, {
            ...form,
            customer_id: customerId,
            address_type: otherType,
          });
        }

        Alert.alert("Success", "Address added successfully!");
        showToast("success", "Success", "Address added successfully!!");
      }

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
      setSameAsOther(false);
      fetchAddresses();
    } catch (err) {
      console.log("Submit error:", err.response?.data || err.message);
      Alert.alert(
        "Error",
        err.response?.data?.message || "Failed to submit address"
      );
      showToast("error", "Error", "Failed to submit address!");
    }
  };

  // const handleDelete = async (id) => {
  //   Alert.alert("Delete Address", "Are you sure?", [
  //     { text: "Cancel" },
  //     {
  //       text: "Yes",
  //       onPress: async () => {
  //         try {
  //           await axios.delete(`${BASE_URL}/api/addresses/deleteAddress/${id}`);
  //           fetchAddresses();
  //         } catch (err) {
  //           console.log(err.message);
  //         }
  //       },
  //     },
  //   ]);
  // };

  const handleDelete = async (id) => {
    Alert.alert("Delete Address", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "Yes",
        onPress: async () => {
          try {
            await axios.delete(`${BASE_URL}/api/addresses/deleteAddress/${id}`);

            // ✅ Instantly update local state
            setAddresses((prev) => {
              const updated = prev.filter((item) => item.id !== id);
              return updated;
            });
            // showToast("warning", "Delete", "Deleted Your Address!");
            // ✅ Optional: if backend changes need confirmation, re-fetch
            // await fetchAddresses();

          } catch (err) {
            console.log(err.message);
            showToast("error", "Error", "Check it Once!");
          }
        },
      },
    ]);
  };


  const setDefaultAddress = async (addressId) => {
    const target = addresses.find((a) => a.id === addressId);
    if (!target) return;

    const updatedAddresses = addresses.map((addr) => ({
      ...addr,
      is_default:
        addr.address_type === target.address_type
          ? addr.id === addressId
            ? 1
            : 0
          : addr.is_default,
    }));

    setAddresses(updatedAddresses);

    try {
      await axios.patch(`${BASE_URL}/api/addresses/setDefault/${addressId}`);
      fetchAddresses();
      showToast("success", "Success ✅", "Your Selected one is Default!");
    } catch (err) {
      console.log("Set default error:", err.response?.data || err.message);
      showToast("error", "Error", "Selected one is Not Default!");
      fetchAddresses();
    }
  };

  const handleEdit = (addr) => {
    setForm({
      ...addr,
      is_default: addr.is_default === 1,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.header}>Manage Addresses</Text>
        <View style={{ width: 45 }} />
      </View>

      {/* Address Form */}
      <View style={styles.form}>
        <Text style={styles.sectionTitle}>
          {form.id ? "Edit Address" : "Add New Address"}
        </Text>

        {/* Two-column fields */}
        <View style={styles.rowWrap}>
          <TextInput
            placeholder="FULL NAME"
            placeholderTextColor="#000" // ✅ Black placeholder
            style={[styles.input, styles.halfInput]}
            value={form.full_name}
            onChangeText={(v) => setForm({ ...form, full_name: v })}
          />
          <TextInput
            placeholder="PHONE"
            placeholderTextColor="#000" // ✅ Black placeholder
            keyboardType="number-pad"
            style={[styles.input, styles.halfInput]}
            value={form.phone}
            onChangeText={(v) => setForm({ ...form, phone: v })}
          />
        </View>

        <TextInput
          placeholder="ADDRESS LINE 1"
          placeholderTextColor="#000" // ✅ Black placeholder
          style={styles.input}
          value={form.address_line1}
          onChangeText={(v) => setForm({ ...form, address_line1: v })}
        />
        <TextInput
          placeholder="ADDRESS LINE 2"
          placeholderTextColor="#000" // ✅ Black placeholder
          style={styles.input}
          value={form.address_line2}
          onChangeText={(v) => setForm({ ...form, address_line2: v })}
        />

        <View style={styles.rowWrap}>
          <TextInput
            placeholder="VILLAGE"
            placeholderTextColor="#000" // ✅ Black placeholder
            style={[styles.input, styles.halfInput]}
            value={form.village}
            onChangeText={(v) => setForm({ ...form, village: v })}
          />
          <TextInput
            placeholder="DISTRICT"
            placeholderTextColor="#000" // ✅ Black placeholder
            style={[styles.input, styles.halfInput]}
            value={form.district}
            onChangeText={(v) => setForm({ ...form, district: v })}
          />
        </View>

        <View style={styles.rowWrap}>
          <TextInput
            placeholder="STATE"
            placeholderTextColor="#000" // ✅ Black placeholder
            style={[styles.input, styles.halfInput]}
            value={form.state}
            onChangeText={(v) => setForm({ ...form, state: v })}
          />
          <TextInput
            placeholder="PINCODE"
            placeholderTextColor="#000" // ✅ Black placeholder
            keyboardType="number-pad"
            style={[styles.input, styles.halfInput]}
            value={form.pincode}
            onChangeText={(v) => setForm({ ...form, pincode: v })}
          />
        </View>

        <TextInput
          placeholder="LANDMARK"
          placeholderTextColor="#000" // ✅ Black placeholder
          style={styles.input}
          value={form.landmark}
          onChangeText={(v) => setForm({ ...form, landmark: v })}
        />

        {/* Address Type Picker */}
        <View style={styles.row}>
          <Text style={{ marginRight: 10, color: "#000" }}>Address Type:</Text>
          <View style={{ flex: 1, backgroundColor: "#fff", borderRadius: 8, borderWidth: 1, borderColor: "#050505ff", padding: 1.5 }}>
            <Picker
              selectedValue={form.address_type}
              style={{
                color: "#000", // ✅ black text
                backgroundColor: "#fff", // ✅ white background
                height: 55,
              }}
              dropdownIconColor="#000" // ✅ makes the dropdown arrow black (Android)
              onValueChange={(itemValue) =>
                setForm({ ...form, address_type: itemValue })
              }
              itemStyle={{ color: "#000" }} // ✅ for iOS
            >
              <Picker.Item label="Shipping" value="shipping" />
              <Picker.Item label="Billing" value="billing" />
            </Picker>
          </View>
        </View>


        {/* ✅ Checkbox: Same as other address */}
        <View style={styles.checkboxRow}>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => setSameAsOther(!sameAsOther)}
          >
            {sameAsOther && <View style={styles.checkboxTick} />}
          </TouchableOpacity>
          <Text style={styles.checkboxLabel}>
            Same as{" "}
            {form.address_type === "shipping" ? "Billing" : "Shipping"} Address
          </Text>
        </View>

        {/* Set Default */}
        <View style={styles.row}>
          <Text style={{ marginRight: 10 }}>Set as Default:</Text>
          <TouchableOpacity
            style={styles.radioOuter}
            onPress={() => setForm({ ...form, is_default: !form.is_default })}
          >
            {form.is_default && <View style={styles.radioInner} />}
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleSubmit} style={styles.addBtn}>
          <Text style={{ color: "white", fontWeight: "bold" }}>
            {form.id ? "Update Address" : "Add Address"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Saved Addresses */}
      <Text style={styles.sectionTitle}>Saved Addresses</Text>
      {loading ? (
        <Text style={{ textAlign: "center" }}>Loading...</Text>
      ) : addresses.length === 0 ? (
        <Text style={{ textAlign: "center" }}>No addresses found</Text>
      ) : (
        addresses.map((addr) => (
          <View key={addr.id} style={styles.card}>
            <View style={styles.addressHeader}>
              <Text style={styles.addressType}>
                {addr.address_type.toUpperCase()}
              </Text>
              {addr.is_default === 1 && (
                <Text style={styles.defaultBadge}>DEFAULT</Text>
              )}
            </View>

            <Text style={styles.addressText}>
              {addr.full_name} | {addr.phone}
            </Text>
            <Text style={styles.addressText}>
              {addr.address_line1} {addr.address_line2}
            </Text>
            <Text style={styles.addressText}>
              {addr.village}, {addr.district}
            </Text>
            <Text style={styles.addressText}>
              {addr.state} - {addr.pincode}
            </Text>
            {addr.landmark && (
              <Text style={styles.addressText}>Landmark: {addr.landmark}</Text>
            )}


            <View style={styles.actions}>
              {addr.is_default !== 1 && (
                <TouchableOpacity onPress={() => setDefaultAddress(addr.id)} style={styles.actionButton}>
                  <Text style={styles.setDefault}>Set Default</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={() => handleEdit(addr)} style={styles.actionButton}>
                <Text style={styles.edit}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(addr.id)} style={styles.actionButton}>
                <Text style={styles.delete}>Delete</Text>
              </TouchableOpacity>
            </View>

          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#fff" },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  header: { fontSize: 20, fontWeight: "bold", textAlign: "center", flex: 1 },
  form: {
    marginBottom: 25,
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
  },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#050505ff",
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
  },
  rowWrap: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInput: {
    flex: 1,
    marginHorizontal: 5,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: "#548c5c",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  checkboxTick: {
    width: 12,
    height: 12,
    backgroundColor: "#548c5c",
  },
  checkboxLabel: { fontSize: 15, color: "#333" },
  addBtn: {
    marginTop: 10,
    backgroundColor: "#548c5c",
    padding: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  card: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 10,
  },
  addressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addressType: { fontWeight: "bold", color: "#444" },
  defaultBadge: {
    backgroundColor: "#4CAF50",
    color: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    fontSize: 12,
  },
  addressText: { marginVertical: 2, color: "#555" },
  row: { flexDirection: "row", alignItems: "center", marginVertical: 5 },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#555",
    justifyContent: "center",
    alignItems: "center",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#548c5c",
  },
  // actions: { flexDirection: "row", justifyContent: "flex-end", marginTop: 10 },
  // setDefault: { color: "#1976D2", marginRight: 15 },
  // edit: { color: "#FFA500", marginRight: 15 ,width:40},
  // delete: { color: "red" ,width:40},
  actions: {
    flexDirection: 'row',
    alignItems: 'right',
    justifyContent: "flex-end", // even spacing
    marginTop: 10,
  },
  actionButton: {
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  setDefault: {
    color: '#1976D2',
    fontWeight: '600',
  },
  edit: {
    color: '#FFA500',
    fontWeight: '600',
  },
  delete: {
    color: '#dc3545',
    fontWeight: '600',
  },
});
