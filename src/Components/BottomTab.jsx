


// import React from 'react';
// import { View, StyleSheet } from 'react-native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';

// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import Ionicons from 'react-native-vector-icons/Ionicons';

// import Home from '../Screens/Home';
// import Products from '../Screens/Products';
// import Orders from '../Screens/Orders';
// import Profile from '../Screens/Profile';
// import BrandsPage from '../Screens/Brandspage';
// import CategoriesPage from '../Screens/CategoriesPage';
// import CategoryBrands from '../Screens/CategoryBrands';
// import ModelsPage from '../Screens/ModelPage';
// import ProductDetailPage from '../Screens/ProductDetailPage';

// const Tab = createBottomTabNavigator();
// const HomeStack = createNativeStackNavigator();

// // 🏠 Stack inside Home tab
// function HomeStackScreen() {
//   return (
//     <HomeStack.Navigator screenOptions={{ headerShown: false }}>
//       <HomeStack.Screen name="HomeScreen" component={Home} />
//       <HomeStack.Screen name="BrandsPage" component={BrandsPage} />
//       <HomeStack.Screen name="CategoriesPage" component={CategoriesPage} options={{ title: 'Categories' }} />
//       <HomeStack.Screen name="CategoryBrands" component={CategoryBrands} options={{ title: 'CategoryBrands' }} />
//       <HomeStack.Screen name="ModelsPage" component={ModelsPage} options={{ title: "Models" }}/>
//       <HomeStack.Screen name="ProductPage" component={Products}/>
//             <HomeStack.Screen name="ProductDetailPage" component={ProductDetailPage} />


//     </HomeStack.Navigator>
//   );
// }

// export default function MainAppTabs() {
//   const insets = useSafeAreaInsets(); // ⬅ Get device safe area insets

//   return (
//     <SafeAreaView style={[styles.container, { paddingBottom: insets.bottom > 0 ? 0 : 0, backgroundColor: '#548c5c' }]}>
//       <Tab.Navigator
//         screenOptions={{
//           tabBarActiveTintColor: '#548c5c',
//           tabBarInactiveTintColor: 'black',
//           headerShown: false,
//           tabBarLabelStyle: {
//             fontSize: 14,
//             fontWeight: '600',
//           },
//           tabBarIconStyle: {
//             marginTop: 10,
//           },
//           tabBarStyle: {
//             height: 70,
//             paddingBottom: 25,
//           },
//         }}
//       >
//         <Tab.Screen
//           name="Home"
//           component={HomeStackScreen}
//           options={{
//             tabBarIcon: ({ color, size }) => (
//               <FontAwesome name="home" color={color} size={size} />
//             ),
//           }}
//         />
//         <Tab.Screen
//           name="Products"
//           component={Products}
//           options={{
//             tabBarIcon: ({ color, size }) => (
//               <FontAwesome name="shopping-bag" color={color} size={size} />
//             ),
//           }}
//         />
//         <Tab.Screen
//           name="Orders"
//           component={Orders}
//           options={{
//             tabBarIcon: ({ color, size }) => (
//               <Ionicons name="receipt" color={color} size={size} />
//             ),
//           }}
//         />
//         <Tab.Screen
//           name="Profile"
//           component={Profile}
//           options={{
//             tabBarIcon: ({ color, size }) => (
//               <FontAwesome name="user" color={color} size={size} />
//             ),
//           }}
//         />
//       </Tab.Navigator>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
// });


import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Home from '../Screens/Home';
import Products from '../Screens/Products';
import Orders from '../Screens/Orders';
import Profile from '../Screens/Profile';
import BrandsPage from '../Screens/Brandspage';
import CategoriesPage from '../Screens/CategoriesPage';
import CategoryBrands from '../Screens/CategoryBrands';
import ModelsPage from '../Screens/ModelPage';
import ProductDetailPage from '../Screens/ProductDetailPage';
import CartScreen from '../Screens/CartScreen';
import Vedik from '../Screens/Vedik';
import AddressScreen from '../Screens/AddressScreen';
import WishlistScreen from '../Screens/WishlistScreen';

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const ProductsStack = createNativeStackNavigator();

// 🏠 Stack inside Home tab
function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeScreen" component={Home} />
      <HomeStack.Screen name="BrandsPage" component={BrandsPage} />
      <HomeStack.Screen name="CategoriesPage" component={CategoriesPage} />
      <HomeStack.Screen name="CategoryBrands" component={CategoryBrands} />
      <HomeStack.Screen name="ModelsPage" component={ModelsPage} />
      <HomeStack.Screen name="ProductDetailPage" component={ProductDetailPage} />
      <HomeStack.Screen name="CartScreen" component={CartScreen} />
    </HomeStack.Navigator>
  );
}

// 🛍️ Stack for Products tab
function ProductsStackScreen() {
  return (
    <ProductsStack.Navigator screenOptions={{ headerShown: false }}>
      <ProductsStack.Screen name="ProductsPage" component={Products} />
      <ProductsStack.Screen name="ProductDetailPage" component={ProductDetailPage} />
      <ProductsStack.Screen name="CartScreen" component={CartScreen} />
    </ProductsStack.Navigator>
  );
}

const ProfileStack = createNativeStackNavigator();

function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ProfileMain" component={Profile} />
      <ProfileStack.Screen name="DeliveryAddress" component={AddressScreen} />
      <ProfileStack.Screen name="Wishlist" component={WishlistScreen} />

    </ProfileStack.Navigator>
  );
}


export default function MainAppTabs() {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={[styles.container, { paddingBottom: 0, backgroundColor: '#548c5c' }]}>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#548c5c',
          tabBarInactiveTintColor: 'black',
          headerShown: false,
          tabBarLabelStyle: {
            fontSize: 14,
            fontWeight: '600',
          },
          tabBarIconStyle: {
            marginTop: 10,
          },
          tabBarStyle: {
            height: 70,
            paddingBottom: 25,
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeStackScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="home" color={color} size={size} />
            ),
          }}
        />

        <Tab.Screen
          name="Products"
          component={ProductsStackScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="shopping-bag" color={color} size={size} />
            ),
          }}
        />

        <Tab.Screen
          name="Orders"
          component={Orders}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="receipt" color={color} size={size} />
            ),
          }}
        />

        <Tab.Screen
          name="Vedik"
          component={Vedik}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="leaf" color={color} size={size} />
            ),
          }}
        />


        <Tab.Screen
          name="Profile"
          component={ProfileStackScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="user" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
