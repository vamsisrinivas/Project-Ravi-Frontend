


// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   ScrollView,
//   Image,
//   TouchableOpacity,
//   StyleSheet,
//   Dimensions,
//   Alert,
//   Platform,
//   KeyboardAvoidingView,
//   TouchableWithoutFeedback,
//   Keyboard,
//   SafeAreaView,
//   StatusBar,
// } from 'react-native';

// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useNavigation } from '@react-navigation/native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

// // import { SafeAreaView } from 'react-native-safe-area-context';


// const { width } = Dimensions.get('window');

// const main = [
//   { title: 'FRUITE SEEDS', image: require('../assets/multiseeds.png') },
//   { title: 'ACCESSORIES', image: require('../assets/accecories.png') },
//   { title: 'SPECIALS', image: require('../assets/special.png') },
//   { title: 'NEW ARRIVALS', image: require('../assets/newarrival.png') },
// ];

// const categories = [
//   { label: 'HYBRID', icon: require('../assets/hydrid.png') },
//   { label: 'HIGH YIELD CROP', icon: require('../assets/chili.png') },
//   { label: 'WATER - EFFICIENT', icon: require('../assets/water-effi.png') },
//   { label: 'INTERCROP', icon: require('../assets/intercrop.png') },
// ];

// const seeds = [
//   'TOMATO', 'BRINJAL', 'COCCINIA', 'WATERMELON', 'CAPSICUM',
//   'CAULIFLOWER', 'MIRCHI', 'LADY-FINGER', 'VEG SEEDS', 'BITTER GOURD',
// ];

// const seedImages = {
//   TOMATO: require('../assets/tomato.png'),
//   BRINJAL: require('../assets/brinjal.png'),
//   COCCINIA: require('../assets/connina.png'),
//   WATERMELON: require('../assets/watermelon.png'),
//   CAPSICUM: require('../assets/capcium.png'),
//   CAULIFLOWER: require('../assets/cauliflower.png'),
//   MIRCHI: require('../assets/chili.png'),
//   'LADY-FINGER': require('../assets/ladyfinger.png'),
//   'BITTER GOURD': require('../assets/bettergroud.png'),
// };

// const defaultImage = require('../assets/default.png');

// const Product = () => {
//   const [user, setUser] = useState(null);
//   const navigation = useNavigation();

//   useEffect(() => {
//     (async () => {
//       const userData = await AsyncStorage.getItem('user');
//       if (userData) setUser(JSON.parse(userData));
//     })();
//   }, []);

//   // const handleLogout = async () => {
//   //   Alert.alert(
//   //     'Logout',
//   //     'Are you sure you want to logout?',
//   //     [
//   //       { text: 'Cancel', style: 'cancel' },
//   //       {
//   //         text: 'Logout',
//   //         style: 'destructive',
//   //         onPress: async () => {
//   //           try {
//   //             await AsyncStorage.removeItem('token');
//   //             await AsyncStorage.removeItem('user');
//   //             navigation.replace('Login');
//   //           } catch (error) {
//   //             console.error('Logout error:', error);
//   //           }
//   //         },
//   //       },
//   //     ],
//   //     { cancelable: true }
//   //   );
//   // };

// const handleLogout = async () => {
//   Alert.alert(
//     'Logout',
//     'Are you sure you want to logout?',
//     [
//       { text: 'Cancel', style: 'cancel' },
//       {
//         text: 'Logout',
//         style: 'destructive',
//         onPress: async () => {
//           try {
//             await AsyncStorage.removeItem('token');
//             await AsyncStorage.removeItem('user');

//             // Use timeout to avoid race condition
//             setTimeout(() => {
//               navigation.replace('Login');
//             }, 100); // 100ms is usually enough
//           } catch (error) {
//             console.error('Logout error:', error);
//           }
//         },
//       },
//     ],
//     { cancelable: true }
//   );
// };


  
//   if (!user) return null;

// return (
//   <>
//     <StatusBar backgroundColor="transparent" translucent barStyle="light-content" />

//     <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//         style={{ flex: 1 }}
//         keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : StatusBar.currentHeight}
//       >
//         <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//           <ScrollView
//             style={styles.container}
//             keyboardShouldPersistTaps="handled"
//             showsVerticalScrollIndicator={false}
//           >
//             {/* Header */}
//             <View style={styles.headerContainer}>
//               <Image
//                 source={require('../assets/Main_page_screen_1080x1920.png')}
//                 style={styles.headerBackground}
//               />

//               <Image
//                 source={require('../assets/Logo_type_2.png')}
//                 style={styles.logoImage}
//               />

//               <TouchableOpacity style={styles.userContainer} onPress={handleLogout}>
//                 <Text style={styles.greetingText}>Hi, {user.full_name}</Text>
//                 {/* <Ionicons name="person-outline" size={22} color="#fff" /> */}
//                 <FontAwesome5 name="user" size={22} color="#fff" solid />

