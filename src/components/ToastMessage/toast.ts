import Toast from "react-native-toast-message";

export const showToastError = (message: string) => {
  Toast?.show({
    text1: "Error",
    text2: message,
    type: "error",
  });
};

export const showToastSuccess = (message: string) => {
  Toast?.show({
    text1: "Success",
    text2: message,
  });
};
