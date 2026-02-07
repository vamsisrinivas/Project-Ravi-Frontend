import React, { useState, useContext, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

import BASE_URL from "../Config/api";
import { AuthContext } from "../Context/AuthContext";
import { showToast } from "../Components/CustomToast";


/* 🌱 Static seedling data
   Later you can fetch this from API */
const SEEDLING_DATA = [
    {
        name: "Chilli",
        price: 0.8,
        varieties: ["Teja", "Byadgi", "Wonder Hot"],
    },
    {
        name: "Tomato",
        price: 1.2,
        varieties: ["Arka Rakshak", "Pusa Ruby"],
    },
    {
        name: "Brinjal",
        price: 1.0,
        varieties: ["Bhagyamati", "Pusa Purple"],
    },
];

export default function SeedlingForm() {
    const navigation = useNavigation();
const { user, token } = useContext(AuthContext);

    // 🔐 Auto-filled from login
    const farmerName = user?.full_name || "";
    const phone = user?.phone_no || "";
    const village = user?.village || "";
    // const city = user?.city || "";

    const [seedling, setSeedling] = useState(null);
    const [variety, setVariety] = useState(null);
    const [quantity, setQuantity] = useState("");
    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState(null);


    const selectedSeedling = SEEDLING_DATA.find(
        (s) => s.name === seedling
    );



    const fetchDefaultAddress = async (id) => {
        try {
            const res = await axios.get(
                `${BASE_URL}/api/addresses/customer/${id}/defaults`
            );

            if (res.data.success) {
                setAddress(res.data.data?.shipping || null);
            }
        } catch (err) {
            setAddress(null);
        }
    };

    useEffect(() => {
        if (user?.customer_id) {
            fetchDefaultAddress(user.customer_id);
        }
    }, [user]);

    const estimatedPrice =
        selectedSeedling && quantity
            ? Number(quantity) * selectedSeedling.price
            : 0;

    // 🔥 Submit handler
    // const handleSubmit = async () => {
    //     if (!seedling || !variety || !quantity) {
    //         showToast({
    //             type: "error",
    //             text1: "Missing Fields",
    //             text2: "Please fill all required details",
    //         });
    //         return;
    //     }

    //     if (!farmerName || !phone) {
    //         showToast({
    //             type: "error",
    //             text1: "Profile Incomplete",
    //             text2: "Please update your profile first",
    //         });
    //         return;
    //     }

    //     const payload = {
    //         farmer_name: farmerName,
    //         phone,
    //         village,
    //         city,

    //         address_id: address?.id,
    //         address_line1: address?.address_line1,
    //         address_line2: address?.address_line2,
    //         village: address?.village,
    //         district: address?.district,
    //         state: address?.state,
    //         pincode: address?.pincode,

    //         seedling_name: seedling,
    //         variety,
    //         quantity: Number(quantity),
    //         unit: "number",

    //         estimated_price: estimatedPrice,
    //         final_price: null,
    //         price_unit: null,
    //         status: "pending",
    //         remarks: null,
    //         approved_at: null,
    //     };

    //     try {
    //         setLoading(true);

    //         await axios.post(`${BASE_URL}/api/seedlings`, payload);

    //         Toast.show({
    //             type: "success",
    //             text1: "Submitted🌱",
    //             text2: "Our team will contact you soon",
    //         });

    //         // reset
    //         setSeedling(null);
    //         setVariety(null);
    //         setQuantity("");

    //         navigation.goBack();
    //     } catch (error) {
    //         Toast.show({
    //             type: "error",
    //             text1: "Submission Failed",
    //             text2:
    //                 error.response?.data?.message ||
    //                 "Please try again later",
    //         });
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const handleSubmit = async () => {
  if (!seedling || !variety || !quantity) {
    showToast("error", "Missing Fields", "Please fill all required details");
    return;
  }

  if (!address?.id) {
    showToast("warning", "No Address", "Please add a default address");
    return;
  }

  const payload = {
    farmer_name: farmerName,
    phone,

    address_id: address.id,
    address_line1: address.address_line1,
    address_line2: address.address_line2,
    village: address.village,
    district: address.district,
    state: address.state,
    pincode: address.pincode,

    seedling_name: seedling,
    variety,
    quantity: Number(quantity),
    unit: "number",

    estimated_price: estimatedPrice,
  };

  try {
    setLoading(true);
console.log("JWT TOKEN 👉", token);

    await axios.post(
      `${BASE_URL}/api/seedlings`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ REQUIRED
        },
      }
    );

    showToast(
      "success",
      "Submitted 🌱",
      "Our team will contact you soon"
    );

    setSeedling(null);
    setVariety(null);
    setQuantity("");
    navigation.goBack();

  } catch (error) {
    showToast(
      "error",
      "Submission Failed",
      error.response?.data?.message || "Please try again later"
    );
  } finally {
    setLoading(false);
  }
};


    return (
        <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
            <Text style={styles.title}>🌱 Seedlings(NARU)</Text>

            {/* 🔐 Auto-filled user info */}
            <Text style={styles.label}>Farmer Name</Text>
            <TextInput style={styles.readonly} value={farmerName} editable={false} />

            {/* <Text style={styles.label}>Phone</Text>
            <TextInput style={styles.readonly} value={phone} editable={false} /> */}

            <Text style={styles.label}>Village</Text>
            <TextInput style={styles.readonly} value={village} editable={false} />

            {/* <Text style={styles.label}>City</Text>
            <TextInput style={styles.readonly} value={city} editable={false} /> */}

                   {/* 📦 Default Address */}
            <Text style={styles.sectionTitle}>Default Address</Text>

            {address ? (
                <View style={styles.addressCard}>
                    <Text style={styles.addressText}>
                        {address.address_line1}
                        {address.address_line2 ? `, ${address.address_line2}` : ""}
                    </Text>

                    <Text style={styles.addressText}>
                        {address.village}, {address.district}
                    </Text>

                    <Text style={styles.addressText}>
                        {address.state} - {address.pincode}
                    </Text>

                    <Text style={styles.addressPhone}>
                        📞 {address.phone}
                    </Text>
                </View>
            ) : (
                <Text style={styles.noAddress}>
                    No default address found. Please add one.
                </Text>
            )}

            {/* Seedling Dropdown */}
            <Text style={styles.label}>Seedling Type</Text>
            <Dropdown
                style={styles.dropdown}
                data={SEEDLING_DATA.map((s) => ({
                    label: s.name,
                    value: s.name,
                }))}
                labelField="label"
                valueField="value"
                placeholder="Select Seedling"
                value={seedling}
                onChange={(item) => {
                    setSeedling(item.value);
                    setVariety(null);
                }}
            />

            {/* Variety Dropdown */}
            {seedling && (
                <>
                    <Text style={styles.label}>Variety</Text>
                    <Dropdown
                        style={styles.dropdown}
                        data={selectedSeedling.varieties.map((v) => ({
                            label: v,
                            value: v,
                        }))}
                        labelField="label"
                        valueField="value"
                        placeholder="Select Variety"
                        value={variety}
                        onChange={(item) => setVariety(item.value)}
                    />
                </>
            )}




            {/* Quantity */}
            <Text style={styles.label}>Quantity (No. of seedlings)</Text>
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="Enter quantity"
                value={quantity}
                onChangeText={setQuantity}
            />
     

            {/* Estimated Price */}
            {estimatedPrice > 0 && (
                <View style={styles.priceCard}>
                    <Text style={styles.priceText}>
                        Estimated Price: ₹{estimatedPrice.toFixed(2)}
                    </Text>
                    <Text style={styles.note}>
                        * Final price will be confirmed after verification
                       
                        * If the Approved Check inside the Profile(Seedling(Naru))
                    </Text>
                </View>
            )}

            {/* Submit Button */}
            <TouchableOpacity
                style={[styles.submitBtn, loading && { opacity: 0.7 }]}
                onPress={handleSubmit}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.submitText}>Submit Seedlings</Text>
                )}
            </TouchableOpacity>
        </ScrollView>
    );
}

