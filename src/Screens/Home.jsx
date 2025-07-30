import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      const userData = await AsyncStorage.getItem('user');
      if (userData) setUser(JSON.parse(userData));
    })();
  }, []);

  if (!user) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome, {user.full_name}!</Text>
      <Text style={styles.subText}>Phone: {user.phone_no}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 24, fontWeight: 'bold' },
  subText: { fontSize: 18, marginTop: 10 },
});

export default Home;
