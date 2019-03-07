import { connect } from 'react-redux'
import React, { Component } from 'react'
import './App.css'

import {
  vizClick,
  clearSelections,
  fetchPodData,
  fetchStorydata
} from '../actions'

import Header from '../components/Header'
import Footer from '../components/Footer'
import VizPod from '../containers/VizPod'

class App extends Component {
  constructor(props) {
    super(props);
    this.clearSelections = this.clearSelections.bind(this);
    this.onVizInteraction = this.onVizInteraction.bind(this);
  }


  onVizInteraction(msgGroup, dataOb) {
    this.props.dispatch(vizClick(msgGroup, dataOb));
  }

  clearSelections() {
    this.props.dispatch(clearSelections());
  }

  componentDidMount() {
    this.props.dispatch(fetchPodData("abc", "data/abcfake2.json"))
    this.props.dispatch(fetchPodData("cbs", "data/cbsfake2.json"))
    this.props.dispatch(fetchPodData("fox", "data/foxfake2.json"))
    this.props.dispatch(fetchPodData("nbc", "data/nbcfake2.json"))
    this.props.dispatch(fetchPodData("cw", "data/cwfake2.json"))

    this.props.dispatch(fetchStorydata("abc", "data/storydata-abc.json"))
  }




  render() {
    const { appData, selectionLabels, storyData } = this.props;


    return (
      <div className="mainDiv" >
        <Header />

        {(appData.hasOwnProperty("abc") && (storyData.hasOwnProperty("abc"))) &&
          <VizPod renderData={appData["abc"]}
            interactionCallback={m => { this.onVizInteraction("abc", m) }}
            selectedElement={selectionLabels["abc"]}
            storyData={storyData["abc"]}
            network={"abc"} />
        }

        {(appData.hasOwnProperty("cbs")) &&
          <VizPod renderData={appData["cbs"]}
            interactionCallback={m => { this.onVizInteraction("cbs", m) }}
            selectedElement={selectionLabels["cbs"]}
            storyData={{}}
            network={"cbs"} />
        }

        {(appData.hasOwnProperty("fox")) &&
          <VizPod renderData={appData["fox"]}
            interactionCallback={m => { this.onVizInteraction("fox", m) }}
            selectedElement={selectionLabels["fox"]}
            storyData={{}}
            network={"fox"} />
        }

        {(appData.hasOwnProperty("nbc")) &&
          <VizPod renderData={appData["nbc"]}
            interactionCallback={m => { this.onVizInteraction("nbc", m) }}
            selectedElement={selectionLabels["nbc"]}
            storyData={{}}
            network={"nbc"} />
        }

        {(appData.hasOwnProperty("cw")) &&
          <VizPod renderData={appData["cw"]}
            interactionCallback={m => { this.onVizInteraction("cw", m) }}
            selectedElement={selectionLabels["cw"]}
            storyData={{}}
            network={"cw"} />
        }


        <Footer />
      </div>
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
