import { connect } from 'react-redux'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { injectGlobal } from 'styled-components'

import {
  vizClick,
  clearSelections,
  fetchPodData,
  updateNetset
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
    this.netOptions = [
      { "label": "DISC", "value": "disc" },
      { "label": "TLC", "value": "tlc" },
      { "label": "HGTV", "value": "hgtv" },
      { "label": "VEL", "value": "vel" },
    ];

    this.props.dispatch(updateNetset(this.netOptions.map(n => n.value)))
    //this.selectedNets = this.netOptions.map(n=>n.value);

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


    selectionLabels.netSet.forEach((net)=>{
      console.log(net)
      if (appData.hasOwnProperty(net)) {
        for (var show of appData[net]["series-prems"].FullYear) {
          allShowsSet.push(show);
        }
        for (show of appData[net]["series-repeats"].FullYear) {
          allShowsSet.push(show);
        }
      }
    })

    console.log(allShowsSet)

    if(allShowsSet.length){
      //this should probably be in the store - only needs to be calculated when RECIEVE_DATA and RATING_DELIVERY_TOGGLE (and time period change???)
      showRatingRange = [
        allShowsSet.reduce((accumulator, curr) => {
          if (curr[selectionLabels.ratingDurationToggle] < accumulator[selectionLabels.ratingDurationToggle]) {
            return curr;
          }
          return accumulator;
        })[selectionLabels.ratingDurationToggle],
        allShowsSet.reduce((accumulator, curr) => {
          if (curr[selectionLabels.ratingDurationToggle] > accumulator[selectionLabels.ratingDurationToggle]) {
            return curr
          }
          return accumulator;
        })[selectionLabels.ratingDurationToggle]];
    }

    
    



    //console.log(selectionLabels.netSet)



    const podSet = selectionLabels.netSet.map((n, i) => {
      if (appData.hasOwnProperty(n)) {
        return (<VizPod renderData={appData[n]}
          interactionCallback={m => { this.handleMessageUpdate(n, m) }}
          selectedElement={selectionLabels[n]}
          ratingDurationToggle={selectionLabels.ratingDurationToggle}
          network={n}
          ratingRange={showRatingRange}
          key={i} />);
      }
      else return;
    });

    const CheckLogo = styled.img`
      max-height: 30px;`;


    const onCheckboxChange = (e) => {
      //console.log(e.target.value);
      const i = selectionLabels.netSet.indexOf(e.target.value);
      let newSet = [];

      if (i > -1) {
        newSet = selectionLabels.netSet.filter(n => {
          if (n !== e.target.value) return n;
          return;
        })
      }
      else {
        newSet = [...selectionLabels.netSet, e.target.value];
      }

      console.log(newSet);
      this.props.dispatch(updateNetset(newSet));

    }

    const checkBoxes = this.netOptions.map((n, i) => {
      const checkedOff = selectionLabels.netSet.filter(sn => {
        if (sn === n.value) return true;
        return false;
      }).length;
      //console.log(checkedOff)
      return (<div key={i} >
        <input type="checkbox" id={n.value} name="showNets" value={n.value} checked={checkedOff > 0} onChange={onCheckboxChange} />
        <label htmlFor={n.value} ><CheckLogo src={"../img/" + n.value + ".png"} /></label>
      </div>);

    })

    return (
      <MainDiv >
        <Header />

        <InstructionP>Toggle the view between Delivery & Duration:</InstructionP>

        <fieldset>
          {checkBoxes}
        </fieldset>

        <ToggleSwitch option1={{ "label": "Delivery", "value": "aa" }}
          option2={{ "label": "Duration", "value": "mins" }}
          interactionCallback={m => { this.handleMessageUpdate("ratingDurationToggle", m) }}
          selectedOption={selectionLabels.ratingDurationToggle}
        />


        {podSet}

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
