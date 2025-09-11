import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';
import GoHomeButton from '../Components/GoHomeButton';
import SearchwithCart from '../Components/SearchwithCart';
import BASE_URL from '../Config/api';

export default function CategoriesPage() {
  const route = useRoute();
  const navigation = useNavigation();
  const { categoryId, categoryName, all } = route.params || { all: true };

  const [items, setItems] = useState([]); // categories or brands
  const [filteredItems, setFilteredItems] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch items whenever navigation params change
  useEffect(() => {
    fetchItems();
  }, [route.params]);

  // Filter items based on search query
  useEffect(() => {
    if (!query.trim()) {
      setFilteredItems(items);
    } else {
      const lowerQuery = query.toLowerCase();
      setFilteredItems(
        items.filter((i) =>
          (i.category_name || i.brand_name).toLowerCase().includes(lowerQuery)
        )
      );
    }
  }, [query, items]);

  // Fetch categories or brands
  const fetchItems = async () => {
    setLoading(true);
    try {
      const url = all
        ? `${BASE_URL}/api/categories`
        : `${BASE_URL}/api/categories/${categoryId}/brands`;

      console.log('Fetching URL:', url); // Debug

      const res = await axios.get(url);
      setItems(res.data);
      setFilteredItems(res.data);
    } catch (error) {
      console.error(
        'Error fetching items:',
        error.response?.status,
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => {
    const name = item.category_name || item.brand_name;
    const image = item.category_image || item.brand_image;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          if (all) {
            // Clicked a category → show its brands
            navigation.navigate('CategoryBrands', {
              categoryId: item.id, // Make sure this matches backend ID
              categoryName: item.category_name,
              all: false,
            });
          } else {
            // Clicked a brand → navigate to brand details or alert
            alert(`Clicked brand: ${name}`);
          }
        }}
      >
        <Image source={{ uri: image }} style={styles.image} resizeMode="contain" />
        <Text style={styles.name}>{name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={{ width: 45, alignItems: 'flex-start' }}>
          <GoHomeButton />
        </View>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={styles.headerText}>
            {all ? 'All Categories' : categoryName}
          </Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Search */}
      <SearchwithCart
        searchValue={query}
        onSearchChange={setQuery}
        onCartPress={() => alert('Cart pressed!')}
      />

      {/* Items List */}
      {loading ? (
        <ActivityIndicator size="large" color="green" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={filteredItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingTop: 5,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  listContent: {
    paddingBottom: 20,
    paddingTop: 5,
  },
  card: {
    width: '48%',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  image: {
    width: '80%',
    height: 100,
    marginBottom: 8,
  },
  name: {
    fontSize: 14,
    textAlign: 'center',
    flexWrap: 'wrap',
  },
});
