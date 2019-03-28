import * as T from "../actions/types";

const INITIAL_STATE = {
  allEvents: [],
  todaysEvents: [],
  popularEvents: [],
  suggestionEvents: [],
  schoolEvents: [],
  specialEvents: [],
  loading: false,
  specialEventActive: false,
  specialEventTitle: ""
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case T.FETCH_START:
      return { ...state, loading: true };
    case T.FETCH_EVENTS:
      return {
        ...state,
        [action.payload.prop]: action.payload.value,
        loading: false
      };
    case T.GET_SPECIAL_EVENT:
      return {
        ...state,
        specialEventActive: action.payload.active,
        specialEventTitle: action.payload.title
      };
    default:
      return state;
  }
};
