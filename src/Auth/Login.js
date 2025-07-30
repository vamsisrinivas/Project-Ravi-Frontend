// import React, { useState } from 'react';
// import {
//   View, Text, TextInput, TouchableOpacity, StyleSheet,
//   Image, ImageBackground, ScrollView, Alert
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const Login = ({ navigation }) => {
//   const [phone_no, setPhoneNo] = useState('');
//   const [password, setPassword] = useState('');

//   const [loading, setLoading] = useState(false);

//   const handleLogin = async () => {
//     if (loading) return; // prevent double click
//     if (!phone_no || !password) {
//       Alert.alert('Validation Error', 'Please enter both phone number and password');
//       return;
//     }

//     setLoading(true); // block re-entry

//     try {
//       const response = await fetch('http://192.168.0.8:3000/api/login/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ phone_no, password }),
//       });

//       const data = await response.json();

//       if (data.success) {
//         console.log('Login successful:', data);

//         await AsyncStorage.setItem('user', JSON.stringify(data.user));

//         navigation.reset({
//           index: 0,
//           routes: [{ name: 'MainApp' }],
//         });
//       } else {
//         Alert.alert('Login Failed', data.message || 'Invalid credentials');
//       }
//     } catch (error) {
//       console.error('Login error:', error);
//       Alert.alert('Error', 'Failed to login. Please try again later.');
//     } finally {
//       setLoading(false); // reset loading
//     }
//   };



//   return (
//     <View style={{ backgroundColor: 'white', height: '100%', width: '100%' }}>
//       <ScrollView contentContainerStyle={styles.scrollContent}>
//         <View style={styles.curvedHeader}>
//           <Image source={require('../assets/login_image_png.png')} style={styles.farmerImage} />
//         </View>

//         <ImageBackground
//           source={require('../assets/register_image_2.png')}
//           style={styles.background}
//           resizeMode="cover"
//         >
//           <View style={styles.formContainer}>
//             <View style={styles.logoCircle}>
//               <Image source={require('../assets/Logo_type_1.png')} style={styles.logoText} />
//             </View>

//             <Text style={styles.title}>LOGIN</Text>
//             <Text style={styles.subtitle}>Enter your credentials</Text>

//             <TextInput
//               placeholder="Phone Number"
//               placeholderTextColor="black"
//               value={phone_no}
//               onChangeText={setPhoneNo}
//               keyboardType="phone-pad"
//               style={styles.input}
//             />

//             <TextInput
//               placeholder="Password"
//               placeholderTextColor="black"
//               value={password}
//               onChangeText={setPassword}
//               secureTextEntry
//               style={styles.input}
//             />

//             {/* <TouchableOpacity style={styles.button} onPress={handleLogin}>
//               <Text style={styles.registerButton}>Login</Text>
//             </TouchableOpacity> */}

//             <TouchableOpacity
//               style={[styles.registerButton, loading && { opacity: 0.6 }]}
//               onPress={handleLogin}
//               disabled={loading}
//             >
//               <Text style={styles.registerButtonText}>{loading ? 'Logging in...' : 'Login'}</Text>
//             </TouchableOpacity>


//           <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
//   <Text style={styles.footerText}>Don't have an account? </Text>
//   <TouchableOpacity onPress={() => navigation.navigate('Register')}>
//     <Text style={styles.loginLink}>Register</Text>
//   </TouchableOpacity>
// </View>

//           </View>
//         </ImageBackground>
//       </ScrollView>
//     </View>
//   );
// }


// export default Login;


import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../Config/api';

const Login = ({ navigation }) => {
  const [phone_no, setPhoneNo] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (loading) return;
    if (!phone_no || !password) {
      Alert.alert('Validation Error', 'Please enter both phone number and password');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_no, password }),
      });

      const data = await response.json();
      if (data.success) {
        console.log(data)
        await AsyncStorage.setItem('user', JSON.stringify(data.user));
        navigation.reset({ index: 0, routes: [{ name: 'MainApp' }] });
      } else {
        Alert.alert('Login Failed', data.message || 'Invalid credentials');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to login. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'android' ? 'height' : 'padding'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1, backgroundColor: 'white' }}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.curvedHeader}>
              <Image source={require('../assets/login_image_png.png')} style={styles.farmerImage} />
            </View>

            <ImageBackground
              source={require('../assets/register_image_2.png')}
              style={styles.background}
              resizeMode="cover"
            >
              <View style={styles.formContainer}>
                <View style={styles.logoCircle}>
                  <Image source={require('../assets/Logo_type_1.png')} style={styles.logoText} />
                </View>

                <Text style={styles.title}>LOGIN</Text>
                <Text style={styles.subtitle}>Enter your credentials</Text>

                <TextInput
                  placeholder="Phone Number"
                  placeholderTextColor="black"
                  value={phone_no}
                  onChangeText={setPhoneNo}
                  keyboardType="phone-pad"
                  style={styles.input}
                />

                <TextInput
                  placeholder="Password"
                  placeholderTextColor="black"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  style={styles.input}
                />

                <TouchableOpacity
                  style={[styles.registerButton, loading && { opacity: 0.6 }]}
                  onPress={handleLogin}
                  disabled={loading}
                >
                  <Text style={styles.registerButtonText}>
                    {loading ? 'Logging in...' : 'Login'}
                  </Text>
                </TouchableOpacity>

                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
                  <Text style={styles.footerText}>Don't have an account? </Text>
                  <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.loginLink}>Register</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ImageBackground>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Login;


