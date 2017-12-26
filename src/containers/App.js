import { connect } from 'react-redux'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { injectGlobal } from 'styled-components'

import {
  vizClick,
  clearSelections,
  fetchPodData
} from '../actions'

import Header from '../components/Header'
import Footer from '../components/Footer'
import DonutRadial from '../components/DonutRadial'

import ToggleSwitch from '../components/ToggleSwitch'

import VizPod from '../containers/VizPod'

class App extends Component {
  constructor(props) {
    super(props);
    this.clearSelections = this.clearSelections.bind(this);
    this.handleMessageUpdate = this.handleMessageUpdate.bind(this);
  }




  handleMessageUpdate(msgGroup, dataOb) {
    this.props.dispatch(vizClick(msgGroup, dataOb));
  }

 

  clearSelections() {
    this.props.dispatch(clearSelections());
  }


  componentDidMount() {
    this.props.dispatch(fetchPodData("disc", "/data/pod-disc2016.json"))
    this.props.dispatch(fetchPodData("tlc", "/data/pod-tlc2016.json"))
    this.props.dispatch(fetchPodData("hgtv", "/data/pod-hgtv2016.json"))
    this.props.dispatch(fetchPodData("vel", "/data/pod-vel2016.json"))
    
  }

  render() {
    const { appData, selectionLabels } = this.props;

    //a styled-div with dropdown inside caused
    const ClearFloatHack = styled.div`
      clear: left;
    `;
  
  injectGlobal`
    @font-face {
      font-family: 'aileron';
      src: url('../fonts/Aileron-Regular.otf');
    }`;

    const MainDiv = styled.div`
      font-family: aileron;
      width: 5000px;
      `;
    
    const InstructionP = styled.p`
      margin-bottom: 4px;
      font-size: 0.8em;`

    let allShowsSet = [],
        showRatingRange = [];
    
    if(Object.keys(appData).length){
      for (var net in appData){
        //console.log(net)
        if(appData[net].hasOwnProperty("series-prems")){
          for (var show of appData[net]["series-prems"].FullYear){
            allShowsSet.push(show);
          }
          for (show of appData[net]["series-repeats"].FullYear){
            allShowsSet.push(show);
          }
        }
      }


      //this should probably be in the store - only needs to be calculated when RECIEVE_DATA and RATING_DELIVERY_TOGGLE (and time period change???)
      showRatingRange = [
        allShowsSet.reduce((accumulator, curr)=>{
          if(curr[selectionLabels.ratingDurationToggle]<accumulator[selectionLabels.ratingDurationToggle]){
            return curr;
          }
          return accumulator;
        })[selectionLabels.ratingDurationToggle],
        allShowsSet.reduce((accumulator, curr)=>{
          if(curr[selectionLabels.ratingDurationToggle]>accumulator[selectionLabels.ratingDurationToggle]){
            return curr
          }
          return accumulator;
        })[selectionLabels.ratingDurationToggle]];

    }
    
    //  console.log(showRatingRange)

    

    return (
      <MainDiv >
        <Header />

        <InstructionP>Toggle the view between Delivery & Duration:</InstructionP>
        <ToggleSwitch option1={{"label":"Delivery", "value": "aa"}} 
                      option2={{"label":"Duration", "value":"mins"}} 
                      interactionCallback={m => { this.handleMessageUpdate("ratingDurationToggle", m) }}
                      selectedOption={selectionLabels.ratingDurationToggle}
                       />



        {appData.hasOwnProperty("disc") &&
          <VizPod renderData={appData.disc} 
                       interactionCallback={m => { this.handleMessageUpdate("disc", m) }} 
                       selectedElement={selectionLabels.disc} 
                       ratingDurationToggle={selectionLabels.ratingDurationToggle}
                       network={"DISC"}
                       ratingRange={showRatingRange}
                       />
        }
        {appData.hasOwnProperty("tlc") &&
          <VizPod renderData={appData.tlc} interactionCallback={m => { this.handleMessageUpdate("tlc", m) }} selectedElement={selectionLabels.tlc} ratingDurationToggle={selectionLabels.ratingDurationToggle} network={"TLC"} ratingRange={showRatingRange} />
        }
        {appData.hasOwnProperty("hgtv") &&
          <VizPod renderData={appData.hgtv} interactionCallback={m => { this.handleMessageUpdate("hgtv", m) }} selectedElement={selectionLabels.hgtv} ratingDurationToggle={selectionLabels.ratingDurationToggle} network={"HGTV"} ratingRange={showRatingRange} />
        }
        {appData.hasOwnProperty("vel") &&
          <VizPod renderData={appData.vel} interactionCallback={m => { this.handleMessageUpdate("vel", m) }} selectedElement={selectionLabels.vel} ratingDurationToggle={selectionLabels.ratingDurationToggle} network={"VEL"} ratingRange={showRatingRange} />
        }
        <ClearFloatHack />
        <Footer />
      </MainDiv>
    );

  }


}


const mapStateToProps = (state, ownProps) => {
  return {
    appData: state.appData,
    selectionLabels: state.selectionLabels
  }
}


export default App = connect(
  mapStateToProps
)(App)
