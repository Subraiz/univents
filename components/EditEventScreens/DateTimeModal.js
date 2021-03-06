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
    selected: "2019-04-07",
    isStartTimePickerVisible: false,
    isEndTimePickerVisible: false,
    interval: 15,
    dayOrder: 0,
    timeOrder: 0,
    eventDate: {}
  };

  componentDidMount() {
    let year = this.props.date.year;
    let monthIndex = months.indexOf(this.props.date.month) + 1;
    let day = this.props.date.day;
    if (monthIndex < 10) {
      monthIndex = `0${monthIndex}`;
    }
    if (day < 10) {
      day = `0${day}`;
    }
    const dateString = `${year}-${monthIndex}-${day}`;

    let startTimeArray = this.props.time.startTime.split(":");
    let startHour = startTimeArray[0];
    let startMinute = startTimeArray[1];
    let startTimeOfDay = "AM";
    if (startHour > 12) {
      startHour = startHour - 12;
      startTimeOfDay = "PM";
    }
    if (startHour == 12) {
      startTimeOfDay = "PM";
    }
    if (startHour == 0) {
      startHour = 12;
      startTimeOfDay = "AM";
    }
    const startTime = `${startHour}:${startMinute}${startTimeOfDay}`;

    let endTimeArray = this.props.time.endTime.split(":");
    let endHour = endTimeArray[0];
    let endMinute = endTimeArray[1];
    let endTimeOfDay = "AM";
    if (endHour > 12) {
      endHour = endHour - 12;
      endTimeOfDay = "PM";
    }
    if (endHour == 12) {
      endTimeOfDay = "PM";
    }
    if (endHour == 0) {
      endHour = 12;
      endTimeOfDay = "AM";
    }
    const endTime = `${endHour}:${endMinute}${endTimeOfDay}`;

    this.setState({
      selected: dateString,
      eventDate: this.props.date,
      eventOrder: this.props.order,
      realStartTime: this.props.time.startTime,
      realEndTime: this.props.time.endTime,
      startTime,
      endTime
    });
  }

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

    this.setState({ eventDate: eventDate });
  }

  showStartTimePicker = () => this.setState({ isStartTimePickerVisible: true });

  hideStartTimePicker = () =>
    this.setState({ isStartTimePickerVisible: false });

  showEndTimePicker = () => this.setState({ isEndTimePickerVisible: true });

  hideEndTimePicker = () => this.setState({ isEndTimePickerVisible: false });

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
    this.setState({ startTime: startTime, realStartTime: realTime });
    this.hideStartTimePicker();
  };

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
    if (minutes % 15 != 0) {
      minutes = minutes - [minutes % 15];
    }
    if (minutes < 10) {
      minutes = `0${minutes}`;
    }
    let endTime = `${hour}:${minutes}${timeOfDay}`;
    let realTime = `${realHour}:${minutes}`;

    this.setState({ endTime: endTime, realEndTime: realTime });
    this.hideEndTimePicker();
  };

  onCloseModal() {
    const fractionMinutes = parseInt(this.state.realEndTime.split(":")[1]) / 60;
    const timeOrder =
      parseInt(this.state.realEndTime.split(":")[0]) + fractionMinutes;

    const dayOrder =
      parseInt(this.state.eventDate.year) +
      months.indexOf(this.state.eventDate.month) / 11 +
      parseInt(this.state.eventDate.day) / 1000;

    let eventOrder = dayOrder + timeOrder / 100000;
    eventOrder = Math.floor(eventOrder * 1000000) / 1000000;
    this.props.setTime({
      eventDate: this.state.eventDate,
      eventTime: {
        startTime: this.state.realStartTime,
        endTime: this.state.realEndTime
      },
      eventOrder,
      dateChanged: eventOrder != this.props.order
    });
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
            <Icon name="check" color="navy" />
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
            titleIOS="Select A Start Time"
            is24Hour={false}
          />
          <DateTimePicker
            minuteInterval={this.state.interval}
            isVisible={this.state.isEndTimePickerVisible}
            onConfirm={this.handleEndTimePicked}
            onCancel={this.hideEndTimePicker}
            mode="time"
            titleIOS="Select An End Time"
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
    borderTopLeftRadius: 80,
    borderTopRightRadius: 80,
    backgroundColor: "white"
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DateTimeModal);
