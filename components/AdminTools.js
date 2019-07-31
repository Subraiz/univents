import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  FlatList,
  Alert
} from "react-native";
import QRCodeScannerModal from "./QRCodeScannerModal";
import {
  addUserAttended,
  getYearData,
  getSexData,
  getTimeData,
  getSchoolData
} from "../classes/EventFunctions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { updateEventData, deleteEvent } from "../redux/actions/EventActions";
import {
  storeLocalEvents,
  fetchUserEvents
} from "../redux/actions/EventsActions";
import Icon from "react-native-vector-icons/Ionicons";
import {
  VictoryBar,
  VictoryChart,
  VictoryTheme,
  VictoryPie
} from "victory-native";
import * as Animatable from "react-native-animatable";
import SegmentedControlTab from "react-native-segmented-control-tab";
import Swiper from "react-native-swiper";
import LottieView from "lottie-react-native";

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
    scannerActive: false,
    selectedIndex: 0,
    currentIndex: 0
  };

  constructor(props) {
    super(props);
  }

  handleIndexChange = index => {
    this.dataList.scrollToIndex({ index: index });
    this.setState({ selectedIndex: index, currentIndex: index });
  };

  componentWillMount() {
    const { navigation } = this.props;
    event = navigation.getParam("data", "NO-DATA");
    if (event.eventData.currentAttendance != 0) {
      this.timeData = getTimeData(event);
      this.sexData = getSexData(event);
      this.yearData = getYearData(event);
      this.schoolData = getSchoolData(event);
    }
  }

  onPress() {
    this.setState({ scannerActive: !this.state.scannerActive });
  }

  async onDelete() {
    Alert.alert(
      "Warning",
      "Are you sure you want to delete this event?",
      [
        {
          text: "Delete",
          onPress: async () => {
            let index = this.props.localCreatedEvents.indexOf(event);
            this.props.localCreatedEvents.splice(index, 1);
            this.props.storeLocalEvents(
              this.props.localCreatedEvents,
              "createdEvents"
            );
            await this.props.deleteEvent(event, this.props.user.uid);
            this.props.navigation.navigate("Explore");
          }
        },
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel"
        }
      ],
      { cancelable: false }
    );
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
      this.timeData = getTimeData(event);
      this.sexData = getSexData(event);
      this.yearData = getYearData(event);
      this.props.updateEventData(event, "MA");
      this.scanner.showMessage();
    } else {
      this.scanner.showErrorMessage();
    }
  }

  renderDataTab(item, i) {
    if (item == "Attendance") {
      return (
        <View style={{ marginTop: -30 }}>
          <VictoryChart
            theme={VictoryTheme.material}
            width={screenWidth}
            style={{
              axis: { stroke: "#756f6a" },
              axisLabel: { fontSize: 20, padding: 30 },
              grid: { stroke: t => (t > 0.5 ? "red" : "grey") },
              ticks: { stroke: "grey", size: 5 },
              tickLabels: { fontSize: 15, padding: 5 }
            }}
          >
            <VictoryBar
              animate={{
                duration: 2000,
                onLoad: { duration: 1000 }
              }}
              width={340}
              barWidth={340 / this.timeData.length - 6}
              style={{ data: { fill: "#92C83D", width: 30 } }}
              data={this.timeData}
              alignment="start"
              x="time"
              y="earnings"
              domain={{ y: [0, event.eventData.currentAttendance] }}
            />
          </VictoryChart>
        </View>
      );
    } else if (item == "Gender") {
      return (
        <VictoryPie
          innerRadius={20}
          labelRadius={55}
          width={screenWidth}
          style={{
            labels: { fill: "white", fontSize: 14, fontWeight: "500" }
          }}
          data={this.sexData}
        />
      );
    } else if (item == "Year") {
      return (
        <VictoryPie
          innerRadius={20}
          labelRadius={50}
          width={screenWidth}
          style={{
            labels: { fill: "white", fontSize: 14, fontWeight: "500" }
          }}
          data={this.yearData}
        />
      );
    } else {
      return (
        <VictoryPie
          innerRadius={5}
          labelRadius={20}
          width={screenWidth}
          style={{
            labels: { fill: "white", fontSize: 13, fontWeight: "500" }
          }}
          data={this.schoolData}
        />
      );
    }
  }

  renderData() {
    if (event.eventData.currentAttendance != 0) {
      return (
        <View>
          <View style={styles.container}>
            <View style={styles.attendanceContainer}>
              <Text style={styles.dataHeader}>Traffic</Text>
              <View style={styles.horizontalLine} />
            </View>
            <View style={styles.eventInformationContainer}>
              <Text style={styles.infoTextStyle}>{event.eventName}</Text>
              <Text style={styles.infoTextStyle}>{event.eventHost}</Text>
              <Text style={styles.infoTextStyle}>{returnTime(event)}</Text>
            </View>
            <Text
              style={{
                paddingLeft: 15,
                fontFamily: "PublicSans-Bold",
                fontSize: 15,
                marginTop: 5
              }}
            >
              Number of Attendees
            </Text>
            {this.renderDataTab("Attendance", 0)}
          </View>
          <View style={styles.container}>
            <View style={styles.attendanceContainer}>
              <Text style={styles.dataHeader}>Gender</Text>
              <View style={styles.horizontalLine} />
            </View>
            {this.renderDataTab("Gender", 0)}
          </View>

          <View style={styles.container}>
            <View style={styles.attendanceContainer}>
              <Text style={styles.dataHeader}>School Years</Text>
              <View style={styles.horizontalLine} />
            </View>
            {this.renderDataTab("Year", 0)}
          </View>

          <View style={styles.container}>
            <View style={styles.attendanceContainer}>
              <Text style={styles.dataHeader}>Schools</Text>
              <View style={styles.horizontalLine} />
            </View>
            {this.renderDataTab("School", 0)}
          </View>
        </View>
      );
    } else {
      return (
        <View
          style={{
            alignItems: "center",
            justifyContent: "space-between",
            height: "80%"
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontWeight: "500",
              paddingTop: 30,
              paddingLeft: 30,
              paddingRight: 30,
              fontSize: 16
            }}
          >
            Start scanning users in to view some cool data!
          </Text>

          <LottieView
            style={{
              marginLeft: 20
            }}
            source={require("../assets/animations/qrcode_animation.json")}
            autoPlay
            loop
          />
        </View>
      );
    }
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#F7F7F7" }}>
        <ScrollView>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={this.onPress.bind(this)}
          >
            <Text
              style={{
                color: "black",
                fontFamily: "PublicSans-Regular",
                fontSize: 15
              }}
            >
              QR Scanner
            </Text>
            <Icon name="ios-arrow-forward" style={{ fontSize: 24 }} />
          </TouchableOpacity>
          {this.renderData()}
          <TouchableOpacity
            onPress={this.onDelete.bind(this)}
            style={styles.buttonStyle}
          >
            <Icon
              name="md-trash"
              size={16}
              style={{ color: "white", marginRight: 10 }}
            />
            <Text style={{ fontSize: 15, color: "white", fontWeight: "500" }}>
              Delete This Event
            </Text>
          </TouchableOpacity>

          <QRCodeScannerModal
            ref={scanner => {
              this.scanner = scanner;
            }}
            value={this.props.uid}
            visible={this.state.scannerActive}
            onPress={this.onPress.bind(this)}
            onRead={this.onRead.bind(this)}
          />
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    localCreatedEvents: state.userEvents.createdEvents
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      updateEventData: updateEventData,
      storeLocalEvents: storeLocalEvents,
      deleteEvent: deleteEvent,
      fetchUserEvents: fetchUserEvents
    },
    dispatch
  );
};

