import { getCurrentTheme } from "constants/Colors";
import { useTheme } from "contexts/ThemeContext";
import React from "react";
import DatePicker from "react-native-date-picker";

type Props = {
  isVisible: boolean;
  handleConfirm?: any;
  hideDatePicker?: any;
  type?: string;
};

const TimePickerModal = ({
  isVisible,
  handleConfirm,
  hideDatePicker,
  type,
}: Props) => {
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");

  return (
    <DatePicker
      mode={type ? type : "datetime"}
      theme={Color?.theme === "dark" ? "dark" : "light"}
      modal
      open={isVisible}
      date={new Date()}
      onConfirm={handleConfirm}
      onCancel={hideDatePicker}
      minimumDate={type === "time" ? undefined : new Date()}
    />
  );
};

export default TimePickerModal;
