

// import React from 'react';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { SafeAreaView } from 'react-native-safe-area-context';


// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import Ionicons from 'react-native-vector-icons/Ionicons';

// import Home from '../Screens/Home';
// import Products from '../Screens/Products';
// import Orders from '../Screens/Orders';
// import Profile from '../Screens/Profile';
// import BrandsPage from '../Screens/Brandspage';

// const Tab = createBottomTabNavigator();
// const HomeStack = createNativeStackNavigator();


// // 🏠 Stack inside Home tab
// function HomeStackScreen() {
//   return (
//     <HomeStack.Navigator screenOptions={{ headerShown: false }}>
//       <HomeStack.Screen name="HomeScreen" component={Home} />
//       <HomeStack.Screen name="BrandsPage" component={BrandsPage} />
//     </HomeStack.Navigator>
//   );
// }

// export default function MainAppTabs() {
//   return (
//     // <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>

//     <Tab.Navigator
//       screenOptions={{
//         tabBarActiveTintColor: '#0e9b31ff',
//         tabBarInactiveTintColor: 'black',
//         headerShown: false,
//         tabBarLabelStyle: {
//           fontSize: 14, // 👈 Increases tab label font size
//           fontWeight: '600',

//         },
//         tabBarIconStyle: {
//           marginTop: 10, // Optional: adds spacing above icon

//         },
//         tabBarStyle: {
//           height: 80, // Optional: increases tab bar height
//           paddingBottom: 35,

//         },
//       }}
//     >
//       <Tab.Screen
//         name="Home"
//         component={HomeStackScreen}
//         options={{
//           headerShown: false, // 🔒 hides the header

//           tabBarIcon: ({ color, size }) => (
//             <FontAwesome name="home" color={color} size={size} />
//           )
//         }}
//       />
//       <Tab.Screen
//         name="Products"
//         component={Products}
//         options={{
//           tabBarIcon: ({ color, size }) => (
//             <FontAwesome name="shopping-bag" color={color} size={size} />
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="Orders"
//         component={Orders}
//         options={{
//           tabBarIcon: ({ color, size }) => (
//             <Ionicons name="receipt" color={color} size={size} />
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="Profile"
//         component={Profile}
//         options={{
//           tabBarIcon: ({ color, size }) => (
//             <FontAwesome name="user" color={color} size={size} />
//           ),
//         }}
//       />
//     </Tab.Navigator>
//     // </SafeAreaView>
//   );
// }



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

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();

// 🏠 Stack inside Home tab
function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeScreen" component={Home} />
      <HomeStack.Screen name="BrandsPage" component={BrandsPage} />
      <HomeStack.Screen name="CategoriesPage" component={CategoriesPage} options={{ title: 'Categories' }} />
      <HomeStack.Screen name="CategoryBrands" component={CategoryBrands} options={{ title: 'CategoryBrands' }} />
      <HomeStack.Screen name="ModelsPage" component={ModelsPage} options={{ title: "Models" }}/>
    </HomeStack.Navigator>
  );
}

export default function MainAppTabs() {
  const insets = useSafeAreaInsets(); // ⬅ Get device safe area insets

  return (
    <SafeAreaView style={[styles.container, { paddingBottom: insets.bottom > 0 ? 0 : 0, backgroundColor: '#548c5c' }]}>
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
          component={Products}
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
          name="Profile"
          component={Profile}
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
