import { connect } from 'react-redux'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { injectGlobal } from 'styled-components'

import {
  vizClick,
  clearSelections,
  fetchPodData,
  updateNetset,
  fetchStorydata
} from '../actions'

import Header from '../components/Header'
import Footer from '../components/Footer'
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
      { "label": "ID", "value": "id" },
      { "label": "APL", "value": "apl" },
      { "label": "VEL", "value": "vel" },
      { "label": "HGTV", "value": "hgtv" },
      { "label": "HIST", "value": "hist" },
      { "label": "A&E", "value": "ae" },
      { "label": "NGC", "value": "ngc" },
    ];

    this.props.dispatch(updateNetset(this.netOptions.map(n => n.value)))
  }




  handleMessageUpdate(msgGroup, dataOb) {
    this.props.dispatch(vizClick(msgGroup, dataOb));
  }



  clearSelections() {
    this.props.dispatch(clearSelections());
  }


  componentDidMount() {
    this.props.dispatch(fetchPodData("disc", "/data/disc2year.json"))
    this.props.dispatch(fetchPodData("hist", "/data/hist2year.json"))
    this.props.dispatch(fetchPodData("id", "/data/id2year.json"))
    this.props.dispatch(fetchPodData("vel", "/data/vel2year.json"))
    this.props.dispatch(fetchPodData("tlc", "/data/tlc2year.json"))
    this.props.dispatch(fetchPodData("hgtv", "/data/hgtv2year.json"))
    this.props.dispatch(fetchPodData("apl", "/data/apl2year.json"))
    this.props.dispatch(fetchPodData("ae", "/data/ae2year.json"))
    this.props.dispatch(fetchPodData("ngc", "/data/ngc2year.json"))
    
    this.props.dispatch(fetchStorydata("disc", "/data/storydata-disc.json"))
  }

  render() {
    const { appData, selectionLabels, storyData } = this.props;

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
      `;

    const InstructionP = styled.p`
      margin-bottom: 4px;
      font-size: 0.8em;`

    let allShowsSet = [];
    
    const LineDiv = styled.div`
    display: inline-block;
      width: 90%;
      margin-left: auto;
      margin-right: auto;
      border-bottom: solid 1px #000;`;


    const podSet = selectionLabels.netSet.map((n, i) => {
      if (appData.hasOwnProperty(n)) {

        let storyScript = {};
        if (storyData.hasOwnProperty(n)){
          storyScript = storyData[n];
        }

        const html = (<VizPod renderData={appData[n]}
          interactionCallback={m => { this.handleMessageUpdate(n, m) }}
          selectedElement={selectionLabels[n]}
          storyData={storyScript}
          network={n}
          key={i} />);

        return html;
      }
    });



    const CheckLogo = styled.img`
      max-height: 30px;
      margin-left: auto;
      margin-right: auto;
      display: block;`
      ;

    const CheckSet = styled.div`
      float: left;
      width: 150px;
      height: 40px;`;

    const CheckboxLabel = styled.label`
    margin-left: auto;
    margin-right: auto;
    display: block;`;

    const CheckboxInput = styled.input`
    margin-left: auto;
    margin-right: auto;
    display: block;`;

    const CheckFieldbox = styled.fieldset`
    border: solid 1px;
    margin-bottom: 1em;
    border-radius: 3px;
    width: fit-content;
    margin-left: auto;
    margin-right: auto;
    `;

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
      return (<CheckSet key={i} >
        <div>
          <label htmlFor={n.value} ><CheckLogo src={"../img/" + n.value + ".png"} /></label>
        </div>
        <div>
          <CheckboxInput type="checkbox" id={n.value} name="showNets" value={n.value} checked={checkedOff > 0} onChange={onCheckboxChange} />
        </div>
      </CheckSet>);

    })

    return (
      <MainDiv >
        <Header />
      


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
    selectionLabels: state.selectionLabels,
    storyData: state.storyData
  }
}


export default App = connect(
  mapStateToProps
)(App)
