




// import React from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   ScrollView,
//   Image,
//   TouchableOpacity,
//   StyleSheet,
// } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';

// {/* Horizontal category bar */ }
// import { Dimensions } from 'react-native';
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
//   // 'VEG SEEDS': require('../assets/mixedveg.png'),
//   'BITTER GOURD': require('../assets/bettergroud.png'),
// };

// // fallback/default image
// const defaultImage = require('../assets/default.png');



// const Product = () => {
//   return (
//     <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
//       {/* Header image */}
//       <View style={styles.headerContainer}>
//         <Image
//           source={require('../assets/Main_page_screen_1080x1920.png')} // use your correct path
//           style={styles.headerBackground}
//           resizeMode="cover"
//         />

//         {/* Logo at top-left */}
//         <Image
//           source={require('../assets/Logo_type_2.png')} // use your logo
//           style={styles.logoImage}
//         />

//         {/* Top-right icons */}
//         <View style={styles.iconsContainer}>
//           <Ionicons name="cart-outline" size={22} color="#fff" />
//           <Ionicons name="notifications-outline" size={22} color="#fff" />
//           <Ionicons name="person-outline" size={22} color="#fff" />
//         </View>

//         {/* Search bar */}
//         <View style={styles.searchBar}>
//           <Ionicons name="search" size={18} color="#888" />
//           <TextInput
//             placeholder="search for a product"
//             placeholderTextColor="#888"
//             style={styles.searchInput}
//           />
//         </View>
//       </View>



//  <ScrollView
//   horizontal
//   showsHorizontalScrollIndicator={false}
//   style={{ marginVertical: 10 }}
//   contentContainerStyle={{
//     paddingHorizontal: 10,
//     minWidth: width,
//     flexDirection: 'row',
//     justifyContent: 'center',
//   }}
// >
//   {main.map((item, index) => (
//     <TouchableOpacity key={index} style={{ marginHorizontal: 10 }}>
//       <View style={{ alignItems: 'center' }}>
//         <Image
//           source={item.image}
//           style={{ width: 60, height: 60, borderRadius: 30 }}
//         />
//         <Text style={{ marginTop: 4, fontSize: 12 }}>{item.title}</Text>
//       </View>
//     </TouchableOpacity>
//   ))}
// </ScrollView>


//       {/* Seed grid */}
//       <View style={{ paddingHorizontal: 16 }}>
//         <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 12 }}>Select Your Seed</Text>

//         <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
//           {seeds.map((seed, idx) => (
//             <View key={idx} style={{ width: '30%', alignItems: 'center', marginBottom: 16 }}>
//               <Image
//                 source={seedImages[seed] || defaultImage}
//                 style={{ width: 50, height: 50, borderRadius: 25 }}
//                 resizeMode="contain"
//               />
//               <Text style={{ marginTop: 6, fontSize: 12, textAlign: 'center' }}>{seed}</Text>
//             </View>
//           ))}
//         </View>



//         {/* Category list */}
//         <Text style={{ fontSize: 18, fontWeight: '600', marginVertical: 12 }}>Categories</Text>
//         <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//           {categories.map((cat, i) => (
//             <View key={i} style={{ alignItems: 'center', marginRight: 20 }}>
//               <Image source={cat.icon} style={{ width: 60, height: 60, borderRadius: 12 }} />
//               <Text style={{ marginTop: 6, fontSize: 12, textAlign: 'center' }}>{cat.label}</Text>
//             </View>
//           ))}
//         </ScrollView>
//       </View>

//       <View style={{ height: 60 }} />
//     </ScrollView>
//   );
// };

// export default Product;

// const styles = StyleSheet.create({
//   headerContainer: {
//     position: 'relative',
//     width: '100%',
//     height: 240,
//     overflow: 'hidden',
//     backgroundColor: '#f0f0f0', // fallback color while loading


//     shadowColor: '#000', // iOS shadow
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 4,
//     elevation: 1, // Android shadow
//     shadowColor: '#000', // iOS shadow
//     shadowOpacity: 0.1,
//   },

//   headerBackground: {
//     width: '100%',
//     height: 750,
//     resizeMode: 'cover',
//     position: 'absolute',
//     top: 0,
//     left: 0,

//   },

//   logoImage: {
//     position: 'absolute',
//     top: 30,
//     left: 1,
//     width: 130,
//     height: 130,
//     resizeMode: 'contain',
//   },
//   iconsContainer: {
//     position: 'absolute',
//     top: 30,
//     right: 16,
//     flexDirection: 'row',
//     gap: 14,
//   },
//   searchBar: {
//     position: 'absolute',
//     bottom: 20,
//     alignSelf: 'center',
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     width: '85%',
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     height: 40,
//     elevation: 4,
//   },
//   searchInput: {
//     flex: 1,
//     paddingLeft: 8,
//     fontSize: 14,
//     color: '#333',
//   },
// });



