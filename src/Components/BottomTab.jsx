



// import React from 'react';
// import { View, StyleSheet } from 'react-native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';

// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
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
// import CartScreen from '../Screens/CartScreen';
// import Vedik from '../Screens/Vedik';
// import AddressScreen from '../Screens/AddressScreen';
// import WishlistScreen from '../Screens/WishlistScreen';
// import CheckoutScreen from '../Screens/CheckoutScreen';
// import PaymentSuccessScreen from "../Screens/PaymentSuccessScreen";
// import OrderDetailsScreen from '../Screens/OrderDetailsScreen';
// import ForgotPassword from '../Screens/ForgotPassword';
// import ProfileScreen from '../Screens/ProfileScreen';
// import ContactUs from '../Screens/ContactUs';
// import SeedlingForm from '../Screens/SeedlingForm';
// import ApprovedSeedlingsScreen from '../Screens/SeedlingsScreen';
// import RvHubScreen from '../Screens/RvHubScreen';


// const Tab = createBottomTabNavigator();
// const HomeStack = createNativeStackNavigator();
// const ProductsStack = createNativeStackNavigator();

// // 🏠 Stack inside Home tab
// function HomeStackScreen() {
//   return (
//     <HomeStack.Navigator screenOptions={{ headerShown: false }}>
//       <HomeStack.Screen name="HomeScreen" component={Home} />
//       <HomeStack.Screen name="BrandsPage" component={BrandsPage} />
//       <HomeStack.Screen name="CategoriesPage" component={CategoriesPage} />
//       <HomeStack.Screen name="Products" component={Products} />
//       <HomeStack.Screen name="Seedlings" component={SeedlingForm} />


//       <HomeStack.Screen name="CategoryBrands" component={CategoryBrands} />
//       <HomeStack.Screen name="ModelsPage" component={ModelsPage} />
//       <HomeStack.Screen name="ProductDetailPage" component={ProductDetailPage} />
//       <HomeStack.Screen name="CartScreen" component={CartScreen} />
//       <HomeStack.Screen name="Checkout" component={CheckoutScreen} />
//       <HomeStack.Screen name="PaymentSuccess" component={PaymentSuccessScreen} options={{ headerShown: false }} />
//       <HomeStack.Screen name="OrderDetails" component={OrderDetailsScreen} options={{ headerShown: false }} />
//       <HomeStack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: false }} />
//       <HomeStack.Screen name="MyProfile" component={ProfileScreen} options={{ headerShown: false }} />
//       <HomeStack.Screen name="ContactUs" component={ContactUs} options={{ headerShown: false }} />




//     </HomeStack.Navigator>
//   );
// }

// // 🛍️ Stack for Products tab
// function ProductsStackScreen() {
//   return (
//     <ProductsStack.Navigator screenOptions={{ headerShown: false }}>
//       <ProductsStack.Screen name="ProductsPage" component={Products} />
//       <ProductsStack.Screen name="ProductDetailPage" component={ProductDetailPage} />
//       <ProductsStack.Screen name="CartScreen" component={CartScreen} />
//       <ProductsStack.Screen name="Checkout" component={CheckoutScreen} />
//     </ProductsStack.Navigator>
//   );
// }

// const ProfileStack = createNativeStackNavigator();

// function ProfileStackScreen() {
//   return (
//     <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
//       <ProfileStack.Screen name="ProfileMain" component={Profile} />
//       <ProfileStack.Screen name="DeliveryAddress" component={AddressScreen} />
//       <ProfileStack.Screen name="Wishlist" component={WishlistScreen} />
//       <ProfileStack.Screen name="MyProfile" component={ProfileScreen} />
//       <ProfileStack.Screen name="Approved-Seedling" component={ApprovedSeedlingsScreen} />
//       <ProfileStack.Screen name="ContactUs" component={ContactUs} />

//     </ProfileStack.Navigator>
//   );
// }

// const CategoryStack = createNativeStackNavigator();

