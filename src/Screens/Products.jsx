


import React from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet ,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'react-native-linear-gradient'; // or expo-linear-gradient



const categories = [
  { label: 'HYBRID', icon: require('../assets/hydrid.png') },
  { label: 'HIGH YIELD CROP', icon: require('../assets/hydrid.png') },
  { label: 'WATER - EFFICIENT', icon: require('../assets/hydrid.png') },
  { label: 'INTERCROP', icon: require('../assets/hydrid.png') },
];

const seeds = [
  'TOMATO', 'BRINJAL', 'COCCINIA', 'WATERMELON', 'CAPSICUM',
  'CAULIFLOWER', 'MIRCHI', 'LADY FINGER', 'VEG SEEDS', 'BITTER GOURD',
];

const Product = () => {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* <View style={{ backgroundColor: '#0d220fff', padding: 30, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#27af25ff' }}>RAVI SEEDS</Text>
          <View style={{ flexDirection: 'row', gap: 16 }}>
            <Ionicons name="cart" size={22} color="#2f5e2e" />
            <Ionicons name="person-circle-outline" size={22} color="#2f5e2e" />
            <Ionicons name="notifications-outline" size={22} color="#2f5e2e" />
          </View>
        </View>

        <View style={{ marginTop: 16, backgroundColor: '#fff', borderRadius: 12, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12 }}>
          <Ionicons name="search" size={20} color="#888" />
          <TextInput
            placeholder="search for a product"
            style={{ flex: 1, height: 40, paddingLeft: 10 }}
          />
        </View>
      </View> */}


<LinearGradient
      colors={['#3d8b49ff','#39683aff','#537455ff' ]}
      style={styles.headerContainer}
    >
      {/* Left-side image */}
      <Image source={require('../assets/basket.png')} style={styles.sideImageLeft} />
      
      {/* Logo Text */}
      {/* <Text style={styles.logoText}>RAVI SEEDS</Text> */}

      {/* Center Logo */}
      <View style={styles.centerContent}>
        <Image source={require('../assets/Home.png')} style={styles.logoImage} resizeMode="contain" />
      </View>

      {/* Right-side image */}
      <Image source={require('../assets/basket2.png')} style={styles.sideImageRight} />

      {/* Top Right Icons */}
      <View style={styles.iconsContainer}>
        <Ionicons name="cart-outline" size={22} color="#fff" />
        <Ionicons name="notifications-outline" size={22} color="#fff" />
        <Ionicons name="person-outline" size={22} color="#fff" />
      </View>

      {/* If needed later: Search Bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color="#888" />
        <TextInput
          placeholder="search for a product"
          placeholderTextColor="#888"
          style={styles.searchInput}
        />
      </View>
    </LinearGradient>

  

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 10, paddingHorizontal: 10 }}>
        {['FRUITE SEEDS', 'ACCESSORIES', 'SPECIALS', 'NEW ARRIVALS'].map((item, index) => (
          <TouchableOpacity key={index} style={{ marginRight: 16 }}>
            <View style={{ alignItems: 'center' }}>
              <Image source={require('../assets/hydrid.png')} style={{ width: 60, height: 60, borderRadius: 30 }} />
              <Text style={{ marginTop: 4, fontSize: 12 }}>{item}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={{ paddingHorizontal: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 12 }}>Select Your Seed</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          {seeds.map((seed, idx) => (
            <View key={idx} style={{ width: '30%', alignItems: 'center', marginBottom: 16 }}>
              <Image source={require('../assets/hydrid.png')} style={{ width: 50, height: 50, borderRadius: 25 }} />
              <Text style={{ marginTop: 6, fontSize: 12, textAlign: 'center' }}>{seed}</Text>
            </View>
          ))}
        </View>

        <Text style={{ fontSize: 18, fontWeight: '600', marginVertical: 12 }}>Categories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((cat, i) => (
            <View key={i} style={{ alignItems: 'center', marginRight: 20 }}>
              <Image source={cat.icon} style={{ width: 60, height: 60, borderRadius: 12 }} />
              <Text style={{ marginTop: 6, fontSize: 12, textAlign: 'center' }}>{cat.label}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={{ height: 60 }} />
    </ScrollView>
  );
};




export default Product;

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#5da667',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderTopLeftRadius:0,
    borderTopRightRadius:0,
    paddingTop: 40,
    paddingBottom: 80,
    alignItems: 'center',
    position: 'relative',
  },
  centerContent: {
    alignItems: 'left',
  },
  logoText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    alignItems:'left'
  },
  logoImage: {
    width: 140,
    height: 100,
    marginTop: 3,
  },
  sideImageLeft: {
    position: 'absolute',
    left: 10,
    top: 70,
    width: 100,
    height: 90,
    opacity:0.4
  },
  sideImageRight: {
    position: 'absolute',
    right: 10,
    top: 70,
    width: 100,
    height: 90,
    opacity:0.4
  },
  iconsContainer: {
    position: 'absolute',
    top: 40,
    right: 20,
    flexDirection: 'row',
    gap: 16,
  },
  searchBar: {
    position: 'absolute',
    bottom: 32,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: '80%',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 40,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    paddingLeft: 8,
    fontSize: 14,
    color: '#333',
  },
});