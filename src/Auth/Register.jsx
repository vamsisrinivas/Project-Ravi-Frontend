


// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   ToastAndroid,
//   Image,
//   ScrollView,
//   ImageBackground,
  

// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { Picker } from '@react-native-picker/picker';


// const Register = () => {
//   const navigation = useNavigation();

//   // const [selectedDistrict, setSelectedDistrict] = useState('');
//   // const [selectedMandal, setSelectedMandal] = useState('');
//   // const [selectedVillage, setSelectedVillage] = useState('');


//   const [pincode, setPincode] = useState('');
//   const [villages, setVillages] = useState([]);
//   const [cities, setCities] = useState([]);


//   const [formData, setFormData] = useState({
//     full_name: '',
//     email: '',
//     phone_no: '',
//     password: '',
//     confirm_password: '',
//     village: '',
//     city: '',
//   });

//   const {
//     full_name,
//     email,
//     phone_no,
//     password,
//     confirm_password,
//     village,
//     city,
//   } = formData;


//   // Fetch data when pincode is 6 digits
//   useEffect(() => {
//   if (pincode.length === 6) {
//     fetch(`https://api.postalpincode.in/pincode/${pincode}`)
//       .then(res => res.json())
//       .then(data => {
//         const response = data[0]; // ✅ API returns an array; we take the first object
//         if (response.Status === 'Success') {
//           const villageList = [...new Set(response.PostOffice.map(po => po.Name))];
//           const cityList = [...new Set(response.PostOffice.map(po => po.District))];

//           setVillages(villageList);
//           setCities(cityList);

//           // Auto select first value
//           setFormData(prev => ({
//             ...prev,
//             village: villageList[0] || '',
//             city: cityList[0] || '',
//           }));
//         } else {
//           // Pincode exists but no post offices
//           setVillages([]);
//           setCities([]);
//           setFormData(prev => ({ ...prev, village: '', city: '' }));
//           ToastAndroid.show('Invalid pincode! Please check and try again.', ToastAndroid.SHORT);
//         }
//       })
//       .catch(err => {
//         console.error(err);
//         ToastAndroid.show('Failed to fetch location data!', ToastAndroid.SHORT);
//       });
//   }
// }, [pincode]);



//   const handleChange = (field, value) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   const handleRegister = async () => {
//     if (password !== confirm_password) {
//       ToastAndroid.show('Passwords do not match!', ToastAndroid.SHORT);
//       return;
//     }

//     const payload = {
//       full_name,
//       email,
//       phone_no,
//       password,
//       village,
//       city,
//     };

//     try {
//       const res = await fetch('http://192.168.0.8:3000/api/registration/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(payload),
//       });

//       if (res.ok) {
//         const data = await res.json();
//         ToastAndroid.show('Registration Successful!', ToastAndroid.SHORT);
//         setFormData({
//           full_name: '',
//           email: '',
//           phone_no: '',
//           password: '',
//           confirm_password: '',
//           village: '',
//           city: '',
//         });
//         setPincode('');
//         setVillages([]);
//         setCities([]);
//         navigation.navigate('Login');
//       } else {
//         ToastAndroid.show('Registration Failed!', ToastAndroid.SHORT);
//         console.log('Error:', await res.text());
//       }
//     } catch (error) {
//       ToastAndroid.show('Something went wrong!', ToastAndroid.SHORT);
//       console.error(error);
//     }
//   };

//   return (
//     <><View style={{ backgroundColor: 'white', height: '100%', width: '100%' }}>

//       <ScrollView contentContainerStyle={styles.scrollContent}>
//         {/* Curved Top Header */}
//         <View style={styles.curvedHeader}>
//           {/* <Svg height="160" width="100%" viewBox="0 0 1440 320" style={styles.svgCurve}>
//             <Path
//               fill="#4CAF50"
//               d="M0,160L60,149.3C120,139,240,117,360,117.3C480,117,600,139,720,149.3C840,160,960,160,1080,144C1200,128,1320,96,1380,80L1440,64L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
//             />
//           </Svg> */}

//           {/* Farmer Image */}
//           <Image source={require('../assets/register_page_image.png')} style={styles.farmerImage} />
//         </View>
//         {/* Register Form */}
//         <ImageBackground
//           source={require('../assets/login_image_2.png')} // your grass background
//           style={styles.background}
//           resizeMode="cover"
//         >
//           <View style={styles.formContainer}>
//             <View style={styles.logoCircle}>
//               <Image source={require('../assets/Logo_type_2.png')} style={styles.logoText} />
//             </View>
//             <Text style={styles.title}>REGISTER</Text>
//             <Text style={styles.subtitle}>To a new account</Text>

