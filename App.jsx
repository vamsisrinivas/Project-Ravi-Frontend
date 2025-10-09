

// import React, { useEffect, useState } from "react";
// import { NavigationContainer } from "@react-navigation/native";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { ActivityIndicator, View } from "react-native";

// import Register from "./src/Auth/Register";
// import Login from "./src/Auth/Login";
// import MainAppTabs from "./src/Components/BottomTab";

// const Stack = createNativeStackNavigator();

// export default function App() {
//   const [initialRoute, setInitialRoute] = useState(null);

//   useEffect(() => {
//     const checkUser = async () => {
//       try {
//         const user = await AsyncStorage.getItem("user");
//         setInitialRoute(user ? "MainApp" : "Login");
//       } catch (error) {
//         console.error("Error checking AsyncStorage:", error);
//         setInitialRoute("Login");
//       }
//     };
//     checkUser();
//   }, []);

//   if (!initialRoute) {
//     return (
//       <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//         <ActivityIndicator size="large" color="#548c5c" />
//       </View>
//     );
//   }

//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName={initialRoute}>
//         <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
//         <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
//         <Stack.Screen name="MainApp" component={MainAppTabs} options={{ headerShown: false }} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }


import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, View } from "react-native";

import { AuthProvider } from "./src/Context/AuthContext";
import { CartProvider } from "./src/Context/CartContext";  // ✅ import cart context

import Register from "./src/Auth/Register";
import Login from "./src/Auth/Login";
import MainAppTabs from "./src/Components/BottomTab";

const Stack = createNativeStackNavigator();

function RootNavigator() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await AsyncStorage.getItem("user");
        setInitialRoute(user ? "MainApp" : "Login");
      } catch (error) {
        console.error("Error checking AsyncStorage:", error);
        setInitialRoute("Login");
      }
    };
    checkUser();
  }, []);

  if (!initialRoute) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#548c5c" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="MainApp" component={MainAppTabs} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider> 
        <RootNavigator />
      </CartProvider>
    </AuthProvider>
  );
}
