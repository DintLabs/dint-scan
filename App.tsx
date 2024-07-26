import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ScanQR from './src/screens/ScanQR';
import Login from './src/screens/Login';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './src/store';
import { AuthProvider } from './src/contexts/AuthContext';


const Stack = createNativeStackNavigator();

function App() {
  return (
    <ThemeProvider>
<AuthProvider>

<Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
            <NavigationContainer>
      <Stack.Navigator>
        
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="ScanQR" component={ScanQR} />
      </Stack.Navigator>
    </NavigationContainer>
            </PersistGate>
          </Provider>
          </AuthProvider>
    </ThemeProvider>
  );
}

export default App;


// import React from 'react';
// import {Text, View} from 'react-native';

// const HelloWorldApp = () => {
//   return (
//     <View
//       style={{
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//       }}>
//       <Text>Hello, world!</Text>
//     </View>
//   );
// };
// export default HelloWorldApp;