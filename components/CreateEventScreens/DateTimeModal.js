import React, { Component } from "react";
import {
  Text,
  View,
  Modal,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Button
} from "react-native";
import { Calendar, CalendarList, Agenda } from "react-native-calendars";
import DateTimePicker from "react-native-modal-datetime-picker";
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
  state = {
    startTime: "Start Time",
    endTime: "End Time",
    realStartTime: "",
    realEndTime: "",
    selected: "",
    isStartTimePickerVisible: false,
    isEndTimePickerVisible: false,
    interval: 15,
    dayOrder: 0,
    timeOrder: 0
  };

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

    let dayOrder = year + monthIndex / 11 + day / 1000;

    this.setState({ dayOrder: dayOrder });

    this.props.updateEventInfo({ prop: "eventDate", value: eventDate });
  }

  showStartTimePicker = () => this.setState({ isStartTimePickerVisible: true });

  hideStartTimePicker = () =>
    this.setState({ isStartTimePickerVisible: false });

  handleStartTimePicked = time => {
    let timeOfDay = "AM";
    let hour = time.getHours();
    let realHour = time.getHours();

    if (hour > 12) {
      hour = hour - 12;
      timeOfDay = "PM";
    }

    if (hour == 12) {
      timeOfDay = "PM";
    }

    if (hour == 0) {
      hour = 12;
      timeOfDay = "AM";
    }

    if (minutes % 15 != 0) {
      minutes = minutes - [minutes % 15];
    }
    if (minutes < 10) {
      minutes = `0${minutes}`;
    }
    let startTime = `${hour}:${minutes}${timeOfDay}`;
    let realTime = `${realHour}:${minutes}`;
    this.props.updateEventInfo({
      prop: "eventTime",
      value: { startTime: realTime, endTime: this.state.realEndTime }
    });
    this.setState({ startTime: startTime, realStartTime: realTime });
    this.hideStartTimePicker();
  };

  showEndTimePicker = () => this.setState({ isEndTimePickerVisible: true });

  hideEndTimePicker = () => this.setState({ isEndTimePickerVisible: false });

  handleEndTimePicked = time => {
    let timeOfDay = "AM";
    let hour = time.getHours();
    let realHour = time.getHours();
    if (hour > 12) {
      hour = hour - 12;
      timeOfDay = "PM";
    }

    if (hour == 12) {
      timeOfDay = "PM";
    }
    if (hour == 0) {
      hour = 12;
      timeOfDay = "AM";
    }
    let minutes = time.getMinutes();
    let fractionMinutes = parseInt(minutes) / 60;
    let timeOrder = parseInt(realHour) + fractionMinutes;
    this.setState({ timeOrder: timeOrder });

    if (minutes % 15 != 0) {
      minutes = minutes - [minutes % 15];
    }
    if (minutes < 10) {
      minutes = `0${minutes}`;
    }
    let endTime = `${hour}:${minutes}${timeOfDay}`;
    let realTime = `${realHour}:${minutes}`;
    this.props.updateEventInfo({
      prop: "eventTime",
      value: { startTime: this.state.realStartTime, endTime: realTime }
    });
    this.setState({ endTime: endTime, realEndTime: realTime });
    this.hideEndTimePicker();
  };

  onCloseModal() {
    let eventOrder = this.state.dayOrder + this.state.timeOrder / 100000;
    eventOrder = Math.floor(eventOrder * 1000000) / 1000000;

    this.props.updateEventInfo({ prop: "eventOrder", value: eventOrder });
    this.props.onClose();
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
            onPress={this.onCloseModal.bind(this)}
            activeOpacity={1}
            style={{
              width: screenWidth,
              flex: 1
            }}
          />
          <TouchableOpacity
            style={styles.buttonStyle}
            activeOpacity={0.8}
            onPress={this.onCloseModal.bind(this)}
          >
            <Icon name="close" color="navy" />
          </TouchableOpacity>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: screenWidth,
              height: screenHeight * 0.1,
              backgroundColor: "white",
              borderBottomWidth: 3,
              borderBottomColor: "#F7F7F7"
            }}
          >
            <View
              style={{
                width: "50%",
                borderRightWidth: 0.5,
                borderRightColor: "grey",
                padding: 10
              }}
            >
              <Button
                title={this.state.startTime}
                onPress={this.showStartTimePicker.bind(this)}
              />
            </View>
            <View
              style={{
                width: "50%",
                borderLefttWidth: 0.5,
                borderLeftColor: "grey",
                padding: 10
              }}
            >
              <Button
                title={this.state.endTime}
                onPress={this.showEndTimePicker.bind(this)}
              />
            </View>
          </View>
          <View style={{ backgroundColor: "#F7F7F7" }}>
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
          </View>
          <DateTimePicker
            minuteInterval={this.state.interval}
            isVisible={this.state.isStartTimePickerVisible}
            onConfirm={this.handleStartTimePicked}
            onCancel={this.hideStartTimePicker}
            mode="time"
            titleIOS="Select Time"
            is24Hour={false}
          />
          <DateTimePicker
            minuteInterval={this.state.interval}
            isVisible={this.state.isEndTimePickerVisible}
            onConfirm={this.handleEndTimePicked}
            onCancel={this.hideEndTimePicker}
            mode="time"
            titleIOS="Select Time"
            is24Hour={false}
          />
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
