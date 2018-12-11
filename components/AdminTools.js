import React, { Component } from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import QRCodeScannerModal from "./QRCodeScannerModal";
import {
  addUserAttended,
  getYearData,
  getSexData
} from "../classes/EventFunctions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { updateEventData } from "../redux/actions/EventActions";
import { storeLocalEvents } from "../redux/actions/EventsActions";
import BarChart from "./DataCharts/BarChart";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

let event = {};
let navigatable = {};

class AdminTools extends Component {
  static navigationOptions = {
    title: "Admin Tools",
    gesturesEnabled: false
  };

  state = {
    scannerActive: false
  };

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const { navigation } = this.props;
    event = navigation.getParam("data", "NO-DATA");
  }

  onPress() {
    this.setState({ scannerActive: !this.state.scannerActive });
  }

  checkIfAttending(userData) {
    var i;
    for (i = 0; i < event.eventData.usersAttended.length; i++) {
      if (event.eventData.usersAttended[i].uid === userData.uid) {
        return true;
      }
    }
    return false;
  }

  onRead(userData) {
    let alreadyAttending = this.checkIfAttending(userData);

    if (!alreadyAttending) {
      addUserAttended(event, userData);
      this.props.updateEventData(event, "MA");

      this.scanner.showMessage();
    } else {
      this.scanner.showErrorMessage();
    }
  }

  renderData() {
    let sexData = getSexData(event);
    let yearData = getYearData(event);
    if (event.eventData.currentAttendance > 0) {
      return (
        <View>
          <Text style={{ fontWeight: "bold" }}>
            Total Attendance: {event.eventData.currentAttendance}
          </Text>
          <Text>Male: {sexData.male * 100}%</Text>
          <Text>Female: {sexData.female * 100}%</Text>
          <Text>Other: {sexData.other * 100}%</Text>
        </View>
      );
    } else {
      return;
    }
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#F7F7F7" }}>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={this.onPress.bind(this)}
        >
          <Text style={{ color: "navy", fontWeight: "600" }}>
            Track Attendance
          </Text>
        </TouchableOpacity>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginTop: 10
          }}
        >
          {this.renderData()}
        </View>
        <QRCodeScannerModal
          ref={scanner => {
            this.scanner = scanner;
          }}
          value={this.props.uid}
          visible={this.state.scannerActive}
          onPress={this.onPress.bind(this)}
          onRead={this.onRead.bind(this)}
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    localCreatedEvents: state.userEvents.localCreatedEvents
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      updateEventData: updateEventData,
      storeLocalEvents: storeLocalEvents
    },
    dispatch
  );
};

const styles = {
  buttonContainer: {
    width: screenWidth * 0.9,
    padding: 15,
    marginTop: 10,
    alignItems: "center",
    backgroundColor: "white",
    alignSelf: "center",
    shadowOffset: { width: 2, height: 2 },
    shadowColor: "black",
    shadowOpacity: 0.4,
    shadowRadius: 2,
    borderRadius: 25
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdminTools);