//             <TextInput
//               placeholder="Full Name"
//               placeholderTextColor="black"
//               value={full_name}
//               onChangeText={text => handleChange('full_name', text)}
//               style={styles.input}
//             />

//             <TextInput
//               placeholder="Email"
//               placeholderTextColor="black"
//               value={email}
//               onChangeText={text => handleChange('email', text)}
//               keyboardType="email-address"
//               style={styles.input}
//             />

//             <TextInput
//               placeholder="Phone Number"
//               placeholderTextColor="black"
//               value={phone_no}
//               onChangeText={text => handleChange('phone_no', text)}
//               keyboardType="phone-pad"
//               style={styles.input}
//             />

//             <TextInput
//               placeholder="Password"
//               placeholderTextColor="black"
//               value={password}
//               onChangeText={text => handleChange('password', text)}
//               secureTextEntry
//               style={styles.input}
//             />

//             <TextInput
//               placeholder="Confirm Password"
//               value={confirm_password}
//               placeholderTextColor="black"
//               onChangeText={text => handleChange('confirm_password', text)}
//               secureTextEntry
//               style={styles.input}
//             />


//             <TextInput placeholder="Pincode" placeholderTextColor="black" value={pincode} onChangeText={setPincode} keyboardType="numeric" maxLength={6} style={styles.input} />





//             <View style={styles.row}>
//               <View style={styles.column}>
//                 {/* <Text style={{ marginBottom: 6, fontWeight: '600' }}>Mandal</Text> */}
//                 <View style={styles.dropdown}>
//                   <Picker selectedValue={city} onValueChange={val => handleChange('city', val)}>
//                     {cities.map(c => <Picker.Item key={c} label={c} value={c} />)}
//                     <Picker.Item label="Madal" value="" />
//                   </Picker>
//                 </View>
//               </View>
//               <View style={styles.column}>
//                 {/* <Text style={{ marginBottom: 6, fontWeight: '600' }}>Village</Text> */}
//                 <View style={styles.dropdown}>
//                   <Picker selectedValue={village} onValueChange={val => handleChange('village', val)}>
//                     {villages.map(v => <Picker.Item key={v} label={v} value={v} />)}
//                     <Picker.Item label="Village" value="" />
//                   </Picker>
//                 </View>
//               </View>

//             </View>





//             <TouchableOpacity style={styles.button} onPress={handleRegister}>
//               <Text style={styles.registerButton}>Register</Text>
//             </TouchableOpacity>

//         <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
//   <Text style={styles.footerText}>Already have an account? </Text>
//   <TouchableOpacity onPress={() => navigation.navigate('Login')}>
//     <Text style={styles.loginLink}>Log In</Text>
//   </TouchableOpacity>
// </View>

//           </View>
//         </ImageBackground>
//       </ScrollView>
//     </View></>
//   );
// };

// export default Register;

// const styles = StyleSheet.create({
//   background: {
//     flex: 1,
//     height: '100%',
//     width: '100%',
//     position: 'absolute',
//     top: 140
//   },
//   scrollContent: {
//     flexGrow: 1,
//   },
//   overlay: {
//     ...StyleSheet.absoluteFillObject, // fills entire background
//     backgroundColor: 'rgba(8, 238, 180, 0.7)', // green with 40% opacity
//   },
//   curvedHeader: {
//     backgroundColor: '#ffffff',
//     alignItems: 'center',
//     margin: 0,
//     paddingTop: 0,
//   },
//   svgCurve: {
//     position: 'absolute',
//     top: 0,
//   },
//   farmerImage: {
//     width: 300,
//     height: 200,
//     marginTop: 0,
//     top: 20,
//     resizeMode: 'cover',
//     zIndex: 1
//   },
//   formContainer: {
//     padding: 10,
//     alignItems: 'center',
//     marginTop: 70,
//     marginBottom: 20
//   },
//   logoCircle: {
//     width: 100,
//     height: 100,
//     borderRadius: 30,
//     // backgroundColor: '#ffffff',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: -40,
//     zIndex: 2,
//   },
//   logoText: {
//     fontWeight: 'bold',
//     color: '#ffffff',
//     width: 150,
//     height: 150,
//     // borderRadius: 20
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#ffffff',
//     top: 20,
//     marginBottom: 5,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#ffffff',
//     marginBottom: 5,
//     marginTop: 10,
//   },
//   input: {
//     width: '85%',
//     height: 40,
//     backgroundColor: '#ffffffff',
//     borderRadius: 8,
//     paddingHorizontal: 9,
//     marginVertical: 4,