const styles = {
  buttonContainer: {
    width: screenWidth,
    padding: 15,
    marginTop: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "white",
    alignSelf: "center",
    shadowOffset: { width: 2, height: 2 }
  },
  container: {
    width: screenWidth,
    backgroundColor: "white",
    marginTop: 20,
    marginBottom: 20,
    paddingVertical: 15,
    zIndex: 2
  },
  buttonStyle: {
    display: "flex",
    width: 200,
    bottom: 20,
    marginTop: 20,
    backgroundColor: "red",
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 15,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row"
  },
  attendanceContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 15,
    paddingLeft: 15
  },
  horizontalLine: {
    height: 2,
    flex: 1,
    marginLeft: 5,
    marginRight: 10,
    backgroundColor: "#92C83D",
    marginTop: 3
  },
  dataHeader: {
    fontSize: 19,
    fontFamily: "PublicSans-SemiBold"
  },
  eventInformationContainer: {
    marginLeft: 15,
    marginTop: 10
  },
  infoTextStyle: {
    fontFamily: "PublicSans-ExtraLight",
    color: "rgba(0,0,0,.7)",
    marginBottom: 3
  }
};

function returnTime(event) {
  let startTimeArray = event.eventTime.startTime.split(":");
  let endTimeArray = event.eventTime.endTime.split(":");

  let startHour;
  let startMinute;
  let endHour;
  let endMinute;

  let startTimeOfDay = "AM";
  let endTimeOfDay = "AM";

  startHour = parseInt(startTimeArray[0]);
  if (startHour == 0) {
    startHour = 12;
    startTimeOfDay = "AM";
  } else if (startHour > 12) {
    startHour = startHour - 12;
    startTimeOfDay = "PM";
  }
  let startTime = `${startHour}:${startTimeArray[1]}`;

  endHour = parseInt(endTimeArray[0]);
  if (endHour > 12) {
    endHour = endHour - 12;
    endTimeOfDay = "PM";
  } else if (endHour == 0) {
    endHour = 12;
    timeOfDay = "AM";
  }
  let endTime = `${endHour}:${endTimeArray[1]}`;
  let eventTime = `${startTime}${startTimeOfDay}  -  ${endTime}${endTimeOfDay}`;
  return eventTime;
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdminTools);
