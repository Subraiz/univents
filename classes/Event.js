export default class Event {
  eventName = "";
  eventHost = "";
  eventDate = {
    month: "",
    day: "",
    year: ""
  };
  eventLocation = {
    longitude: 0,
    latitude: 0,
    locationAddress: "",
    locationName: ""
  };
  eventTime = {
    startTime: "",
    endTime: ""
  };
  eventType = ""; // Can be school wide, public, or private
  eventID = ""; // Will be doc ID of the event

  Event(
    eventName,
    eventDate,
    eventHost,
    eventLocation,
    eventTime,
    eventType,
    eventImage,
    eventID
  ) {
    this.eventName = eventName;
    this.eventDate = eventDate;
    this.eventHost = eventHost;
    this.eventLocation = eventLocation;
    this.eventTime = eventTime;
    this.eventType = eventType;
    this.eventImage = eventImage;
    this.eventID = eventID;

    this.usersAttended = [];
    this.totalAttendance = 0;
  }

  // Getters
  getEventName() {
    return this.eventName;
  }
  getEventDate() {
    return this.eventDate;
  }
  getEventHost() {
    return this.eventHost;
  }
  getEventLocation() {
    return this.eventLocation;
  }
  getAttendance() {
    return this.attendance;
  }
  getEventTime() {
    return this.eventTime;
  }
  getEventType() {
    return this.eventType;
  }
  getEventID() {
    return this.eventID;
  }
  getUsersAttended() {
    return this.usersAttended;
  }
  getTotalAttendance() {
    return this.totalAttendance;
  }

  // Setters
  setEventName(eventName) {
    this.eventName = eventName;
  }
  setEventDate(eventDate) {
    this.eventDate = eventDate;
  }
  setEventHost(eventHost) {
    this.eventHost = eventHost;
  }
  setEventLocation(eventLocation) {
    this.eventLocation = eventLocation;
  }
  setEventTime(eventTime) {
    this.eventTime = eventTime;
  }
  setEventType(eventType) {
    this.eventType = eventType;
  }

  // Helper Functions
  addUserAttended(user) {
    this.usersAttended.push(user);
    this.numberOfAtendees++;
  }
}
