
//import todos from './todos'
//import visibilityFilter from './visibilityFilter'
//import stateselect from './stateselect';

import { combineReducers } from 'redux'
import {
  //SELECT_SUBREDDIT,
  //INVALIDATE_SUBREDDIT,
  //REQUEST_POSTS,
  //RECEIVE_POSTS,
  RECEIVE_DATA,
  VIZ_CLICK,
  CLEAR_SELECTIONS,
  CHANGE_DATALABEL
} from '../actions'

/*
function selectedSubreddit(state = 'reactjs', action) {
  switch (action.type) {
    case SELECT_SUBREDDIT:
      return action.subreddit
    default:
      return state
  }
}

function posts(
  state = {
    isFetching: false,
    didInvalidate: false,
    items: []
  },
  action
) {
  switch (action.type) {
    case INVALIDATE_SUBREDDIT:
      return Object.assign({}, state, {
        didInvalidate: true
      })
    case REQUEST_POSTS:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false
      })
    case RECEIVE_POSTS:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        items: action.posts,
        lastUpdated: action.receivedAt
      })
    default:
      return state
  }
}

function postsBySubreddit(state = {}, action) {
  switch (action.type) {
    case INVALIDATE_SUBREDDIT:
    case RECEIVE_POSTS:
    case REQUEST_POSTS:
      return Object.assign({}, state, {
        [action.subreddit]: posts(state[action.subreddit], action)
      })
    default:
      return state
  }
}
*/


function selectionLabels(state = {"timeperiod": "FullYear", "ratingDurationToggle": "aa"}, action) {
  switch (action.type) {
    case RECEIVE_DATA:
      return { ...state, ...{[action.group]: {}} };
    case VIZ_CLICK:
      return { ...state, ...{ [action.messageGroup]: action.show} };
    case CLEAR_SELECTIONS:
      return { ...state };
    case CHANGE_DATALABEL:
      return {...state, [action.group]: action.label}
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








const censusReducer = combineReducers({
  selectionLabels,
  appData
})

export default censusReducer;