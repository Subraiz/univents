import React, { Component } from "react";
import {
  Text,
  View,
  Modal,
  TouchableOpacity,
  Dimensions,
  SafeAreaView
} from "react-native";
import { Calendar, CalendarList, Agenda } from "react-native-calendars";
import { Icon } from "react-native-elements";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { updateEventInfo } from "../../redux/actions/EventActions";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

class DateTimeModal extends Component {
  state = {};

  onDayPress(date) {
    this.setState({ selected: date.dateString });
    let day = date.day;
    let monthIndex = parseInt(date.month, 10) - 1;
    let month = months[monthIndex];
    let year = date.year;

    let eventDate = {
      month: month,
      day: day,
      year: year
    };
    this.props.updateEventInfo({ prop: "eventDate", value: eventDate });
  }

  render() {
    return (
      <Modal
        visible={this.props.visible}
        transparent
        animationType="slide"
        onRequestClose={() => {}}
        transparent={true}
      >
        <SafeAreaView style={styles.container}>
          <TouchableOpacity
            style={styles.buttonStyle}
            activeOpacity={0.8}
            onPress={this.props.onClose}
          >
            <Icon name="close" color="navy" />
          </TouchableOpacity>
          <View style={styles.calendarContainer}>
            <CalendarList
              markedDates={{
                [this.state.selected]: {
                  selected: true,
                  disableTouchEvent: true,
                  selectedDotColor: "orange"
                }
              }}
              onDayPress={this.onDayPress.bind(this)}
            />
          </View>
        </SafeAreaView>
      </Modal>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ updateEventInfo: updateEventInfo }, dispatch);
};

const mapStateToProps = state => {
  let { eventDate, eventTime } = state.event;
  return {
    event: state.event,
    eventDate: eventDate,
    eventTime: eventTime
  };
};

const styles = {
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, .1)"
  },
  calendarContainer: {
    height: screenHeight * 0.45
  },
  buttonStyle: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    width: 100,
    height: 40,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    backgroundColor: "white"
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DateTimeModal);
