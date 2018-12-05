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
  eventData: {
    currentAttendance: 0,
    usersAttended: []
  };

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
    eventID,
    eventData
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
    this.eventData = eventData;
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
    return this.eventData.usersAttended;
  }
  getTotalAttendance() {
    return this.eventData.currentAttendance;
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
  setEventCoordinates(eventCoordinates) {
    this.eventCoordinates = eventCoordinates;
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
  setEventDescription(eventDescription) {
    this.eventDescription = eventDescription;
  }
  setEventImage(eventImage) {
    this.eventImage = eventImage;
  }
  setEventID(eventID) {
    this.eventID = eventID;
  }
  setEventData(eventData) {
    this.eventData = eventData;
  }
  setEventContact(eventContact) {
    this.eventContact = eventContact;
  }

  // Helper Functions
  addUserAttended(user) {
    let date = new Date();
    let hour = date.getHours();
    let minute = date.getMinutes();

    let time = {
      hour: hour,
      minute: minute
    };

    user.time = time;

    this.eventData.usersAttended.push(user);
    this.eventData.currentAttendance++;
  }

  // Data functions
  getSexData() {
    let sexData = {
      males: [],
      females: [],
      other: []
    };

    this.eventData.usersAttended.forEach(user => {
      if (user.sex.toLowerCase() == "female") {
        genderData.females.push(user);
      } else if (user.sex.toLowerCase() == "male") {
        genderData.males.push(user);
      } else {
        genderData.other.push(user);
      }
    });
    return sexData;
  }

  getYearData() {
    let yearData = {
      freshman: [],
      sophomore: [],
      junior: [],
      senior: []
    };

    this.eventData.usersAttended.forEach(user => {
      if (user.year.toLowerCase() == "freshman") {
        yearData.freshman.push(user);
      } else if (user.year.toLowerCase() == "sophomore") {
        yearData.sophomore.push(user);
      } else if (user.year.toLowerCase() == "junior") {
        yearData.junior.push(user);
      } else if (user.year.toLowerCase() == "senior") {
        yearData.junior.push(user);
      }
    });
    return yearData;
  }

  // Function used to make class serilizable
  getEventObject() {
    return JSON.parse(JSON.stringify(this));
  }
}
