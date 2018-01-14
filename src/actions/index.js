import fetch from 'isomorphic-fetch'

export const REQUEST_DATA = 'REQUEST_DATA'
export const RECEIVE_DATA = 'RECEIVE_DATA'
export const VIZ_CLICK = 'VIZ_CLICK'
export const CLEAR_SELECTIONS = 'CLEAR_SELECTIONS'
export const CHANGE_DATALABEL = 'CHANGE_DATALABEL'
export const UPDATE_NETSET = 'UPDATE_NETSET'
export const RECEIVE_STORYDATA = 'RECEIVE_STORYDATA'


export const vizClick = (messageGroup, show) => {
  return {
    type: VIZ_CLICK,
    show,
    messageGroup
  }
}


export const updateNetset = (nets) => {
  return{
    type: UPDATE_NETSET,
    nets
  }
}

export const changeDropDown = (group, label) => {
  return{
    type: CHANGE_DATALABEL,
    group,
    label
  }
}

export const clearSelections = ()=>{
  return {
    type: CLEAR_SELECTIONS
  }
}


function receiveData(group, data) {
  //console.log(data)
  return {
    type: RECEIVE_DATA,
    group,
    data,
    //posts: json.data.children.map(child => child.data)
  }
}


function receiveStorydata(group, data) {
  return {
    type: RECEIVE_STORYDATA,
    group,
    data,
    //posts: json.data.children.map(child => child.data)
  }
}



export function fetchPodData(datagroup, url) {
  return (dispatch) => {
    return fetch(url)
      .then(response => response.json())
      .then(json => {
        //console.log(json)
        const data = json;// csvtojson(json).map(d=>apisettings.processor(d));
        return dispatch(receiveData(datagroup, data))})
  }
}

export function fetchStorydata(datagroup, url) {
  return (dispatch) => {
    return fetch(url)
      .then(response => response.json())
      .then(json => {
        //console.log(json)
        const data = json;// csvtojson(json).map(d=>apisettings.processor(d));
        return dispatch(receiveStorydata(datagroup, data))})
  }
}