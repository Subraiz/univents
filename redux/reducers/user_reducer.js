import * as T from "../actions/types";
import { REHYDRATE } from "redux-persist/constants";
import { NavigationActions } from "react-navigation";

const INITIAL_STATE = {
  firstName: "",
  lastName: "",
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  interests: [],
  error: "",
  avatarSource: {
    uri:
      "https://articles-images.sftcdn.net/wp-content/uploads/sites/3/2016/01/wallpaper-for-facebook-profile-photo.jpg"
  },
  major: "",
  year: "Junior",
  sex: "",
  school: "",
  uid: ""
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case T.UPDATE_USER_INFO:
      return {
        ...state,
        [action.payload.prop]: action.payload.value,
        error: ""
      };
    case T.USER_SIGNUP_ERROR:
      return { ...state, error: action.payload };
    case T.USER_SIGNUP_SUCCESS:
      return {
        ...state,
        error: "No Error",
        uid: action.payload,
        password: "",
        confirmPassword: ""
      };
    case T.SAVE_USER:
      console.log(action.payload);
      return action.payload;
    case T.CLEAR_USER:
      return INITIAL_STATE;
    default:
      return state;
  }
};