//   },
//   //cascading dropdown

//   dropdown: {
//     width: '85%',
//     height: 40, // Match TextInput height
//     backgroundColor: '#ffffff',
//     borderRadius: 8,
//     paddingHorizontal: 9,
//     marginVertical: 4,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     justifyContent: 'center', // Vertically center picker
//   },


//   // dropdown1: {
//   //   width: '91%',
//   //   borderWidth: 1,
//   //   borderColor: '#ccc',
//   //   borderRadius: 8,
//   //   paddingHorizontal: 8,
//   //   marginBottom: 5,
//   //   backgroundColor: '#f9f9f9',
//   // },

//   row: {
//     width: '90%',
//     marginLeft: 18,
//     flexDirection: 'row',
//     justifyContent: "space-between",
//     gap: 5,
//   },

//   column: {
//     flex: 2,
//   },
//   // button: {
//   //   backgroundColor: '#2e8b57',
//   //   padding: 15,
//   //   borderRadius: 8,
//   //   alignItems: 'center',
//   //   marginTop: 10,
//   // },
//   registerButton: {
//     backgroundColor: '#009b77',
//     padding: 10,
//     borderRadius: 8,
//     marginTop: 5,
//     width: '80%',
//     alignItems: 'center',
//   },
//   registerButtonText: {
//     color: '#ffffff',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
// footerText: {
//   fontSize: 16,
//   color: 'black',
// },

// loginLink: {
//   fontSize: 16,
//   color: 'white',
//   textDecorationLine: 'underline',
//   cursor:'pointer'
// }

// });



//new code 






import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ToastAndroid,
  Image,
  ScrollView,
  ImageBackground,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,

} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import BASE_URL from '../Config/api';


