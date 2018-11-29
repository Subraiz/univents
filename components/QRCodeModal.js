import React from "react";
import { Text, View, Modal, TouchableOpacity, Dimensions } from "react-native";
import QRCode from "react-native-qrcode";

const screenWidth = Dimensions.get("window").width;

const QRCodeModal = ({ children, visible, onPress, value }) => {
  const { containerStyle, textStyle, cardSectionStyle } = styles;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={() => {}}
      transparent={true}
    >
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.95}
        style={styles.containerStyle}
      >
        <QRCode
          value={value}
          size={screenWidth * 0.8}
          bgColor="black"
          fgColor="white"
        />
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
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    position: "relative",
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
};

export default QRCodeModal;
