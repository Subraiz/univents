import * as T from "./types.js";
import firebase from "@firebase/app";
require("@firebase/auth");
require("@firebase/firestore");
require("@firebase/storage");
import RNFetchBlob from "rn-fetch-blob";
import { Platform } from "react-native";

const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;
window.Blob = Blob;

let auth;
let firestore;
let storage;
const initializeFirebase = async () => {
  auth = await firebase.auth();
  firestore = await firebase.firestore();
  storage = await firebase.storage();
  firestore.settings({ timestampsInSnapshots: true });
};

export const updateUserInfo = ({ prop, value }) => {
  return {
    type: T.UPDATE_USER_INFO,
    payload: { prop, value }
  };
};

export const checkForSignUpErrors = user => {
  initializeFirebase();
  if (!validEmail(user.email)) {
    return dispatch => {
      dispatch({ type: T.USER_SIGNUP_ERROR, payload: "invalidEmail" });
    };
  }
  if (user.password.length < 6) {
    return dispatch => {
      console.log("password error");
      dispatch({ type: T.USER_SIGNUP_ERROR, payload: "passwordTooShort" });
    };
  }
  if (user.password != user.confirmPassword) {
    return dispatch => {
      dispatch({ type: T.USER_SIGNUP_ERROR, payload: "passwordsDontMatch" });
    };
  }
  return dispatch => {
    dispatch({ type: T.USER_SIGNUP_ERROR, payload: "No Error" });
  };
};

export const signUpUser = (email, password) => {
  return async dispatch => {
    initializeFirebase();
    await auth
      .createUserWithEmailAndPassword(email, password)
      .then(object => {
        dispatch({ type: T.USER_SIGNUP_SUCCESS, payload: object.user.uid });
      })
      .catch(error => {
        dispatch({ type: T.USER_SIGNUP_ERROR, payload: "inUseEmail" });
      });
  };
};

export const saveUser = user => {
  initializeFirebase();
  return async dispatch => {
    let {
      email,
      uid,
      interests,
      firstName,
      lastName,
      avatarSource,
      major,
      year,
      sex,
      school
    } = user;
    let updatedUser = {
      firstName,
      lastName,
      email,
      uid,
      interests,
      avatarSource,
      major,
      year,
      sex,
      school,
      race: "",
      events: {
        attendingEvents: [],
        createdEvents: [],
        bookmarkedEvents: [],
        pastHostedEvents: [],
        pastAttendedEvents: []
      }
    };
    await firestore
      .collection("Users")
      .doc(uid)
      .set(updatedUser);
    dispatch({ type: T.SAVE_USER, payload: updatedUser });
  };
};

export const loginUser = (email, password) => {
  initializeFirebase();
  return async dispatch => {
    await dispatch({ type: T.START_LOGIN });
    await auth
      .signInWithEmailAndPassword(email, password)
      .then(userObject => {
        uid = userObject.user.uid;
        dispatch({ type: T.LOGIN_SUCCESS });

        firestore
          .collection("Users")
          .doc(uid)
          .get()
          .then(doc => {
            let user = doc.data();
            dispatch({ type: T.SAVE_USER, payload: user });
          });
      })
      .catch(error => {
        console.log(error);
        dispatch({ type: T.LOGIN_FAILED });
      });
  };
};

export const updateLoginInfo = ({ prop, value }) => {
  return {
    type: T.UPDATE_LOGIN_INFO,
    payload: { prop, value }
  };
};

export const uploadImage = (uri, mime, name) => {
  initializeFirebase();
  return dispatch => {
    const originalXMLHttpRequest = window.XMLHttpRequest;
    window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
    return new Promise((resolve, reject) => {
      let imgUri = uri;
      let uploadBlob = null;
      const uploadUri =
        Platform.OS === "ios" ? imgUri.replace("file://", "") : imgUri;
      let user = auth.currentUser;
      const imageRef = storage.ref(`${user.uid}`);

      fs.readFile(uploadUri, "base64")
        .then(data => {
          return Blob.build(data, { type: `${mime};BASE64` });
        })
        .then(blob => {
          uploadBlob = blob;
          return imageRef.put(blob, { contentType: mime, name: name });
        })
        .then(() => {
          uploadBlob.close();
          window.XMLHttpRequest = originalXMLHttpRequest;
          return imageRef.getDownloadURL();
        })
        .then(url => {
          console.log(url);
          let source = { uri: url };
          dispatch({
            type: T.UPDATE_USER_INFO,
            payload: { prop: "avatarSource", value: source }
          });
          resolve(url);
        })
        .catch(error => {
          reject(error);
        });
    });
  };
};

const validEmail = email => {
  if (email.includes("edu") && email.includes("@")) {
    return true;
  } else {
    return false;
  }
};