const styles = StyleSheet.create({
  background: {
    flex: 1,
    height: '100%',
    width: '100%',
    position: 'absolute',
    top: 200
  },
  scrollContent: {
    flexGrow: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, // fills entire background
    backgroundColor: 'rgba(8, 238, 180, 0.7)', // green with 40% opacity
  },
  curvedHeader: {
    backgroundColor: '#ffffff',
    alignItems: 'center',
    margin: 0,
    paddingTop: 0,
  },
  svgCurve: {
    position: 'absolute',
    top: 0,
  },
  farmerImage: {
    width: 330,
    height: 245,
    marginTop: 0,
    top: 40,
    resizeMode: 'cover',
    zIndex: 1
  },
  formContainer: {
    padding: 10,
    alignItems: 'center',
    marginTop: 90,
    marginBottom: 20
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 30,
    // backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -30,
    zIndex: 2,
  },
  logoText: {
    fontWeight: 'bold',
    color: '#ffffff',
    width: 180,
    height: 180,
    borderRadius: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    top: 10,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 5,
  },
  input: {
    width: '85%',
    height: 50,
    backgroundColor: '#ffffffff',
    borderRadius: 8,
    paddingHorizontal: 7,
    marginVertical: 7,

  },
  //cascading dropdown

  dropdown: {
    width: '85%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 7,
    backgroundColor: '#f9f9f9',
    fontcolor: '#000000ff',
  },

  dropdown1: {
    width: '91%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 5,
    backgroundColor: '#f9f9f9',
  },

  row: {
    width: '90%',
    marginLeft: 18,
    flexDirection: 'row',
    justifyContent: "space-between",
    gap: 5,
  },

  column: {
    flex: 2,
  },
  // button: {
  //   backgroundColor: '#2e8b57',
  //   padding: 15,
  //   borderRadius: 8,
  //   alignItems: 'center',
  //   marginTop: 10,
  // },
  registerButton: {
    backgroundColor: '#009b77',
    padding: 10,
    borderRadius: 8,
    marginTop: 5,
    width: '80%',
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
footerText: {
  fontSize: 16,
  color: 'black',
},

loginLink: {
  fontSize: 16,
  color: 'white',
  textDecorationLine: 'underline',
}

});
