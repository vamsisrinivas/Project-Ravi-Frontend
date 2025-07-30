// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';

// import Register from './src/Auth/Register';
// import Login from './src/Auth/Login';
// import { MainAppTabs } from './src/Components/BottomTab';
 
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// const Stack = createNativeStackNavigator();

// export default function App() {
//   return (
// <NavigationContainer>
//   <Stack.Navigator initialRouteName="Register">
//     <Stack.Screen
//       name="Register"
//       component={Register}
//       options={{ headerShown: false }}
//     />
//     <Stack.Screen
//       name="Login"
//       component={Login}
//       options={{ headerShown: false }}
//     />
//    <Stack.Screen
//           name="MainApp"
//           component={MainAppTabs}
//           options={{ headerShown: false }}
//         />
//       </Stack.Navigator>
// </NavigationContainer>

//   );
// }




import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Register from './src/Auth/Register';
import Login from './src/Auth/Login';
import MainAppTabs from './src/Components/BottomTab';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      <Stack.Screen name="MainApp" component={MainAppTabs} options={{ headerShown: false }} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