/* 🎨 Styles */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#F6F7FB",
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 16,
        color: "#2E7D32",
        textAlign: "center"
    },
    label: {
        fontSize: 14,
        marginBottom: 6,
        color: "#555",
    },
    readonly: {
        height: 50,
        backgroundColor: "#ECEFF1",
        borderRadius: 12,
        paddingHorizontal: 12,
        marginBottom: 16,
        color: "#333",
    },
    dropdown: {
        height: 50,
        backgroundColor: "#fff",
        borderRadius: 12,
        paddingHorizontal: 12,
        marginBottom: 16,
        elevation: 2,
    },
    input: {
        height: 50,
        backgroundColor: "#fff",
        borderRadius: 12,
        paddingHorizontal: 12,
        marginBottom: 16,
        elevation: 2,
    },
    priceCard: {
        backgroundColor: "#E8F5E9",
        padding: 14,
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: "#4CAF50",
        marginBottom: 20,
    },
    priceText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#2E7D32",
    },
    note: {
        fontSize: 12,
        color: "#555",
        marginTop: 4,
    },
    submitBtn: {
        backgroundColor: "#2E7D32",
        paddingVertical: 17,
        borderRadius: 14,
        alignItems: "center",
        elevation: 5,
        marginBottom: 35,
    },
    submitText: {
        color: "#fff",
        fontSize: 17,
        fontWeight: "bold",
    },

    //address
    sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginVertical: 10,
        color: "#333",
    },
    addressCard: {
        backgroundColor: "#FFFFFF",
        padding: 14,
        borderRadius: 12,
        elevation: 2,
        marginBottom: 16,
    },
    addressText: {
        fontSize: 14,
        color: "#444",
        marginBottom: 2,
    },
    addressPhone: {
        fontSize: 14,
        fontWeight: "600",
        marginTop: 6,
        color: "#2E7D32",
    },
    noAddress: {
        fontSize: 13,
        color: "#D32F2F",
        marginBottom: 16,
    },

});
