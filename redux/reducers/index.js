import { combineReducers } from "redux";
import userRedcuer from "./user_reducer";
import authReducer from "./auth_reducer";
import eventReducer from "./event_reducer";
import eventsReducer from "./events_reducer";
import userEventsReducer from "./user_events_reducer";
import localUserEventsReducer from "./local_user_events_reducer";
import settingsReducer from "./settings_reducer";

export default combineReducers({
  user: userRedcuer,
  auth: authReducer,
  event: eventReducer,
  events: eventsReducer,
  userEvents: userEventsReducer,
  localUserEvents: localUserEventsReducer,
  settings: settingsReducer
});