const Register = () => {
  const navigation = useNavigation();

  // const [selectedDistrict, setSelectedDistrict] = useState('');
  // const [selectedMandal, setSelectedMandal] = useState('');
  // const [selectedVillage, setSelectedVillage] = useState('');


  const [pincode, setPincode] = useState('');
  const [villages, setVillages] = useState([]);
  const [cities, setCities] = useState([]);


  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_no: '',
    password: '',
    confirm_password: '',
    village: '',
    city: '',
  });

  const {
    full_name,
    email,
    phone_no,
    password,
    confirm_password,
    village,
    city,
  } = formData;


  // Fetch data when pincode is 6 digits
  useEffect(() => {
    if (pincode.length === 6) {
      fetch(`https://api.postalpincode.in/pincode/${pincode}`)
        .then(res => res.json())
        .then(data => {
          const response = data[0]; // ✅ API returns an array; we take the first object
          if (response.Status === 'Success') {
            const villageList = [...new Set(response.PostOffice.map(po => po.Name))];
            const cityList = [...new Set(response.PostOffice.map(po => po.District))];

            setVillages(villageList);
            setCities(cityList);

            // Auto select first value
            setFormData(prev => ({
              ...prev,
              village: villageList[0] || '',
              city: cityList[0] || '',
            }));
          } else {
            // Pincode exists but no post offices
            setVillages([]);
            setCities([]);
            setFormData(prev => ({ ...prev, village: '', city: '' }));
            ToastAndroid.show('Invalid pincode! Please check and try again.', ToastAndroid.SHORT);
          }
        })
        .catch(err => {
          console.error(err);
          ToastAndroid.show('Failed to fetch location data!', ToastAndroid.SHORT);
        });
    }
  }, [pincode]);



  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    if (password !== confirm_password) {
      ToastAndroid.show('Passwords do not match!', ToastAndroid.SHORT);
      return;
    }

    const payload = {
      full_name,
      email,
      phone_no,
      password,
      village,
      city,
    };

    try {
      const res = await fetch(`${BASE_URL}/registration/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        ToastAndroid.show('Registration Successful!', ToastAndroid.SHORT);
        setFormData({
          full_name: '',
          email: '',
          phone_no: '',
          password: '',
          confirm_password: '',
          village: '',
          city: '',
        });
        setPincode('');
        setVillages([]);
        setCities([]);
        navigation.navigate('Login');
      } else {
        ToastAndroid.show('Registration Failed!', ToastAndroid.SHORT);
        console.log('Error:', await res.text());
      }
    } catch (error) {
      ToastAndroid.show('Something went wrong!', ToastAndroid.SHORT);
      console.error(error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1, backgroundColor: 'white' }}>
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
            {/* Curved Top Header */}
            <View style={styles.curvedHeader}>
              {/* <Svg height="160" width="100%" viewBox="0 0 1440 320" style={styles.svgCurve}>
            <Path
              fill="#4CAF50"
              d="M0,160L60,149.3C120,139,240,117,360,117.3C480,117,600,139,720,149.3C840,160,960,160,1080,144C1200,128,1320,96,1380,80L1440,64L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
            />
          </Svg> */}

              {/* Farmer Image */}
              <Image source={require('../assets/register_page_image.png')} style={styles.farmerImage} />
            </View>
            {/* Register Form */}
            <ImageBackground
              source={require('../assets/login_image_2.png')} // your grass background
              style={styles.background}
              resizeMode="cover"
            >
              <View style={styles.formContainer}>
                <View style={styles.logoCircle}>
                  <Image source={require('../assets/Logo_type_2.png')} style={styles.logoText} />
                </View>
                <Text style={styles.title}>REGISTER</Text>
                <Text style={styles.subtitle}>To a new account</Text>

                <TextInput
                  placeholder="Full Name"
                  placeholderTextColor="black"
                  value={full_name}
                  onChangeText={text => handleChange('full_name', text)}
                  style={styles.input}
                />

                <TextInput
                  placeholder="Email"
                  placeholderTextColor="black"
                  value={email}
                  onChangeText={text => handleChange('email', text)}
                  keyboardType="email-address"
                  style={styles.input}
                />

                <TextInput
                  placeholder="Phone Number"
                  placeholderTextColor="black"
                  value={phone_no}
                  onChangeText={text => handleChange('phone_no', text)}
                  keyboardType="phone-pad"
                  style={styles.input}
                />

                <TextInput
                  placeholder="Password"
                  placeholderTextColor="black"
                  value={password}
                  onChangeText={text => handleChange('password', text)}
                  secureTextEntry
                  style={styles.input}
                />

                <TextInput
                  placeholder="Confirm Password"
                  value={confirm_password}
                  placeholderTextColor="black"
                  onChangeText={text => handleChange('confirm_password', text)}
                  secureTextEntry
                  style={styles.input}
                />


                <TextInput placeholder="Pincode" placeholderTextColor="black" value={pincode} onChangeText={setPincode} keyboardType="numeric" maxLength={6} style={styles.input} />





                <View style={styles.row}>
                  <View style={styles.column}>
                    {/* <Text style={{ marginBottom: 6, fontWeight: '600' }}>Mandal</Text> */}
                    <View style={styles.dropdown}>
                      <Picker selectedValue={city} onValueChange={val => handleChange('city', val)}>
                        {cities.map(c => <Picker.Item key={c} label={c} value={c} />)}
                        <Picker.Item label="Madal" value="" />
                      </Picker>
                    </View>
                  </View>
                  <View style={styles.column}>
                    {/* <Text style={{ marginBottom: 6, fontWeight: '600' }}>Village</Text> */}
                    <View style={styles.dropdown}>
                      <Picker selectedValue={village} onValueChange={val => handleChange('village', val)}>
                        {villages.map(v => <Picker.Item key={v} label={v} value={v} />)}
                        <Picker.Item label="Village" value="" />
                      </Picker>
                    </View>
                  </View>

                </View>





                <TouchableOpacity style={styles.button} onPress={handleRegister}>
                  <Text style={styles.registerButton}>Register</Text>
                </TouchableOpacity>

                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={styles.footerText}>Already have an account? </Text>
                  <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.loginLink}>Log In</Text>
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

export default Register;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    height: '100%',
    width: '100%',
    position: 'absolute',
    top: 140
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
    width: 300,
    height: 200,
    marginTop: 0,
    top: 20,
    resizeMode: 'cover',
    zIndex: 1
  },
  formContainer: {
    padding: 10,
    alignItems: 'center',
    marginTop: 70,
    marginBottom: 20
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 30,
    // backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -40,
    zIndex: 2,
  },
  logoText: {
    fontWeight: 'bold',
    color: '#ffffff',
    width: 150,
    height: 150,
    // borderRadius: 20
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    top: 20,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    width: '85%',
    height: 40,
    backgroundColor: '#ffffffff',
    borderRadius: 8,
    paddingHorizontal: 9,
    marginVertical: 4,

  },
  //cascading dropdown

  dropdown: {
    width: '85%',
    height: 40, // Match TextInput height
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 9,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center', // Vertically center picker
  },


  // dropdown1: {
  //   width: '91%',
  //   borderWidth: 1,
  //   borderColor: '#ccc',
  //   borderRadius: 8,
  //   paddingHorizontal: 8,
  //   marginBottom: 5,
  //   backgroundColor: '#f9f9f9',
  // },

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
    cursor: 'pointer'
  }

});


