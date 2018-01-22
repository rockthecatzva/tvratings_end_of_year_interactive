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
    this.props.dispatch(fetchPodData("disc", "data/disc2year.json"))
    this.props.dispatch(fetchPodData("hist", "data/hist2year.json"))
    this.props.dispatch(fetchPodData("id", "data/id2year.json"))
    this.props.dispatch(fetchPodData("vel", "data/vel2year.json"))
    this.props.dispatch(fetchPodData("tlc", "data/tlc2year.json"))
    this.props.dispatch(fetchPodData("hgtv", "data/hgtv2year.json"))
    this.props.dispatch(fetchPodData("apl", "data/apl2year.json"))
    this.props.dispatch(fetchPodData("ae", "data/ae2year.json"))
    this.props.dispatch(fetchPodData("ngc", "data/ngc2year.json"))

    this.props.dispatch(fetchStorydata("disc", "data/storydata-disc.json"))
  }




  render() {
    const { appData, selectionLabels, storyData } = this.props;


    return (
      <div className="mainDiv" >
        <Header />

        {(appData.hasOwnProperty("disc") && (storyData.hasOwnProperty("disc"))) &&
          <VizPod renderData={appData["disc"]}
            interactionCallback={m => { this.onVizInteraction("disc", m) }}
            selectedElement={selectionLabels["disc"]}
            storyData={storyData["disc"]}
            network={"disc"} />
        }

        {(appData.hasOwnProperty("tlc")) &&
          <VizPod renderData={appData["tlc"]}
            interactionCallback={m => { this.onVizInteraction("tlc", m) }}
            selectedElement={selectionLabels["tlc"]}
            storyData={{}}
            network={"tlc"} />
        }

        {(appData.hasOwnProperty("id")) &&
          <VizPod renderData={appData["id"]}
            interactionCallback={m => { this.onVizInteraction("id", m) }}
            selectedElement={selectionLabels["id"]}
            storyData={{}}
            network={"id"} />
        }

        {(appData.hasOwnProperty("apl")) &&
          <VizPod renderData={appData["apl"]}
            interactionCallback={m => { this.onVizInteraction("apl", m) }}
            selectedElement={selectionLabels["apl"]}
            storyData={{}}
            network={"apl"} />
        }

        {(appData.hasOwnProperty("vel")) &&
          <VizPod renderData={appData["vel"]}
            interactionCallback={m => { this.onVizInteraction("vel", m) }}
            selectedElement={selectionLabels["vel"]}
            storyData={{}}
            network={"vel"} />
        }

        {(appData.hasOwnProperty("hgtv")) &&
          <VizPod renderData={appData["hgtv"]}
            interactionCallback={m => { this.onVizInteraction("hgtv", m) }}
            selectedElement={selectionLabels["hgtv"]}
            storyData={{}}
            network={"hgtv"} />
        }

        {(appData.hasOwnProperty("hist")) &&
          <VizPod renderData={appData["hist"]}
            interactionCallback={m => { this.onVizInteraction("hist", m) }}
            selectedElement={selectionLabels["hist"]}
            storyData={{}}
            network={"hist"} />
        }

        {(appData.hasOwnProperty("ae")) &&
          <VizPod renderData={appData["ae"]}
            interactionCallback={m => { this.onVizInteraction("ae", m) }}
            selectedElement={selectionLabels["ae"]}
            storyData={{}}
            network={"ae"} />
        }

        {(appData.hasOwnProperty("ngc")) &&
          <VizPod renderData={appData["ngc"]}
            interactionCallback={m => { this.onVizInteraction("ngc", m) }}
            selectedElement={selectionLabels["ngc"]}
            storyData={{}}
            network={"ngc"} />
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
