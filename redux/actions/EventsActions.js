import * as T from "./types.js";
import firebase from "@firebase/app";
import Event from "../../classes/Event";
require("@firebase/auth");
require("@firebase/firestore");
require("@firebase/storage");

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

let auth;
let firestore;
let storage;
const initializeFirebase = async () => {
  auth = await firebase.auth();
  firestore = await firebase.firestore();
  storage = await firebase.storage();
  firestore.settings({ timestampsInSnapshots: true });
};

export const getUserEvents = uid => {
  let user;
  let createdEvents = [];
  let savedEvents = [];
  return async dispatch => {
    await initializeFirebase();
    firestore
      .collection("Users")
      .doc(uid)
      .get()
      .then(doc => {
        user = doc.data();
        user.events.createdEvents.forEach(event => {
          event.get().then(doc => {
            let event = doc.data();
            let eventClass = new Event(
              event.eventName,
              event.eventDescription,
              event.eventDate,
              event.eventHost,
              event.eventCategories,
              event.eventCoordinates,
              event.eventLocation,
              event.eventTime,
              event.eventType,
              event.eventImage,
              event.eventContact,
              event.eventID,
              event.eventData
            );
            createdEvents.push(eventClass);
          });
        });
        dispatch({
          type: T.FETCH_USER_EVENTS,
          payload: { prop: "createdEvents", value: createdEvents }
        });
      });
  };
};

export const fetchEvents = (state, type, user) => {
  // Get current date
  let currentDate = new Date();
  let currentYear = currentDate.getFullYear();
  let currentMonth = currentDate.getMonth() + 1;
  let currentDay = currentDate.getDate();
  let studentInterests = false;

  // Create event categories
  let allEvents = [];
  let popularEvents = [];
  let suggestionEvents = [];
  let schoolEvents = [];

  // Check if user is logged in
  if (user) {
    studentInterests = user.interests;
  }

  return async dispatch => {
    dispatch({ type: T.START_FETCH });
    await initializeFirebase();
    await firestore
      .collection("Location")
      .doc(state)
      .collection("Events")
      .orderBy("eventDate", "desc")
      .get()
      .then(data => {
        // Use some instead of forEach so it can break
        data.docs.some(doc => {
          let event = doc.data();
          let eventCategories = event.eventCategories;

          // Check if event categories match users interests or if event is checked as popular
          let commonInterest = eventCategories.some(
            category => studentInterests.indexOf(category) >= 0
          );
          let popular = eventCategories.indexOf("Popular") >= 0 ? true : false;

          // Stop getting events once it hits the first event which is out of date
          let { month, day, year } = event.eventDate;
          month = months.indexOf(month) + 1;
          if (year <= currentYear) {
            if (month <= currentMonth) {
              if (day < currentDay) {
                return true;
              }
            }
          }

          // Create new Event Class
          let eventClass = new Event(
            event.eventName,
            event.eventDescription,
            event.eventDate,
            event.eventHost,
            event.eventCategories,
            event.eventCoordinates,
            event.eventLocation,
            event.eventTime,
            event.eventType,
            event.eventImage,
            event.eventContact,
            event.eventID,
            event.eventData
          );
          // Sort events so most recent events are first in the array
          allEvents.unshift(eventClass);

          // Put events in respective categories
          if (studentInterests != false) {
            if (commonInterest) {
              suggestionEvents.unshift(eventClass);
            } else {
              schoolEvents.unshift(eventClass);
            }
          }

          if (popular) {
            popularEvents.unshift(eventClass);
          }
        });

        // Check if we should add a delay or not
      })
      .catch(error => {
        console.log(error);
      });
    let delay = 0;
    if (type == "update") {
      delay = 2000;
    }
    setTimeout(() => {
      dispatch({
        type: T.FETCH_EVENTS,
        payload: { prop: "allEvents", value: allEvents }
      });
      dispatch({
        type: T.FETCH_EVENTS,
        payload: { prop: "popularEvents", value: popularEvents }
      });
      dispatch({
        type: T.FETCH_EVENTS,
        payload: { prop: "suggestionEvents", value: suggestionEvents }
      });
      dispatch({
        type: T.FETCH_EVENTS,
        payload: { prop: "schoolEvents", value: schoolEvents }
      });
    }, delay);
  };
};
