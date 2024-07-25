import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';
import {requestCameraPermissions} from './src/utils/Permission';

function ScanQRScreen() {
  const device = useCameraDevice('back');
  const {hasPermission} = useCameraPermission();
  const [isScanning, setIsScanning] = useState(true);

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'upc-a'],
    onCodeScanned: codes => {
      if (isScanning) {
        setIsScanning(false);
        for (const code of codes) {
          console.log(code);
        }
        Alert.alert('QR Code Scanned', 'A QR code has been scanned.', [
          {text: 'OK', onPress: () => setIsScanning(true)},
        ]);
      }
    },
  });

  if (!hasPermission) {
    console.log(' ---hasPermission---> ',hasPermission )
    requestCameraPermissions();
    Camera.requestCameraPermission().then(()=>{
      console.log(' ---permission granted---> ')
    }).catch((err)=>{
      console.log(' ---no permission---> ')
    })
    return console.log(' ---no permission---> ');
  }
  if (device == null) return console.log(' ---no camera---> ');
  return (
    <View style={{flex: 1}}>
    <Camera
      style={StyleSheet.absoluteFill}
      device={device}
      isActive={isScanning}
      codeScanner={codeScanner}
    />
    </View>
  );
}

const styles = StyleSheet.create({});

export default ScanQRScreen;