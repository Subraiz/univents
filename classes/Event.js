export default class Event {
  eventName = "";
  eventHost = "";
  eventDate = {
    month: "",
    day: "",
    year: ""
  };
  eventCategories = [];
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
  eventImage = {
    uri:
      "http://aooevents.com/wp-content/themes/invictus_3.3/images/dummy-image.jpg"
  };
  eventContact = "";
  eventID = ""; // Will be doc ID of the event

  constructor(
    eventName,
    eventDescription,
    eventDate,
    eventHost,
    eventCategories,
    eventCoordinates,
    eventLocation,
    eventTime,
    eventType,
    eventImage,
    eventContact,
    eventID
  ) {
    this.eventName = eventName;
    this.eventDescription = eventDescription;
    this.eventDate = eventDate;
    this.eventHost = eventHost;
    this.eventCategories = eventCategories;
    this.eventCoordinates = eventCoordinates;
    this.eventLocation = eventLocation;
    this.eventTime = eventTime;
    this.eventType = eventType;
    this.eventImage = eventImage;
    this.eventContact = eventContact;
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
  getEventCategories() {
    return this.eventCategories;
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
  getEventContact() {
    return this.eventContact;
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
  setEventCategories(eventCategories) {
    this.eventCategories = eventCategories;
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
