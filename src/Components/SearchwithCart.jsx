import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SearchwithCart = ({ searchValue, onSearchChange, onCartPress }) => {
  return (
    <View style={styles.container}>
      {/* Search Box */}
      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={20} color="#020202ff" style={{ marginRight: 6 }} />
        <TextInput
          placeholder="Search for a product"
          placeholderTextColor="#131212ff"
          value={searchValue}
          onChangeText={onSearchChange}
          style={styles.input}
        />
      </View>

      {/* Cart Button */}
      <TouchableOpacity style={styles.cartButton} onPress={onCartPress}>
        <Ionicons name="cart-outline" size={22} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffff',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 40,
    elevation: 2, // for shadow in Android
    shadowColor: '#db0707ff', // iOS shadow
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  cartButton: {
    marginLeft: 8,
    backgroundColor: '#00A000',
    borderRadius: 8,
    padding: 10,
    elevation: 2,
  },
});

export default SearchwithCart;
