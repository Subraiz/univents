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
  getTimeData
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

const data = [
  { time: "6:00", earnings: 20 },
  { time: "6:15", earnings: 25 },
  { time: "6:30", earnings: 20 }
];

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
            this.props.navigation.navigate("Events");
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
    if (item.item == "Attendance") {
      return (
        <View style={styles.container}>
          <VictoryChart width={screenWidth} theme={VictoryTheme.material}>
            <VictoryBar
              animate={{
                duration: 2000,
                onLoad: { duration: 1000 }
              }}
              width={340}
              barWidth={340 / this.timeData.length - 6}
              data={this.timeData}
              alignment="start"
              x="time"
              y="earnings"
            />
          </VictoryChart>
        </View>
      );
    } else if (item.item == "Sex") {
      return (
        <View style={styles.container}>
          <VictoryPie
            innerRadius={20}
            labelRadius={55}
            width={screenWidth}
            height={screenWidth * 1.3}
            style={{
              labels: { fill: "white", fontSize: 14, fontWeight: "500" }
            }}
            data={this.sexData}
          />
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <VictoryPie
            innerRadius={20}
            labelRadius={50}
            width={screenWidth}
            height={screenWidth * 1.3}
            style={{
              labels: { fill: "white", fontSize: 14, fontWeight: "500" }
            }}
            data={this.yearData}
          />
        </View>
      );
    }
  }

  renderData() {
    if (event.eventData.currentAttendance != 0) {
      return (
        <View>
          <View
            style={{
              width: screenWidth * 0.75,
              marginTop: 20,
              alignSelf: "center"
            }}
          >
            <SegmentedControlTab
              values={["Attendance", "Sex", "Class Year"]}
              selectedIndex={this.state.selectedIndex}
              onTabPress={this.handleIndexChange.bind(this)}
            />
          </View>
          <FlatList
            ref={dataList => (this.dataList = dataList)}
            data={["Attendance", "Sex", "Year"]}
            renderItem={(item, index) => this.renderDataTab(item, index)}
            horizontal={true}
            keyExtractor={(item, index) => index.toString()}
            scrollEnabled={false}
          />
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
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={this.onPress.bind(this)}
        >
          <Text style={{ color: "navy", fontWeight: "600" }}>
            Track Attendance
          </Text>
        </TouchableOpacity>
        {this.renderData()}
        <QRCodeScannerModal
          ref={scanner => {
            this.scanner = scanner;
          }}
          value={this.props.uid}
          visible={this.state.scannerActive}
          onPress={this.onPress.bind(this)}
          onRead={this.onRead.bind(this)}
        />
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
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    width: screenWidth,
    height: 400
  },
  buttonStyle: {
    position: "absolute",
    bottom: 30,
    display: "flex",
    width: 200,
    left: screenWidth * 0.5 - 100,
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
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdminTools);
