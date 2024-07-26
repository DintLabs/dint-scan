import {
  createNotification,
  handleNotificationOpenedApp,
} from "./NotificationLisenters";
import messaging from "@react-native-firebase/messaging";
import { useEffect } from "react";

const NotificationsBanners = () => {
  const showNotification = (notification: any) => {
    console.log("onMessage banner ", notification);
    createNotification(notification);
  };

  useEffect(() => {
    messaging().getInitialNotification().then(handleNotificationOpenedApp);
    messaging().onNotificationOpenedApp(handleNotificationOpenedApp);
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      // When app in foreground
      console.log("Message handled in the foregroud!", remoteMessage);
      showNotification(remoteMessage);
    });

    return () => {
      return unsubscribe;
    };
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().setBackgroundMessageHandler(
      async (remoteMessage) => {
        console.log("msggg banner ", remoteMessage);
        //call count here
        showNotification(remoteMessage);
      }
    );
    return () => {
      return unsubscribe;
    };
  }, []);

  return null;
};

export default NotificationsBanners;
