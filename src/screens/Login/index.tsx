import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';

import {
  checkCodeExistence,
  requestPhoneNumPermission,
  validatePhoneNumber,
} from '../../utils';

import {
  UserSelectors,
  loginUserAPI,
  resetLoginData,
} from '../../store/slices/users';

import {ms, mvs, vs} from 'react-native-size-matters';

import {SafeAreaView} from 'react-native-safe-area-context';

import SimCardsManagerModule from 'react-native-sim-cards-manager';

import {Images} from '../../assets/images';
import PhoneNumbersModal from '../../components/organisms/PhoneNumbersModal';
import PhoneInputField from '../../components/molecules/PhoneInputField/PhoneInputField';
import {Button, Checkbox, Loader} from '../../components/atoms';
import {hp} from '../../utils/metrix';
import {getDataFromAsync} from '../../utils/LocalStorage';
import {getCurrentTheme} from '../../constants/Colors';
import useAppDispatch from '../../hooks/useAppDispatch';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
// import {useAuth} from '../../contexts/AuthContext';
// import {useTheme} from '../../contexts/ThemeContext';

type Props = Record<string, never>;

const Login: FunctionComponent<Props> = () => {
  const {theme} = useTheme();
  const Color = getCurrentTheme(theme || 'light');
  const styles = screenStyles(Color);
  const [phoneFromList, setPhoneFromList] = useState<string>('');
  const navigation = useNavigation();


  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const dispatch = useAppDispatch();
  const {setUserId} = useAuth();
  const {loading, loginError, userData} = UserSelectors();
  const [contactNumbers, setContactNumbers] = useState<any[]>([]);
  const [phoneModal, showNumberModal] = useState(false);
  const [countryCode, setCountryCode] = useState('+91');

  async function checkPhonePermission() {
    const hasPermission = await requestPhoneNumPermission();
    if (hasPermission) {
      const NumberDetails = await SimCardsManagerModule.getSimCards({
        title: 'App Permission',
        message: 'This app needs read your phone number',
        buttonNeutral: 'Not now',
        buttonNegative: 'Not OK',
        buttonPositive: 'OK',
      });
      setContactNumbers([...NumberDetails]);
      if (NumberDetails?.length > 1) {
        showNumberModal(true);
      } else {
        if (
          checkCodeExistence(NumberDetails[0]?.isoCountryCode?.toUpperCase())
            ?.exists
        ) {
          let foundItem = checkCodeExistence(
            NumberDetails[0]?.isoCountryCode?.toUpperCase(),
          );

          let validatedPhoneNumber = validatePhoneNumber(
            NumberDetails[0]?.phoneNumber,
            foundItem?.dialCode,
          );
          setPhoneNumber(validatedPhoneNumber);
          setPhoneFromList(validatedPhoneNumber);
          setCountryCode(foundItem?.dialCode);
        } else {
          setCountryCode('');
          setPhoneNumber(NumberDetails[0]?.phoneNumber);
          setPhoneFromList(NumberDetails[0]?.phoneNumber);
        }
      }
    }
  }

  useEffect(() => {
    checkPhonePermission();
  }, []);

  useEffect(() => {
    console.log('loginError ', loginError);
    if (loginError?.status === 400 || loginError?.status === 404) {
      setErrorMsg(loginError?.message);
      dispatch(resetLoginData());
    }
  }, [loginError]);

  function connect(token: string) {
    // Start the connection
    // const URL = "wss://bedev.dint.com/ws/conversation/global/";
    // const origin = "https://bedev.dint.com";
    // const ws = new WebSocket(URL + "?token=" + token);
    // ws.onopen = function () {
    //   console.log("opened:");
    //   setSocketConnection(ws);
    //   setCurrentInstanceSocket(0);
    // };
  }
  //   const ws = new WebSocket(URL, null, {
  //     headers: {
  //       Origin: origin,
  //       Authorization: token,
  //     },
  //   });

  //   ws.onopen = function () {
  //     console.log("connection is online:");
  //     setSocketConnection(ws);
  //     setCurrentInstanceSocket(0);
  //   };
  // }

  const onLoginClick = useCallback(async () => {
    navigation.navigate('ScanQR');
    const fcmToken = await getDataFromAsync('fcmToken');
    if (!phoneNumber) {
      setErrorMsg('Phone number is required');
      return;
    } else {
      setErrorMsg('');
    }
    dispatch(
      loginUserAPI({
        phone_no: countryCode + phoneNumber,
        fire_base_auth_key: fcmToken || '',
      }),
    );
  }, [phoneModal, phoneNumber, countryCode, phoneFromList]);

  const onSignUpPress = () => {
    navigation.navigate('OnBoardingScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={'padding'} style={styles.bodyContainer}>
        <View>
          <Image
            resizeMode={'cover'}
            style={styles.logoImg}
            source={Images.headerLogo}
          />
          {/* {contactNumbers?.length === 0 && ( */}
          <PhoneInputField
            value={phoneNumber}
            onChangeText={(number: string, code: string) => {
              console.log(number + 'and ' + code);
              setPhoneNumber(number), setCountryCode(code), setErrorMsg('');
            }}
            placeholder={'Enter Mobile Number'}
            label={'Mobile Number'}
          />
          {/* )} */}

          {phoneFromList?.length > 0 && (
            <PhoneInputField
              value={phoneFromList}
              onChangeText={(number: string, code: string) => {
                console.log(number + 'and ' + code);
                setPhoneFromList(number);
                setPhoneNumber(number), setCountryCode(code), setErrorMsg('');
              }}
              placeholder={'Enter Mobile Number'}
              label={'Mobile Number'}
              doNotEdit
              onPressField={() => showNumberModal(true)}
            />
          )}

          <View style={styles.forgotPasswordContainer}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {/* <Checkbox isSelected /> */}
              <Text style={{color: Color.black, marginStart: ms(10)}}>
                Remember me
              </Text>
            </View>

            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </View>
          <Text style={styles.errorMsg}>
            {errorMsg ? errorMsg : loginError ? loginError?.message : ''}
          </Text>
          <Button
            text="Login"
            btnStyle={styles.btnContainer}
            onPress={onLoginClick}
          />
          <View style={styles.signUpContainer}>
            <Text style={styles.dontHaveAnAccount}>
              Don't Have An Account?{' '}
            </Text>
            <Text onPress={onSignUpPress} style={styles.signUp}>
              Sign Up
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>

      <Loader visible={loading} />

      {contactNumbers?.length > 0 && phoneModal && (
        <PhoneNumbersModal
          data={contactNumbers}
          isVisible={phoneModal}
          hideModal={() => {
            showNumberModal(false), setContactNumbers([]);
            setPhoneFromList('');
            setCountryCode('');
          }}
          onPressNumber={(item: any) => {
            showNumberModal(false);
            if (
              checkCodeExistence(item?.isoCountryCode?.toUpperCase())?.exists
            ) {
              let foundItem = checkCodeExistence(
                item?.isoCountryCode?.toUpperCase(),
              );
              let validatedPhoneNumber = validatePhoneNumber(
                item?.phoneNumber,
                foundItem?.dialCode,
              );
              setPhoneNumber(validatedPhoneNumber);
              setPhoneFromList(validatedPhoneNumber);
              setCountryCode(foundItem?.dialCode);
            } else {
              setCountryCode('');
              setPhoneNumber(item?.phoneNumber);
              setPhoneFromList(item?.phoneNumber);
            }
          }}
        />
      )}
    </SafeAreaView>
  );
};

const screenStyles = (Color: any) => {
  return StyleSheet.create({
    container: {flex: 1, backgroundColor: Color.plain_white},
    bodyContainer: {
      flex: 1,
      paddingHorizontal: ms(16),
      paddingVertical: ms(16),
      backgroundColor: Color.plain_white,
    },
    logoImg: {
      width: ms(40),
      height: ms(40),
      marginBottom: hp(8),
    },
    textPassInputStyle: {
      marginTop: vs(10),
    },
    textInputStyle: {
      marginTop: vs(32),
    },
    errorMsg: {
      color: 'red',
      marginTop: 10,
    },
    forgotPasswordContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: hp(8),
    },
    forgotPassword: {color: Color.black, fontWeight: '700'},
    btnContainer: {
      marginTop: vs(30),
    },
    signUpContainer: {
      flexDirection: 'row',
      marginTop: vs(10),
      alignSelf: 'center',
    },
    signUp: {
      color: Color.black,
      fontSize: mvs(14),
      fontWeight: '700',
    },
    dontHaveAnAccount: {fontSize: mvs(14), color: Color.black},
  });
};

export default Login;
