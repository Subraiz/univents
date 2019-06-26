import React from "react";
import { Text, View, Modal, TouchableOpacity, Dimensions } from "react-native";
import QRCode from "react-native-qrcode";
import * as Animatable from "react-native-animatable";

const screenWidth = Dimensions.get("window").width;

const QRCodeModal = ({ children, visible, onPress, value }) => {
  const { containerStyle, textStyle, cardSectionStyle } = styles;
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => {}}
      transparent={true}
    >
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.95}
        style={styles.containerStyle}
      >
        <Animatable.View animation="slideInUp" delay={200} duration={500}>
          <QRCode
            value={value}
            size={screenWidth * 0.8}
            bgColor="black"
            fgColor="white"
          />
        </Animatable.View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = {
  textStyle: {
    flex: 1,
    fontSize: 18,
    textAlign: "center",
    lineHeight: 40
  },
  containerStyle: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    position: "relative",
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
};

export default QRCodeModal;
