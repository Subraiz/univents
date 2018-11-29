import React from "react";
import { View, Text, Image } from "react-native";

export default (CustomMarker = props => {
  return (
    <View style={styles.container}>
      <View style={styles.outerCircle} />
      <View style={styles.circles}>
        <View style={styles.innerCircle}>
          <Image
            style={styles.logoStyle}
            source={require("../assets/images/bostonCollegeLogo.png")}
          />
        </View>
      </View>
      <View style={styles.triangleContainer}>
        <View style={styles.triangle} />
      </View>
    </View>
  );
});

const styles = {
  container: {
    width: 50,
    height: 75,
    flexDirection: "column",
    alignItems: "center"
  },
  circles: {
    height: 36,
    alignItems: "center",
    justifyContent: "center"
  },
  innerCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "white",
    padding: 2
  },
  outerCircle: {
    position: "absolute",
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "orange"
  },
  triangleContainer: {
    alignItems: "center",
    marginTop: -4
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 26,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "orange",

    position: "absolute"
  },
  logoStyle: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: "contain"
  }
};
