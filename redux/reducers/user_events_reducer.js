import * as T from "../actions/types";

const INITIAL_STATE = {
  createdEvents: [],
  savedEvents: []
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case T.FETCH_USER_EVENTS:
      return {
        ...state,
        [action.payload.prop]: action.payload.value
      };
      break;
    default:
      return state;
  }
};