// function CategoryStackScreen() {
//   return (
//     <CategoryStack.Navigator screenOptions={{ headerShown: false }}>
//       <CategoryStack.Screen
//         name="CategoryHome"
//         component={RvHubScreen}   // ✅ your screen
//       />
//       <CategoryStack.Screen
//         name="Vedik"
//         component={Vedik}
//       />
//       <CategoryStack.Screen
//         name="Seedlings"
//         component={SeedlingForm}
//       />
//     </CategoryStack.Navigator>
//   );
// }



// const TAB_THEME = {
//   activeBg: "#548c5c",
//   activeIcon: "#548c5c",
//   inactiveIcon: "#3b3b3b",
//   tabBarBg: "#FFFFFF",
//   APP_BG: "#548c5c",
// };

// const APP_BG = TAB_THEME.APP_BG;




// const TabIcon = ({ focused, children }) => {
//   return (
//     <View style={styles.iconWrapper}>
//       {focused && <View style={styles.cutOut} />}
//       <View style={[styles.iconCircle, focused && styles.activeIcon]}>
//         {children}
//       </View>
//     </View>
//   );
// };



// export default function MainAppTabs() {
//   const insets = useSafeAreaInsets();


//   return (
//     <SafeAreaView style={[styles.container, { paddingBottom: 0, paddingTop: 25, backgroundColor: APP_BG }]}>



//       <Tab.Navigator
//         screenOptions={{
//           headerShown: false,
//           tabBarShowLabel: true,

//           tabBarActiveTintColor: TAB_THEME.activeBg,
//           tabBarInactiveTintColor: TAB_THEME.inactiveIcon,
//           tabBarLabelStyle: styles.tabLabel,
//           tabBarStyle: styles.tabBar,
//           tabBarItemStyle: {
//             justifyContent: "center",
//           },


//           tabBarStyle: {
//             height: 65,
//             paddingBottom: 20,
//           },
//         }}
//       >

//         <Tab.Screen
//           name="Home"
//           component={HomeStackScreen}
//           options={{
//             tabBarIcon: ({ focused }) => (
//               <TabIcon focused={focused}>
//                 <FontAwesome
//                   name="home"
//                   size={20}
//                   color={focused ? TAB_THEME.activeIcon : TAB_THEME.inactiveIcon}
//                 />
//               </TabIcon>
//             ),
//           }}
//         />




//         <Tab.Screen
//           name="Products"
//           component={ProductsStackScreen}
//           options={{
//             tabBarIcon: ({ focused }) => (
//               <TabIcon focused={focused}>
//                 <FontAwesome
//                   name="shopping-bag"
//                   size={18}
//                   color={focused ? TAB_THEME.activeIcon : TAB_THEME.inactiveIcon}
//                 />
//               </TabIcon>
//             ),
//           }}
//         />




//         <Tab.Screen
//           name="Orders"
//           component={Orders}
//           options={{
//             tabBarIcon: ({ focused }) => (
//               <TabIcon focused={focused}>
//                 <Ionicons
//                   name="receipt"
//                   size={20}
//                   color={focused ? TAB_THEME.activeIcon : TAB_THEME.inactiveIcon}
//                 />
//               </TabIcon>
//             ),
//           }}
//         />




//         <Tab.Screen
//           name="RV-AGRIHUB"
//           component={CategoryStackScreen}
//           options={{
//             tabBarLabel: "RV-AGRIHUB",
//             tabBarIcon: ({ focused }) => (
//               <TabIcon focused={focused}>
//                 <Ionicons
//                   name="grid"
//                   size={20}
//                   color={focused ? TAB_THEME.activeIcon : TAB_THEME.inactiveIcon}
//                 />
//               </TabIcon>
//             ),
//           }}
//         />







//         <Tab.Screen
//           name="Profile"
//           component={ProfileStackScreen}
//           options={{
//             tabBarIcon: ({ focused }) => (
//               <TabIcon focused={focused}>
//                 <FontAwesome
//                   name="user"
//                   size={20}
//                   color={focused ? TAB_THEME.activeIcon : TAB_THEME.inactiveIcon}
//                 />
//               </TabIcon>
//             ),
//           }}
//         />

//       </Tab.Navigator>
//     </SafeAreaView>
//   );
// }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //   },
// // });


// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: APP_BG, // ✅ now works
// //   },

// // tabBar: {
// //   position: "absolute",
// //   height: 72,               // ⬅️ IMPORTANT (was 64)
// //   marginHorizontal: 16,
// //   marginBottom: 14,
// //   borderRadius: 28,
// //   backgroundColor: "#FFFFFF",
// //   overflow: "visible",

// //   elevation: 12,
// //   shadowColor: "#000",
// //   shadowOffset: { width: 0, height: 8 },
// //   shadowOpacity: 0.12,
// //   shadowRadius: 10,
// // },




// // iconWrapper: {
// //   width: 60,          // ⬅️ was 70
// //   alignItems: "center",
// // },

// //   /* 🔪 CUT / NOTCH */
// // cutOut: {
// //   position: "absolute",
// //   top: -18,           // ⬅️ was -22
// //   width: 52,          // ⬅️ slightly smaller
// //   height: 52,
// //   borderRadius: 26,
// //   backgroundColor: APP_BG,
// //   zIndex: 1,
// // },



// // iconCircle: {
// //   width: 38,
// //   height: 38,
// //   borderRadius: 19,
// //   backgroundColor: "#FFFFFF",
// //   justifyContent: "center",
// //   alignItems: "center",
// //   marginTop: -8,      // ⬅️ was -12
// //   zIndex: 2,
// // },





// // tabLabel: {
// //   fontSize: 11,
// //   fontWeight: "600",
// //   marginBottom: 8,    // ⬅️ MORE SPACE
// // },

// // });

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: TAB_THEME.APP_BG,
// //   },

// //   /* 🟢 TAB BAR */
// //   tabBar: {
// //     position: "absolute",
// //     height: 78,                // ⬅️ MATCH FIRST IMAGE
// //     marginHorizontal: 16,
// //     marginBottom: 14,
// //     borderRadius: 30,
// //     backgroundColor: "#FFFFFF",
// //     overflow: "visible",

// //     elevation: 14,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 10 },
// //     shadowOpacity: 0.14,
// //     shadowRadius: 14,
// //   },

// //   /* 🧲 ICON HOLDER */
// //   iconWrapper: {
// //     width: 64,
// //     alignItems: "center",
// //   },

// //   /* 🔪 PERFECT NOTCH */
// //   cutOut: {
// //     position: "absolute",
// //     top: -26,                  // ⬅️ DEEPER CUT
// //     width: 60,
// //     height: 60,
// //     borderRadius: 30,
// //     backgroundColor: TAB_THEME.APP_BG,
// //     zIndex: 1,
// //   },

// //   /* ⚪ ICON CIRCLE */
// //   iconCircle: {
// //     width: 46,                 // ⬅️ BIGGER
// //     height: 46,
// //     borderRadius: 23,
// //     backgroundColor: "#FFFFFF",
// //     justifyContent: "center",
// //     alignItems: "center",
// //     marginTop: -18,            // ⬅️ FLOAT EFFECT
// //     zIndex: 2,
// //   },

// //   activeIcon: {
// //     backgroundColor: "#FFFFFF",
// //   },

// //   /* 🏷 LABEL */
// //   tabLabel: {
// //     fontSize: 11,
// //     fontWeight: "600",
// //     marginBottom: 6,           // ⬅️ CLOSE TO FIRST IMAGE
// //   },
// // });

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: TAB_THEME.APP_BG,
//   },

//   /* 🟢 TAB BAR */
//   tabBar: {
//     position: "absolute",
//     height: 70,              // ⬅️ reduced (fix bottom gap)
//     marginHorizontal: 7,
//     marginBottom: 0,        // ⬅️ less bottom space
//     borderRadius: 28,
//     backgroundColor: "#FFFFFF",
//     overflow: "visible",
//     height: 60,
//     paddingBottom: 20,
//     elevation: 12,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 12 },
//     shadowOpacity: 0.12,
//     shadowRadius: 12,
//   },

//   /* ICON WRAPPER */
//   iconWrapper: {
//     width: 60,
//     alignItems: "center",
//   },

//   /* 🔪 NOTCH */
//   cutOut: {
//     position: "absolute",
//     top: -22,               // ⬅️ slightly less deep
//     width: 56,
//     height: 56,
//     borderRadius: 45,
//     backgroundColor: "#86be8dff",
//     zIndex: 1,
//   },

//   /* ⚪ ICON CIRCLE */
//   iconCircle: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     backgroundColor: "#FFFFFF",
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: -16,         // ⬅️ LOWERED (fix label cut)
//     zIndex: 2,
//   },

//   activeIcon: {
//     backgroundColor: "#FFFFFF",
//   },

//   /* 🏷 LABEL */
//   tabLabel: {
//     fontSize: 12,
//     fontWeight: "600",
//     marginTop: 0,           // ⬅️ move label UP
//     marginBottom: 3,        // ⬅️ safe padding
//   },
// });


import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
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
import CheckoutScreen from '../Screens/CheckoutScreen';
import PaymentSuccessScreen from '../Screens/PaymentSuccessScreen';
import OrderDetailsScreen from '../Screens/OrderDetailsScreen';
import ForgotPassword from '../Screens/ForgotPassword';
import ProfileScreen from '../Screens/ProfileScreen';
import ContactUs from '../Screens/ContactUs';
import SeedlingForm from '../Screens/SeedlingForm';
import ApprovedSeedlingsScreen from '../Screens/SeedlingsScreen';
import RvHubScreen from '../Screens/RvHubScreen';

const { width } = Dimensions.get('window');
const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const ProductsStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();
const CategoryStack = createNativeStackNavigator();

// ─── Stack Navigators (all logic unchanged) ───────────────────────────────────

function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeScreen" component={Home} />
      <HomeStack.Screen name="BrandsPage" component={BrandsPage} />
      <HomeStack.Screen name="CategoriesPage" component={CategoriesPage} />
      <HomeStack.Screen name="Products" component={Products} />
      <HomeStack.Screen name="Seedlings" component={SeedlingForm} />
      <HomeStack.Screen name="CategoryBrands" component={CategoryBrands} />
      <HomeStack.Screen name="ModelsPage" component={ModelsPage} />
      <HomeStack.Screen name="ProductDetailPage" component={ProductDetailPage} />
      <HomeStack.Screen name="CartScreen" component={CartScreen} />
      <HomeStack.Screen name="Checkout" component={CheckoutScreen} />
      <HomeStack.Screen name="PaymentSuccess" component={PaymentSuccessScreen} options={{ headerShown: false }} />
      <HomeStack.Screen name="OrderDetails" component={OrderDetailsScreen} options={{ headerShown: false }} />
      <HomeStack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: false }} />
      <HomeStack.Screen name="MyProfile" component={ProfileScreen} options={{ headerShown: false }} />
      <HomeStack.Screen name="ContactUs" component={ContactUs} options={{ headerShown: false }} />
    </HomeStack.Navigator>
  );
}

function ProductsStackScreen() {
  return (
    <ProductsStack.Navigator screenOptions={{ headerShown: false }}>
      <ProductsStack.Screen name="ProductsPage" component={Products} />
      <ProductsStack.Screen name="ProductDetailPage" component={ProductDetailPage} />
      <ProductsStack.Screen name="CartScreen" component={CartScreen} />
      <ProductsStack.Screen name="Checkout" component={CheckoutScreen} />
    </ProductsStack.Navigator>
  );
}

function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ProfileMain" component={Profile} />
      <ProfileStack.Screen name="DeliveryAddress" component={AddressScreen} />
      <ProfileStack.Screen name="Wishlist" component={WishlistScreen} />
      <ProfileStack.Screen name="MyProfile" component={ProfileScreen} />
      <ProfileStack.Screen name="Approved-Seedling" component={ApprovedSeedlingsScreen} />
      <ProfileStack.Screen name="ContactUs" component={ContactUs} />
    </ProfileStack.Navigator>
  );
}

