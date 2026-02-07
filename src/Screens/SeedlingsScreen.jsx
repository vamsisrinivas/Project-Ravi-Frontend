import React, { useEffect, useState, useContext, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    RefreshControl,
    TouchableOpacity,
    SafeAreaView
} from "react-native";
import axios from "axios";

import BASE_URL from "../Config/api";
import { AuthContext } from "../Context/AuthContext";
// import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
// import { showToast } from "../Components/CustomToast";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function ApprovedSeedlingsScreen() {
    const { user, token } = useContext(AuthContext);
    const navigation = useNavigation(); // ✅ ADD THIS
    const [seedlings, setSeedlings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // 🔹 Fetch approved seedlings
    const fetchApprovedSeedlings = async () => {
        try {
            const res = await axios.get(
                `${BASE_URL}/api/seedlings/approved`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (res.data.success) {
                setSeedlings(res.data.data || []);
            } else {
                setSeedlings([]);
            }
        } catch (error) {
            showToast(
                "error",
                "Unable to fetch",
                error.response?.data?.message || "Please try again"
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchApprovedSeedlings();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchApprovedSeedlings();
    }, []);

    // 🔹 Render single card
    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.headerRow}>
                <Text style={styles.crop}>
                    🌱 {item.seedling_name} ({item.variety})
                </Text>
                <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>APPROVED</Text>
                </View>
            </View>

            <Text style={styles.row}>
                Quantity: <Text style={styles.bold}>{item.quantity}</Text>
            </Text>

            <Text style={styles.row}>
                Price:{" "}
                <Text style={styles.price}>
                    ₹{item.final_price} ({item.price_unit})
                </Text>
            </Text>

            <View style={styles.divider} />

            <Text style={styles.address}>
                📍 {item.address_line1}
                {item.address_line2 ? `, ${item.address_line2}` : ""}
            </Text>
            <Text style={styles.address}>
                {item.village}, {item.district}
            </Text>
            <Text style={styles.address}>
                {item.state} - {item.pincode}
            </Text>

            <Text style={styles.date}>
                Approved on: {new Date(item.approved_at).toLocaleDateString()}
            </Text>
        </View>
    );

    // 🔹 Loading state
    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#2E7D32" />
                <Text style={styles.loadingText}>Loading approved seedlings...</Text>
            </View>
        );
    }

    // 🔹 Empty state


// 🔹 Empty state (ONLY AFTER loading is false)
if (seedlings.length === 0) {
  return (
    <SafeAreaView
     
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerIconLeft}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Approved Seedlings</Text>

        <TouchableOpacity
          style={styles.headerIconRight}
          onPress={fetchApprovedSeedlings}
        >
          <Ionicons name="refresh" size={22} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Empty Content */}
      <View style={styles.center}>
        <Text style={styles.emptyTitle}>🌱 No Approved Seedlings</Text>
        <Text style={styles.emptyText}>
          Once admin approves your seedlings, they will appear here.
        </Text>
      </View>
    </SafeAreaView>
  );
}


    return (
       


        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                {/* Back */}
                <TouchableOpacity
                    style={styles.headerIconLeft}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>

                {/* Title */}
                <Text style={styles.headerTitle}>Approved Seedlings</Text>

                {/* Refresh */}
                <TouchableOpacity
                    style={styles.headerIconRight}
                    onPress={fetchApprovedSeedlings}
                >
                    <Ionicons name="refresh" size={22} color="#000" />
                </TouchableOpacity>
            </View>


            {/* List */}
            <FlatList
                data={seedlings}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={{ padding: 16 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={["#2E7D32"]}
                    />
                }
            />
        </SafeAreaView>



    );
}

/* 🎨 Styles */
const styles = StyleSheet.create({

    container: { flex: 1, backgroundColor: "#f5f5f5" },
    loader: { flex: 1, justifyContent: "center", alignItems: "center" },

    header: {
        height: 56,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },

    headerTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#000",
    },

    headerIconLeft: {
        position: "absolute",
        left: 16,
        height: "100%",
        justifyContent: "center",
    },

    headerIconRight: {
        position: "absolute",
        right: 16,
        height: "100%",
        justifyContent: "center",
    },

    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#F6F7FB",
    },
    loadingText: {
        marginTop: 10,
        color: "#555",
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#2E7D32",
        marginBottom: 6,
    },
    emptyText: {
        fontSize: 14,
        color: "#666",
        textAlign: "center",
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 14,
        padding: 14,
        marginBottom: 14,
        elevation: 3,
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 6,
    },
    crop: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#2E7D32",
    },
    statusBadge: {
        backgroundColor: "#E8F5E9",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 10,
    },
    statusText: {
        color: "#2E7D32",
        fontSize: 12,
        fontWeight: "bold",
    },
    row: {
        fontSize: 14,
        color: "#444",
        marginTop: 4,
    },
    bold: {
        fontWeight: "600",
    },
    price: {
        fontWeight: "bold",
        color: "#1B5E20",
    },
    divider: {
        height: 1,
        backgroundColor: "#EEE",
        marginVertical: 8,
    },
    address: {
        fontSize: 13,
        color: "#0e0d0dff",
        marginTop: 3
    },
    date: {
        fontSize: 12,
        color: "#070606ff",
        marginTop: 12,
        marginBottom: 10,
        textAlign: "right",
    },
});