import React from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const main = [
  { title: 'FRUITE SEEDS', image: require('../assets/multiseeds.png') },
  { title: 'ACCESSORIES', image: require('../assets/accecories.png') },
  { title: 'SPECIALS', image: require('../assets/special.png') },
  { title: 'NEW ARRIVALS', image: require('../assets/newarrival.png') },
];

const categories = [
  { label: 'HYBRID', icon: require('../assets/hydrid.png') },
  { label: 'HIGH YIELD CROP', icon: require('../assets/chili.png') },
  { label: 'WATER - EFFICIENT', icon: require('../assets/water-effi.png') },
  { label: 'INTERCROP', icon: require('../assets/intercrop.png') },
];

const seeds = [
  'TOMATO', 'BRINJAL', 'COCCINIA', 'WATERMELON', 'CAPSICUM',
  'CAULIFLOWER', 'MIRCHI', 'LADY-FINGER', 'VEG SEEDS', 'BITTER GOURD',
];

const seedImages = {
  TOMATO: require('../assets/tomato.png'),
  BRINJAL: require('../assets/brinjal.png'),
  COCCINIA: require('../assets/connina.png'),
  WATERMELON: require('../assets/watermelon.png'),
  CAPSICUM: require('../assets/capcium.png'),
  CAULIFLOWER: require('../assets/cauliflower.png'),
  MIRCHI: require('../assets/chili.png'),
  'LADY-FINGER': require('../assets/ladyfinger.png'),
  'BITTER GOURD': require('../assets/bettergroud.png'),
};

const defaultImage = require('../assets/default.png');

const Product = () => {
  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.headerContainer}>
        <Image
          source={require('../assets/Main_page_screen_1080x1920.png')}
          style={styles.headerBackground}
        />

        <Image
          source={require('../assets/Logo_type_2.png')}
          style={styles.logoImage}
        />

        <View style={styles.iconsContainer}>
          <Ionicons name="cart-outline" size={22} color="#fff" />
          <Ionicons name="notifications-outline" size={22} color="#fff" />
          <Ionicons name="person-outline" size={22} color="#fff" />
        </View>

        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#888" />
          <TextInput
            placeholder="Search for a product"
            placeholderTextColor="#888"
            style={styles.searchInput}
          />
        </View>
      </View>

      

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalScrollContainer}
      >
        {main.map((item, index) => (
          <TouchableOpacity key={index} style={styles.mainItem}>
            <Image source={item.image} style={styles.mainImage} />
            <Text style={styles.mainText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.contentContainer}>
        <Text style={styles.sectionTitle}>Select Your Seed</Text>

        <View style={styles.seedGrid}>
          {seeds.map((seed, idx) => (
            <View key={idx} style={styles.seedItem}>
              <Image
                source={seedImages[seed] || defaultImage}
                style={styles.seedImage}
              />
              <Text style={styles.seedText}>{seed}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Categories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((cat, i) => (
            <View key={i} style={styles.categoryItem}>
              <Image source={cat.icon} style={styles.categoryIcon} />
              <Text style={styles.categoryLabel}>{cat.label}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={{ height: 80 }} />
    </ScrollView>
  );
};

export default Product;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    position: 'relative',
    width: '100%',
    height: 240,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  // headerBackground: {
  //   width: '100%',
  //   height: '100%',
  //   resizeMode: 'cover',
  //   position: 'absolute',
  // },

    headerBackground: {
    width: '100%',
    height: 750,
    resizeMode: 'cover',
    position: 'absolute',
   

  },
  logoImage: {
    position: 'absolute',
    top: 30,
    left: 10,
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  iconsContainer: {
    position: 'absolute',
    top: 50,
    right: 16,
    flexDirection: 'row',
    gap: 14,
  },
  searchBar: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: '85%',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 40,
    elevation: 4,
  },
  searchInput: {
    flex: 1,
    paddingLeft: 8,
    fontSize: 14,
    color: '#333',
  },
  horizontalScrollContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  mainItem: {
    marginHorizontal: 10,
    alignItems: 'center',
  },
  mainImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    resizeMode: 'contain',

  },
  mainText: {
    marginTop: 4,
    fontSize: 12,
    textAlign: 'center',
  },
  contentContainer: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 12,
  },
  seedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  seedItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 16,
  },
  seedImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    resizeMode: 'contain',
  },
  seedText: {
    marginTop: 6,
    fontSize: 12,
    textAlign: 'center',
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 20,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  categoryLabel: {
    marginTop: 6,
    fontSize: 12,
    textAlign: 'center',
  },
});