//               </TouchableOpacity>

//               <View style={styles.topBar}>
//                 <View style={styles.searchBar}>
//                   <Ionicons name="search" size={18} color="#888" style={{ marginHorizontal: 6 }} />
//                   <TextInput
//                     placeholder="Search for a product"
//                     placeholderTextColor="#888"
//                     style={styles.searchInput}
//                   />
//                 </View>

//                 <TouchableOpacity style={styles.cartButton}>
//                   <Ionicons name="cart-outline" size={22} color="#fff" />
//                 </TouchableOpacity>
//               </View>
//             </View>

//             {/* Main Categories */}
//             <ScrollView
//               horizontal
//               showsHorizontalScrollIndicator={false}
//               contentContainerStyle={styles.horizontalScrollContainer}
//             >
//               {main.map((item, index) => (
//                 <TouchableOpacity key={index} style={styles.mainItem}>
//                   <Image source={item.image} style={styles.mainImage} />
//                   <Text style={styles.mainText}>{item.title}</Text>
//                 </TouchableOpacity>
//               ))}
//             </ScrollView>

//             {/* Seeds and Categories */}
//             <View style={styles.contentContainer}>
//               <Text style={styles.sectionTitle}>Select Your Seed</Text>

//               <View style={styles.seedGrid}>
//                 {seeds.map((seed, idx) => (
//                   <View key={idx} style={styles.seedItem}>
//                     <Image
//                       source={seedImages[seed] || defaultImage}
//                       style={styles.seedImage}
//                     />
//                     <Text style={styles.seedText}>{seed}</Text>
//                   </View>
//                 ))}
//               </View>

//               <Text style={styles.sectionTitle}>Categories</Text>
//               <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//                 {categories.map((cat, i) => (
//                   <View key={i} style={styles.categoryItem}>
//                     <Image source={cat.icon} style={styles.categoryIcon} />
//                     <Text style={styles.categoryLabel}>{cat.label}</Text>
//                   </View>
//                 ))}
//               </ScrollView>
//             </View>

//             {/* Bottom Padding */}
//             <View style={{ height: 80 }} />
//           </ScrollView>
//         </TouchableWithoutFeedback>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   </>
// );
// };

// export default Product;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   headerContainer: {
//     position: 'relative',
//     flexDirection: 'row',
//     width: '100%',
//     height: 240,
//     overflow: 'hidden',
//     backgroundColor: '#f0f0f0',
//     elevation: 1,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   headerBackground: {
//     width: '100%',
//     height: 750,
//     resizeMode: 'cover',
//     position: 'absolute',
//   },
//   logoImage: {
//     position: 'absolute',
//     top: 30,
//     left: 10,
//     width: 120,
//     height: 120,
//     resizeMode: 'contain',
//   },
//  userContainer: {
//   position: 'absolute',
//   top: Platform.OS === 'android' ? 40 : 20,
//   right: 16,
//   flexDirection: 'row',
//   alignItems: 'center',
//   gap: 6,
//   zIndex: 10,
// },
// greetingText: {
//   color: '#fff',
//   fontSize: 16,
//   fontWeight: '500',
//   marginRight: 6,
// },

//   topBar: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'flex-start',
//     paddingHorizontal: 25,
//     marginVertical: 20,
//     top: 80,
//   },
//   searchBar: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f0f0f0',
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     height: 40,
//     width: '80%',
//     marginRight: 20,
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: 16,
//     color: '#000',
//   },
//   cartButton: {
//     backgroundColor: '#1db124ff',
//     padding: 10,
//     borderRadius: 8,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   horizontalScrollContainer: {
//     paddingHorizontal: 10,
//     paddingVertical: 10,
//   },
//   mainItem: {
//     marginHorizontal: 10,
//     alignItems: 'center',
//   },
//   mainImage: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     resizeMode: 'contain',
//   },
//   mainText: {
//     marginTop: 4,
//     fontSize: 12,
//     textAlign: 'center',
//   },
//   contentContainer: {
//     paddingHorizontal: 16,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     marginVertical: 12,
//   },
//   seedGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//   },
//   seedItem: {
//     width: '30%',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   seedImage: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     resizeMode: 'contain',
//   },
//   seedText: {
//     marginTop: 6,
//     fontSize: 12,
//     textAlign: 'center',
//   },
//   categoryItem: {
//     alignItems: 'center',
//     marginRight: 20,
//   },
//   categoryIcon: {
//     width: 60,
//     height: 60,
//     borderRadius: 12,
//   },
//   categoryLabel: {
//     marginTop: 6,
//     fontSize: 12,
//     textAlign: 'center',
//   },
// });




import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Product = () => {
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

export default Product;
