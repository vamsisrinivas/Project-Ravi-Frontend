


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
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";




const Register = () => {
  const navigation = useNavigation();

  const [pincode, setPincode] = useState('');
  const [villages, setVillages] = useState([]);
  const [cities, setCities] = useState([]);


  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  useEffect(() => {
    if (pincode.length === 6) {
      fetch(`https://api.postalpincode.in/pincode/${pincode}`)
        .then(res => res.json())
        .then(data => {
          const response = data[0];
          if (response.Status === 'Success') {
            const villageList = [...new Set(response.PostOffice.map(po => po.Name))];
            const cityList = [...new Set(response.PostOffice.map(po => po.District))];

            setVillages(villageList);
            setCities(cityList);

            setFormData(prev => ({
              ...prev,
              village: villageList[0] || '',
              city: cityList[0] || '',
            }));
          } else {
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
      const res = await fetch(`${BASE_URL}/api/registration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#548c5c" }}>
      <KeyboardAwareScrollView
        style={{ flex: 1, backgroundColor: "white" }}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        extraScrollHeight={20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flexGrow: 1, backgroundColor: 'white' }}>
            <View style={styles.curvedHeader}>
              <Image
                source={require('../assets/register_page_image.png')}
                style={styles.farmerImage}
              />
            </View>

            <View style={{ flexGrow: 1 }}>
              <ImageBackground
                source={require('../assets/login_image_2.png')}
                style={styles.background}
                resizeMode="cover"
              >
                <View style={styles.formContainer}>
                  <View style={styles.logoCircle}>
                    <Image
                      source={require('../assets/Logo_type_2.png')}
                      style={styles.logoText}
                    />
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
                    // keyboardType="phone-pad"
                    style={styles.input}
                  />

                  {/* <TextInput
                  placeholder="Password"
                  placeholderTextColor="black"
                  value={password}
                  onChangeText={text => handleChange('password', text)}
                  secureTextEntry
                  style={styles.input}
                />

                <TextInput
                  placeholder="Confirm Password"
                  placeholderTextColor="black"
                  value={confirm_password}
                  onChangeText={text => handleChange('confirm_password', text)}
                  secureTextEntry
                  style={styles.input}
                /> */}

                  <View style={styles.passwordContainer}>
                    <TextInput
                      placeholder="Password"
                      placeholderTextColor="black"
                      value={password}
                      onChangeText={text => handleChange('password', text)}
                      secureTextEntry={!showPassword}
                      style={styles.inputPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                      <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="grey" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.passwordContainer}>
                    <TextInput
                      placeholder="Confirm Password"
                      placeholderTextColor="black"
                      value={confirm_password}
                      onChangeText={text => handleChange('confirm_password', text)}
                      secureTextEntry={!showConfirmPassword}
                      style={styles.inputPassword}
                    />
                    <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                      <Ionicons name={showConfirmPassword ? 'eye-off' : 'eye'} size={20} color="grey" />
                    </TouchableOpacity>
                  </View>



                  <TextInput
                    placeholder="Pincode"
                    placeholderTextColor="black"
                    value={pincode}
                    onChangeText={setPincode}
                    keyboardType="numeric"
                    maxLength={6}
                    style={styles.input}
                  />

                  {/* <View style={styles.row}>
                    <View style={styles.column}>
                      <View style={styles.dropdown}>
                        <Picker
                          selectedValue={city}
                          onValueChange={val => handleChange('city', val)}
                        >
                          <Picker.Item label="Select Mandal" value="" color="black" />
                          {cities.map(c => (
                            <Picker.Item key={c} label={c} value={c} />
                          ))}
                        </Picker>
                      </View>
                    </View>
                    <View style={styles.column}>
                      <View style={styles.dropdown}>
                        <Picker
                          selectedValue={village}
                          onValueChange={val => handleChange('village', val)}
                        >
                          <Picker.Item label="Select Village" value="" color="black" />
                          {villages.map(v => (
                            <Picker.Item key={v} label={v} value={v}  />
                          ))}
                        </Picker>
                      </View>
                    </View>
                  </View> */}

                  <View style={styles.row}>
                    <View style={styles.column}>
                      <View style={styles.dropdown}>
                        <Picker
                          selectedValue={city}
                          onValueChange={val => handleChange('city', val)}
                          mode="dropdown"
                          style={{
                            color: 'black',
                            backgroundColor: 'transparent',
                            height: 52, // better height
                            fontSize: 10,
                          }}
                          dropdownIconColor="black"
                        >
                          <Picker.Item label="Select Mandal" value="" />
                          {cities.map(c => (
                            <Picker.Item key={c} label={c} value={c} />
                          ))}
                        </Picker>

                      </View>
                    </View>

                    <View style={styles.column}>
                      <View style={styles.dropdown}>
                        <Picker
                          selectedValue={village}
                          onValueChange={val => handleChange('village', val)}
                          mode="dropdown"
                          style={{
                            color: 'black', // Picker text color
                            backgroundColor: 'transparent', // Picker background
                            height: 52,
                            fontSize: 10,
                            borderWidth: 1,
                            borderColor: '#ccc',
                            borderRadius: 8,
                            paddingHorizontal: 10,
                          }}
                          dropdownIconColor="black"
                        >
                          <Picker.Item label="Select Village" value="" />
                          {villages.map(v => (
                            <Picker.Item key={v} label={v} value={v} />
                          ))}
                        </Picker>

                      </View>
                    </View>
                  </View>


                  <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                    <Text style={styles.registerButtonText}>Register</Text>
                  </TouchableOpacity>

                  <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={styles.footerText}>Already have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                      <Text style={styles.loginLink}>Log In</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ImageBackground>
            </View>
          </View>

        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default Register;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    minHeight: '100%',
    // position: 'absolute',
    // top: 140,
    flexGrow: 1
  },
  curvedHeader: {
    backgroundColor: '#ffffff',
    alignItems: 'center',
    margin: 0,
    paddingTop: 0,
  },
  farmerImage: {
    width: 300,
    height: 200,
    marginTop: 0,
    top: 20,
    resizeMode: 'cover',
    zIndex: 1,
  },
  formContainer: {
    padding: 10,
    alignItems: 'center',
    marginTop: 70,
  },

  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -40,
    zIndex: 2,
  },
  logoText: {
    width: 150,
    height: 150,
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
  dropdown: {
    width: '85%',
    height: 40,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 9,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
  },
  row: {
    width: '90%',
    marginLeft: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 5,
  },
  column: {
    flex: 2,
  },
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
    fontSize: 18,
    color: 'white',
    textDecorationLine: 'underline',
  },

  //passowrd code

  passwordContainer: {
    width: '85%',
    height: 40,
    backgroundColor: '#ffffffff',
    borderRadius: 8,
    paddingHorizontal: 9,
    marginVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  inputPassword: {
    flex: 1,
    color: 'black',
  },



});


