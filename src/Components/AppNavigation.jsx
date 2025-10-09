// import React, { useContext } from "react";
// import { NavigationContainer } from "@react-navigation/native";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import { ActivityIndicator, View } from "react-native";
// import { AuthContext } from "./src/Context/AuthContext";

// import Register from "./src/Auth/Register";
// import Login from "./src/Auth/Login";
// import MainAppTabs from "./src/Components/BottomTab";

// const Stack = createNativeStackNavigator();

// function RootNavigator() {
//   const { user } = useContext(AuthContext); // ✅ watch user state

//   if (user === null) {
//     return (
//       <NavigationContainer>
//         <Stack.Navigator initialRouteName="Login">
//           <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
//           <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
//         </Stack.Navigator>
//       </NavigationContainer>
//     );
//   }

//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="MainApp">
//         <Stack.Screen name="MainApp" component={MainAppTabs} options={{ headerShown: false }} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

// export default function App() {
//   return (
//     <AuthProvider>
//       <RootNavigator />
//     </AuthProvider>
//   );
// }
