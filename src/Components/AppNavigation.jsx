// // AppNavigation.jsx
// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import MainAppTabs from './BottomTab'; // Your bottom tabs
// import BrandsPage from '../Screens/Brandspage'; // Your full brands list screen

// const Stack = createStackNavigator();

// export default function AppNavigation() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator screenOptions={{ headerShown: false }}>
//         {/* Main tabs */}
//         <Stack.Screen name="MainTabs" component={MainAppTabs} />
//         {/* Extra pages */}
//         <Stack.Screen name="BrandsPage" component={BrandsPage} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }
