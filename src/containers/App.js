import { connect } from 'react-redux'
import React, { Component } from 'react'
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


    const podSet = selectionLabels.netSet.filter(n => appData.hasOwnProperty(n)).map((n, i) => {


      let storyScript = {};
      if (storyData.hasOwnProperty(n)) {
        storyScript = storyData[n];
      }

      const html = (<VizPod renderData={appData[n]}
        interactionCallback={m => { this.handleMessageUpdate(n, m) }}
        selectedElement={selectionLabels[n]}
        storyData={storyScript}
        network={n}
        key={i} />);

      return html;




    });

    let tutorialPod = null;

    const TutorialDiv = styled.div`
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 4px;
      top:0px;
      background-color: #ddd;`,
      RelativeDiv = styled.div`
      position: relative;`;




    if (appData) {
      if (appData.hasOwnProperty("disc")) {
        tutorialPod = (<TutorialDiv>
          <VizPod renderData={appData["disc"]}
            interactionCallback={m => { this.handleMessageUpdate("disc", m) }}
            selectedElement={selectionLabels["disc"]}
            storyData={{}}
            network={"disc"} />

        </TutorialDiv>);
      }
    }


    return (
      <MainDiv >
        <Header />
        <RelativeDiv>
          {podSet}



        </RelativeDiv>
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
