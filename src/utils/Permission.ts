import { Platform } from "react-native";
import { PERMISSIONS, requestMultiple, RESULTS } from "react-native-permissions";

const PERMISSIONS_RESULTS = Object({
    UNAVAILABLE: 'unavailable',
    BLOCKED: 'blocked',
    DENIED: 'denied',
    GRANTED: 'granted',
    LIMITED: 'limited',
  });


const resolvePermision = (permissions: Array<any>) => {
    let PERM_STATUS = PERMISSIONS_RESULTS.GRANTED;
  
    if (Array.isArray(permissions) && permissions.length) {
      PERM_STATUS = PERMISSIONS_RESULTS.GRANTED;
      for (let index = 0; index < permissions.length; index++) {
        // consoleLog('permissions[index]', permissions[index]);
        if (permissions[index] == RESULTS.DENIED) {
          PERM_STATUS = PERMISSIONS_RESULTS.DENIED;
          break;
        } else if (permissions[index] == RESULTS.BLOCKED) {
          PERM_STATUS = PERMISSIONS_RESULTS.BLOCKED;
          break;
        }
      }
    } else {
      PERM_STATUS = PERMISSIONS_RESULTS.BLOCKED;
    }

    console.log(' --PERM_STATUS----> ',PERM_STATUS )
  
    return PERM_STATUS;
  };

  

export const requestCameraPermissions = () => {
    return new Promise(resolve => {
      requestMultiple([PERMISSIONS.ANDROID.CAMERA, PERMISSIONS.IOS.CAMERA])
        .then((statuses: any) => {
          let PERM_STATUS = PERMISSIONS_RESULTS.BLOCKED;
          if (Platform.OS === 'android') {
            PERM_STATUS = resolvePermision([
              statuses[PERMISSIONS.ANDROID.CAMERA],
            ]);
          } else if (Platform.OS === 'ios') {
            PERM_STATUS = resolvePermision([statuses[PERMISSIONS.IOS.CAMERA]]);
            console.log(' ----ios PERM_STATUS--> ',PERM_STATUS )
          }
          if (PERM_STATUS === PERMISSIONS_RESULTS.BLOCKED) {
            resolve(PERM_STATUS);
            // permissionDeniedBlockedAlert();
          } else {
            resolve(PERM_STATUS);
          }
        })
        .catch(err => {
            console.log(' ---err---> ', err)
          // resolve(false);
          resolve(PERMISSIONS_RESULTS.BLOCKED);
        });
    });
  };