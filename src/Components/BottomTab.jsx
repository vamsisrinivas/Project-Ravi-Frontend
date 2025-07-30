// import React from 'react';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import Icon from 'react-native-vector-icons/Ionicons'; // ✅ Make sure this is installed

// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import AntDesign from 'react-native-vector-icons/AntDesign'


// import Home from '../Screens/Home';
// import Products from '../Screens/Products';
// import Orders from '../Screens/Orders';
// import Profile from '../Screens/Profile';

// const Tab = createBottomTabNavigator();

// export default function MainAppTabs() {
//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         tabBarIcon: ({ color, size }) => {
//           let iconName;

//           switch (route.name) {
//             case 'Home':
//               iconName = 'home-outline';
//               break;
//             case 'Products':
//               iconName = 'cube-outline';
//               break;
//             case 'Orders':
//               iconName = 'receipt-outline';
//               break;
//             case 'Profile':
//               iconName = 'person-outline';
//               break;
//           }

//           return <Icon name={iconName} size={size} color={color} />;
//         },
//         tabBarActiveTintColor: '#2f95dc',
//         tabBarInactiveTintColor: 'gray',
//         headerShown: false,
//       })}
//     >
//       <Tab.Screen name="Home" component={Home} options={{tabBarIcon:({color,size})=>(
//         <FontAwesome name='home' color={color} size={25}/>
//       )}} />
//       <Tab.Screen name="Products" component={Products} options={{tabBarIcon:({color,size})=>(
//         <AntDesign name='product' color={color} size={25}/>
//       )}} />
//       <Tab.Screen name="Orders" component={Orders} />
//       <Tab.Screen name="Profile" component={Profile} options={{tabBarIcon:({color,size})=>(
//         <AntDesign name='user' color={color} size={25}/>
//           )}} />
//     </Tab.Navigator>
//   );
// }


import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Home from '../Screens/Home';
import Products from '../Screens/Products';
import Orders from '../Screens/Orders';
import Profile from '../Screens/Profile';

const Tab = createBottomTabNavigator();

export default function MainAppTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#0e9b31ff',
        tabBarInactiveTintColor: 'black',
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 14, // 👈 Increases tab label font size
          fontWeight: '600',
     
        },
        tabBarIconStyle: {
          marginTop: 10, // Optional: adds spacing above icon
         
        },
        tabBarStyle: {
          height: 80, // Optional: increases tab bar height
       
           paddingBottom: 35,  
           
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
              headerShown: false, // 🔒 hides the header

          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" color={color} size={size} />
          )
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
  );
}
