import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

let dimensions = {
  screenWidth: screenWidth,
  screenHeight: screenHeight
};

export default dimensions;
