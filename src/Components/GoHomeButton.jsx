// src/Components/GoHomeButton.js
import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

export default function GoHomeButton() {
  const navigation = useNavigation();

  const goHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainApp', params: { screen: 'Home' } }],
    });
  };

  return (
    <TouchableOpacity onPress={goHome} style={{ padding: 10 }}>
      <Icon name="arrow-back" size={24} color="#000" />
    </TouchableOpacity>
  );
}
