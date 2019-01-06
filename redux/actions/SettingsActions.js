import * as T from "./types.js";
import firebase from "@firebase/app";
require("@firebase/auth");
require("@firebase/firestore");

let auth;
let firestore;
const initializeFirebase = async () => {
  auth = await firebase.auth();
  firestore = await firebase.firestore();
  firestore.settings({ timestampsInSnapshots: true });
};

export const signOutUser = () => {
  initializeFirebase();
  return async dispatch => {
    await firebase
      .auth()
      .signOut()
      .then(
        function() {
          dispatch({ type: T.CLEAR_USER });
        },
        function(error) {
          dispatch({ type: T.CLEAR_USER });
        }
      );
  };
};

export const refreshEmailVerified = () => {
  return async dispatch => {
    await initializeFirebase();
    let user = auth.currentUser;
    await user.reload()
    dispatch({
      type: T.UPDATE_USER_INFO,
      payload: { prop: "emailVerified", value: user.emailVerified }
    });
  };
};

export const resendVerification = () => {
  return async dispatch => {
    await initializeFirebase();
    let user = auth.currentUser;
    await user.reload()
    if (user.emailVerified !== true) {
      user.sendEmailVerification();
    }
    dispatch({
      type: T.UPDATE_USER_INFO,
      payload: { prop: "emailVerified", value: user.emailVerified }
    });
  };
};
