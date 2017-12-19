import { connect } from 'react-redux'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import {
  fetchCensusData,
  vizClick,
  clearSelections,
  changeDropDown,
  fetchPodData
} from '../actions'

import Header from '../components/Header'
import Footer from '../components/Footer'

/*
import Dropdown from '../components/Dropdown'
//import MapUSA from '../components/MapUSA'
import Histogram from '../components/Histogram'
import ScatterPlotLine from '../components/ScatterPlotLine'
import MessageModal from '../components/MessageModal'
*/

import DonutRadial from '../components/DonutRadial'

class App extends Component {
  constructor(props) {
    super(props);
    //this.handleOptionChange = this.handleOptionChange.bind(this);
    //this.handleMapClick = this.handleMapClick.bind(this);
    this.clearSelections = this.clearSelections.bind(this);
    this.handleMessageUpdate = this.handleMessageUpdate.bind(this);
  }


  //NEED TO STANDARDIZE THE Click-EVent handlers ie, (stateSet, message)!!!!


  handleMessageUpdate(msgGroup, message) {
    //const { dispatch } = this.props;
    this.props.dispatch(vizClick(msgGroup, message));
  }




/*

  handleScatterClick(idSet, message) {
    const { dispatch, censusData } = this.props;
    dispatch(vizClick(message, idSet, [0]));
  }


  handleMapClick(id) {
    const { dispatch, censusData } = this.props;
    //make the message - find state name, number format and value
    const stateData = censusData.primaryData.filter(st => { if (st.id === id) return true; })[0],
      message = stateData.state + ": " + stateData.value + stateData.numformat;
    //dispatch with message & higlightState
    dispatch(vizClick(message, [id], [stateData.value]));
  }

  handleHistoClick(vals) {
    const { dispatch, censusData } = this.props;

    const max = Math.max(...vals),
      min = Math.min(...vals),
      numformat = censusData.primaryData[0].numformat,
      message = (max === min) ? "States with " + min + numformat : "States with " + min + "-" + max + numformat,
      statesInRange = censusData.primaryData.filter(st => {
        return vals.includes(st.value);
      }).map(st => { return st.id });
    console.log(statesInRange, message);

    dispatch(vizClick(message, statesInRange, vals));
  }
*/
  clearSelections() {
    this.props.dispatch(clearSelections());
  }


  handleOptionChange(optiongroup, val) {
    console.log(optiongroup, val)
    this.props.dispatch(fetchCensusData(optiongroup, val))
    this.props.dispatch(changeDropDown(optiongroup, val.label))
  }

  componentDidMount(){
    console.log("Mounted");
    this.props.dispatch(fetchPodData("disc", "/pod-disc2016.json"))
    this.props.dispatch(fetchPodData("tlc", "/pod-tlc2016.json"))
    this.props.dispatch(fetchPodData("hgtv", "/pod-hgtv2016.json"))
  }

  render() {
    const { appData, selectionLabels } = this.props;

    //a styled-div with dropdown inside caused
    const ClearFloatHack = styled.div`
      clear: left;
    `;

    return (
      <div onClick={() => { this.clearSelections() }}>
        <Header />
        
      { appData.hasOwnProperty("disc") && 
          <DonutRadial renderData={appData.disc} interactionCallback={m=>{this.handleMessageUpdate("disc", m)}} message={selectionLabels.disc} />
      }
      { appData.hasOwnProperty("tlc") && 
          <DonutRadial renderData={appData.tlc} interactionCallback={m=>{this.handleMessageUpdate("tlc", m)}} message={selectionLabels.tlc} />
      } 
      { appData.hasOwnProperty("hgtv") && 
          <DonutRadial renderData={appData.hgtv} interactionCallback={m=>{this.handleMessageUpdate("hgtv", m)}} message={selectionLabels.hgtv} />
      } 
      <ClearFloatHack />
        <Footer />
      </div>
    );

  }


}


const mapStateToProps = (state, ownProps) => {
  return {
    //dataOptions: state.dataOptions,
    appData: state.appData,
    selectionLabels: state.selectionLabels
  }
}


export default App = connect(
  mapStateToProps
)(App)
