import React from "react";
import { Text, View, Modal, TouchableOpacity, Dimensions } from "react-native";
import QRCodeScanner from "react-native-qrcode-scanner";
import { Icon } from "react-native-elements";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const QRCodeScannerModal = ({ children, visible, onPress, value, onRead }) => {
  const { containerStyle, textStyle, cardSectionStyle } = styles;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={() => {}}
      transparent={true}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.2)"
        }}
      >
        <View
          style={{
            height: screenHeight * 0.75,
            width: screenWidth * 0.9,
            alignItems: "center"
          }}
        >
          <QRCodeScanner
            containerStyle={{ height: "100%" }}
            onRead={onRead}
            reactivate={true}
            reactivateTimeout={1500}
            showMarker={true}
            fadeIn={false}
            bottomContent={
              <TouchableOpacity
                style={styles.buttonTouchable}
                onPress={onPress}
              >
                <Icon name="close" color="blue" />
              </TouchableOpacity>
            }
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = {
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: "#777"
  },
  textBold: {
    fontWeight: "500",
    color: "#000"
  },
  buttonText: {
    fontSize: 21,
    color: "rgb(0,122,255)"
  },
  buttonTouchable: {
    padding: 8,
    borderRadius: 30,
    backgroundColor: "white",
    shadowOffset: { width: -2, height: -2 },
    shadowColor: "black",
    shadowRadius: 0.4,
    shadowRadius: 1
  }
};

export default QRCodeScannerModal;
