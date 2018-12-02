import { combineReducers } from "redux";
import userRedcuer from "./user_reducer";
import authReducer from "./auth_reducer";
import eventReducer from "./event_reducer";

export default combineReducers({
  user: userRedcuer,
  auth: authReducer,
  event: eventReducer
});
