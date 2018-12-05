import React from "react";
import { TouchableOpacity, Text, View, Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const Button = props => {
  return (
    <TouchableOpacity
      activeOpacity={props.activeOpacity || 0.4}
      onPress={props.onPress}
    >
      <View
        style={[
          {
            width: screenWidth * 0.7,
            backgroundColor: "red",
            alignItems: "center",
            borderRadius: 30
          },
          props.style
        ]}
      >
        <Text
          style={{
            color: "white",
            padding: 20,
            fontSize: 18,
            fontWeight: "700"
          }}
        >
          {props.title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export { Button };
