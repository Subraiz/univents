export default class Event {
  eventName = "";
  eventHost = "";
  eventDate = {
    month: "",
    day: "",
    year: ""
  };
  eventCoordinates = {
    latitude: 1,
    longitude: 1
  };
  eventLocation = {
    locationAddress: "",
    locationName: ""
  };
  eventTime = {
    startTime: "",
    endTime: ""
  };
  eventType = ""; // Can be school wide, public, or private
  eventImage = { uri: "url" };
  eventID = ""; // Will be doc ID of the event

  constructor(
    eventName,
    eventDescription,
    eventDate,
    eventHost,
    eventCoordinates,
    eventLocation,
    eventTime,
    eventType,
    eventImage,
    eventID
  ) {
    this.eventName = eventName;
    this.eventDescription = eventDescription;
    this.eventDate = eventDate;
    this.eventHost = eventHost;
    this.eventCoordinates = eventCoordinates;
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
  getEventDescription() {
    return this.eventDescription;
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
  getEventCoordinates() {
    return this.eventCoordinates;
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
  getEventImage() {
    return this.eventImage;
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
