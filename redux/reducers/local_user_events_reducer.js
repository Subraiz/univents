import * as T from "../actions/types";

const INITIAL_STATE = {
  createdEvents: [],
  favoritedEvents: [],
  attendedEvents: []
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case T.STORE_LOCAL_EVENT:
      console.log(action.payload);
      return {
        ...state,
        [action.payload.prop]: action.payload.value
      };
    default:
      return state;
  }
};
