import { combineReducers } from 'redux'
import {
  RECEIVE_DATA,
  VIZ_CLICK,
  UPDATE_NETSET,
  RECEIVE_STORYDATA
} from '../actions'


function selectionLabels(state = {"netSet": [], "tutorialMode": true}, action) {
  switch (action.type) {
    case RECEIVE_DATA:
      return { ...state, ...{[action.group]: {"timePeriod": "FullYear", "selectedYear": "2017", "ratingDurationToggle": "aa", "storyMode": false, "storyPosition": 0}} };
    case VIZ_CLICK:
      return { ...state, ...{ [action.messageGroup]: action.show} };
    case UPDATE_NETSET:
      return {...state, "netSet": action.nets}
    default:
      return state;
  }

}


function appData(state = {}, action) {
  switch (action.type) {
    case RECEIVE_DATA:
      return Object.assign({}, state, {
        [action.group]: action.data
      });
    default:
      return state;
  }
}

function storyData(state = {}, action) {
  switch (action.type) {
    case RECEIVE_STORYDATA:
      return Object.assign({}, state, {
        [action.group]: action.data
      });
    default:
      return state;
  }
}


const censusReducer = combineReducers({
  selectionLabels,
  appData,
  storyData
})

export default censusReducer;