function CategoryStackScreen() {
  return (
    <CategoryStack.Navigator screenOptions={{ headerShown: false }}>
      <CategoryStack.Screen name="CategoryHome" component={RvHubScreen} />
      <CategoryStack.Screen name="Vedik" component={Vedik} />
      <CategoryStack.Screen name="Seedlings" component={SeedlingForm} />
    </CategoryStack.Navigator>
  );
}

// ─── Theme ────────────────────────────────────────────────────────────────────
const THEME = {
  green:      '#3a7d44',
  greenDark:  '#2e6438',
  greenLight: '#e8f5e9',
  greenGlow:  '#4caf50',
  white:      '#ffffff',
  inactive:   '#0c0b0b',
  barBg:      '#ffffff',
  appBg:      '#ffffff',
};

// ─── Tab definitions ──────────────────────────────────────────────────────────
const TABS = [
  { name: 'Home',       label: 'Home',     Icon: (p) => <FontAwesome  name="home"            {...p} /> },
  { name: 'Products',   label: 'Products', Icon: (p) => <FontAwesome  name="shopping-bag"    {...p} /> },
  { name: 'Orders',     label: 'Orders',   Icon: (p) => <Ionicons     name="receipt-outline" {...p} /> },
  { name: 'RV-AGRIHUB', label: 'AgriHub',  Icon: (p) => <FontAwesome5 name="seedling"        {...p} /> },
  { name: 'Profile',    label: 'Profile',  Icon: (p) => <FontAwesome  name="user"            {...p} /> },
];

// ─── Custom Tab Bar ───────────────────────────────────────────────────────────
function CustomTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.tabBarOuter, { paddingBottom: insets.bottom > 0 ? insets.bottom : 8 }]}>
      {/* Subtle green top accent line */}
      <View style={styles.topLine} />

      <View style={styles.tabBarInner}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const tab = TABS[index];

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              style={styles.tabItem}
              onPress={onPress}
              activeOpacity={0.8}
            >
              {focused ? (
                /* Active: floating pill with icon + label side by side */
                <View style={styles.activePill}>
                  <View style={styles.activeIconWrap}>
                    <tab.Icon size={18} color={THEME.white} />
                  </View>
                  <Text style={styles.activePillLabel}>{tab.label}</Text>
                </View>
              ) : (
                /* Inactive: icon + label stacked */
                <View style={styles.inactiveWrap}>
                  <tab.Icon size={21} color={THEME.inactive} />
                  <Text style={styles.inactiveLabel}>{tab.label}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// ─── Main Navigator ───────────────────────────────────────────────────────────
export default function MainAppTabs() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Tab.Navigator
        screenOptions={{ headerShown: false }}
        tabBar={(props) => <CustomTabBar {...props} />}
      >
        <Tab.Screen name="Home"        component={HomeStackScreen} />
        <Tab.Screen name="Products"    component={ProductsStackScreen} />
        <Tab.Screen name="Orders"      component={Orders} />
        <Tab.Screen name="RV-AGRIHUB"  component={CategoryStackScreen} />
        <Tab.Screen name="Profile"     component={ProfileStackScreen} />
      </Tab.Navigator>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.appBg,
  },

  // Outer shell (white card)
  tabBarOuter: {
    backgroundColor: THEME.barBg,
    marginHorizontal: 9,
    marginBottom: 20,
    borderRadius: 40,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 20,
    overflow: 'hidden',
  },

  // Thin green accent line at the top of the bar
  topLine: {
    height: 0,
    backgroundColor: THEME.green,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },

  tabBarInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 0,
    paddingHorizontal: 10,
  },

  // Each tab slot
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 45,
  },

  // Active: green pill with icon + label
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.green,
    borderRadius: 25,
    paddingHorizontal: 10,
    paddingVertical: 12,
    shadowColor: THEME.green,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 8,
    elevation: 8,
  },
  activeIconWrap: {
    marginRight: 5,
  },
  activePillLabel: {
    color: THEME.white,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  // Inactive: icon + label stacked
  inactiveWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  inactiveLabel: {
    color: THEME.inactive,
    fontSize: 10,
    fontWeight: '500',
    marginTop: 3,
    letterSpacing: 0.2,
  },
});


