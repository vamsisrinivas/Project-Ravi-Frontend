import React, { useState } from 'react';
import { View, Text } from 'react-native';
import SearchwithCart from '../Components/SearchwithCart';

const Orders=()=> {

  const [query, setQuery] = useState('');


  return (
    <>
    
      <View style={{ flex: 1, }}>
      <SearchwithCart
        searchValue={query}
        onSearchChange={setQuery}
        onCartPress={() => alert('Cart pressed!')}
      />
    </View>
    <View style={{ flex: 1, justifyContent: 'top', alignItems: 'center' }}>
      <Text>Order Screen</Text>
    </View>
    </>
  );
}
export default Orders;
