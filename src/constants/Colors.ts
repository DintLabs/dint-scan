/**
 * Declare all the color codes here.
 */

export const defaultTheme = {
  theme: "light",
  white: "#FFFFFF",
  black: "#000000",
  primary: "#FFDD55",
  primaryDark: "#FEC834",
  border: "#dcdcdc",
  transparent: "#00000000",
  messageBackgroundReceiver: "#FFE88E",
  messageBackgroundSender: "#D4D0CB40",
  backgroundColor: "#EFEFF4",
  dark_theme: "#363636",
  placeholder: "#353535",
  light_grey: "#707991",
  plain_white: "#FFFFFF",
  disabled: "#959595",
  grey: "#A3A3A3",
  time_grey: "#8A91A8",
  borderLine: "#3C3C43",
  grey_transparent: "rgba(0,0,0,0.7)",
  shaded_white: "#EFEFF4",
  chock_black: "#000000",
  search_back: "#76768012",
  search_text: "#3C3C4360",
  text_black: "#000000",
  arrow_icon: "#3C3C4330",
  add_pic_grey: "#D9D9D9",
  input_background: "#FFFFFF",
  purple_theme: "#D4D0CB40",
  inputPlaceholder: "#B4B4B4",
  image_back: "#2A2C2E",
  success_color: "#008000",
  descriptionColor: "#2A2C2E",
  deleteBtnColor: "#D9D9D9",
  deleteBtnTitle: "#D60101",
  callingBackgroundColor: "#242525",
  callingTitleColor: "#F3FFFF",
  fixedWhite: "#FFFFFF",
  red: "#C40505",
};

export const darkTheme = {
  theme: "dark",
  white: "#252525",
  black: "#FFFFFF",
  primary: "#FFDD55",
  primaryDark: "#FEC834",
  border: "#dcdcdc",
  transparent: "#00000000",
  messageBackgroundReceiver: "#5D5C5A",
  messageBackgroundSender: "#ACACAC",
  backgroundColor: "#000000",
  dark_theme: "#363636",
  placeholder: "#FFFFFF",
  light_grey: "#C6C6C6",
  plain_white: "#000000",
  disabled: "#959595",
  grey: "#C0C0C0",
  time_grey: "#8A91A8",
  borderLine: "#FFFFFF",
  grey_transparent: "rgba(255,255,255,0.6)",
  shaded_white: "#EFEFF4",
  chock_black: "#000000",
  search_back: "#5D5C5A",
  search_text: "#ffffff60",
  text_black: "#8E8E93",
  arrow_icon: "#FFFFFF30",
  add_pic_grey: "#D9D9D9",
  input_background: "#5D5C5A",
  purple_theme: "#4804A8",
  inputPlaceholder: "#B4B4B4",
  image_back: "#2A2C2E",
  success_color: "#008000",
  descriptionColor: "#BDBDBD",
  deleteBtnColor: "#898A8D",
  deleteBtnTitle: "#D60101",
  callingBackgroundColor: "#242525",
  callingTitleColor: "#F3FFFF",
  fixedWhite: "#FFFFFF",
  red: "#C40505",
};

enum COLOR_SCHEME {
  LIGHT = "light",
  DARK = "dark",
}

export const COLORS = {
  [COLOR_SCHEME.LIGHT]: defaultTheme,
  [COLOR_SCHEME.DARK]: darkTheme,
};

export const getCurrentTheme = (theme: string | "dark") => {
  return COLORS[theme === "dark" ? COLOR_SCHEME.DARK : COLOR_SCHEME.LIGHT];
};
