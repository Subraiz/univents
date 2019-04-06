import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  Modal,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Button,
  TextInput,
  Picker
} from "react-native";
import * as Animatable from "react-native-animatable";
import LottieView from "lottie-react-native";
import DateTimeModal from "./DateTimeModal";
import LocationModal from "./LocationModal";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { updateEventData } from "../../redux/actions/EventActions";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

class EditEventModal extends Component {
  state = {};

  componentWillMount() {}

  // Make save button active only if info was changed, otherwise disable it.
  renderSaveButton() {
    let infoChanged = false;
    if (infoChanged) {
      return (
        <TouchableOpacity
          style={styles.saveButtonStyle}
          onPress={this._handleAccount.bind(this, "save")}
        >
          <Text style={styles.buttonTextStyle}>Save</Text>
        </TouchableOpacity>
      );
    } else
      return (
        <TouchableOpacity
          disabled={true}
          style={styles.saveButtonStyle}
          onPress={this._handleAccount.bind(this, "save")}
        >
          <Text style={[styles.buttonTextStyle, { color: "grey" }]}>Save</Text>
        </TouchableOpacity>
      );
  }

  // Handle actions to be taking depending on button pressed.
  async _handleAccount(request) {
    if (request == "cancel") {
      //this.setState(this.initialState);
      this.props.onClose();
    } else {
      //this.animation.play();
      this.props.onClose();
    }
  }

  render() {
    return (
      <Modal
        visible={this.props.visible}
        animationType="slide"
        onRequestClose={() => {}}
        transparent={true}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.cancelButtonStyle}
              onPress={this._handleAccount.bind(this, "cancel")}
            >
              <Text style={styles.buttonTextStyle}>Cancel</Text>
            </TouchableOpacity>
            {this.renderSaveButton()}
          </View>
        </SafeAreaView>
      </Modal>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({}, dispatch);
};

const styles = {
  container: {
    flex: 1,
    height: screenHeight,
    backgroundColor: "white"
  },
  header: {
    height: screenHeight * 0.05,
    borderBottomWidth: 1.5,
    borderBottomColor: "#E7E7E7",
    justifyContent: "center"
  },
  cancelButtonStyle: {
    marginLeft: 15,
    width: "auto",
    alignSelf: "flex-start"
  },
  saveButtonStyle: {
    right: 15,
    width: "auto",
    alignSelf: "flex-end",
    position: "absolute"
  },
  buttonTextStyle: {
    color: "rgb(0, 122, 255)",
    fontSize: 16
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditEventModal);
