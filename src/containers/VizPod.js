import React, { Component } from 'react'
import PropTypes from 'prop-types';
import './VizPod.css'

import MultiLineAndBars from '../components/MultiLineAndBars'
import DonutRadial from '../components/DonutRadial'
import ToggleSwitch from '../components/ToggleSwitch'
import StoryBox from '../components/StoryBox'
import * as deepEqual from 'deep-equal'

export default class VizPod extends Component {

    deleteShowProps(s) {
        let t = { ...s };
        delete t.name;
        delete t.aa;
        delete t.mins;
        delete t.premiereStatus;
        return t;
    }

    changeSlide(val) {
        const nextStoryData = this.props.storyData[val];
        let nextStory = {};


        if (!nextStoryData.hasOwnProperty("name")) {
            nextStory = { ...this.deleteShowProps(this.props.selectedElement), ...this.props.storyData[val] }
        }
        else {
            //need to look up newly selected show data
            const showInfo = this.props.renderData[nextStoryData.selectedYear][nextStoryData.premiereStatus === "premiere" ? "series-prems" : "series-repeats"][nextStoryData.timePeriod].filter((s) => { if (s.name === nextStoryData.name) return true; return false; })
            nextStory = { ...this.props.selectedElement, ...nextStoryData, ...showInfo[0] }
        }

        this.props.interactionCallback({ ...nextStory, "storyPosition": val })
    }

    toggleStorymode(val) {
        if (val) {
            this.props.interactionCallback({ ...this.props.selectedElement, "storyMode": val, ...this.props.storyData[this.props.selectedElement.storyPosition] })
        }
        else {
            this.props.interactionCallback({ ...this.props.selectedElement, "storyMode": val })
        }

    }

    toggleRatingDuration(val) {
        this.props.interactionCallback({ ...this.props.selectedElement, "ratingDurationToggle": val })
    }

    toggleYear(val) {
        const showInfo = this.props.renderData[val][this.props.selectedElement.premiereStatus === "premiere" ? "series-prems" : "series-repeats"][this.props.selectedElement.timePeriod].filter((s) => { if (s.name === this.props.selectedElement.name) return true; return false; })

        if (showInfo.length) {
            this.props.interactionCallback({ ...this.props.selectedElement, "selectedYear": val, ...showInfo[0] })
        }
        else {
            //the show wasnt found in the newly selected year
            //delete the data
            this.props.interactionCallback({ ...this.deleteShowProps(this.props.selectedElement), "selectedYear": val })
        }

    }

    showFullYear() {
        const showInfo = this.props.renderData[this.props.selectedElement.selectedYear][this.props.selectedElement.premiereStatus === "premiere" ? "series-prems" : "series-repeats"]["FullYear"].filter((s) => { if (s.name === this.props.selectedElement.name) return true; return false; })
        this.props.interactionCallback({ ...this.props.selectedElement, ...showInfo[0], "timePeriod": "FullYear" })
    }

    deselectShow() {
        this.props.interactionCallback({ ...this.deleteShowProps(this.props.selectedElement) })
    }

    donutClickHandler(dataOb) {
        if (dataOb.name === null) {
            this.deselectShow();
        }
        else {
            this.props.interactionCallback({ ...this.props.selectedElement, ...dataOb })
        }

    }

    linegraphClickHandler(monthOb) {
        let showInfo = [],
            showIndicator = "";
        if (monthOb.name !== null) {
            if (this.props.selectedElement.hasOwnProperty("premiereStatus")) {
                //need to update the series-info to only show data for the current month
                if (this.props.selectedElement.premiereStatus === "premiere") {
                    showIndicator = "series-prems";
                }
                else {
                    showIndicator = "series-repeats";
                }
                showInfo = this.props.renderData[this.props.selectedElement.selectedYear][showIndicator][monthOb.timePeriod].filter((s) => { if (s.name === this.props.selectedElement.name) return true; return false; })
            }

            if (showInfo.length) {
                this.props.interactionCallback({ ...this.props.selectedElement, "timePeriod": monthOb.timePeriod, ...showInfo[0] })
            }
            else {
                this.props.interactionCallback({ ...this.deleteShowProps(this.props.selectedElement), "timePeriod": monthOb.timePeriod })
            }
        }
        else {
            this.props.interactionCallback({ ...this.deleteShowProps(this.props.selectedElement) })
        }
    }

    componentDidMount() {
        console.log("Mounted vizpod ", this.props.network)
    }
    shouldComponentUpdate(nextProps) {
        return (!deepEqual(nextProps.selectedElement, this.props.selectedElement));
    }

    render() {
        const { renderData, network, selectedElement, storyData } = this.props;
        //console.log("Rendering vizpod", network)


        const filterPeriod = selectedElement.timePeriod,
            selectedYear = selectedElement.selectedYear;

        let selectedData = {
            "prime": renderData[selectedYear].prime[filterPeriod],
            "premieres": renderData[selectedYear].premieres[filterPeriod],
            "repeats": renderData[selectedYear].repeats[filterPeriod],
            "series-prems": renderData[selectedYear]["series-prems"][filterPeriod],
            "series-repeats": renderData[selectedYear]["series-repeats"][filterPeriod]
        };

        const years = ["2016", "2017"];
        let allShowsSet = [];

        years.forEach((yr) => {
            allShowsSet = allShowsSet.concat(...renderData[yr]["series-prems"][selectedElement.timePeriod]);
            allShowsSet = allShowsSet.concat(...renderData[yr]["series-repeats"][selectedElement.timePeriod]);
        })

        const ratingDurationToggle = selectedElement.ratingDurationToggle;

        const ratingRange =
            [allShowsSet.reduce((accumulator, curr) => {
                if (curr[ratingDurationToggle] < accumulator[ratingDurationToggle]) {
                    return curr;
                }
                return accumulator;
            })[ratingDurationToggle],
            allShowsSet.reduce((accumulator, curr) => {
                if (curr[ratingDurationToggle] > accumulator[ratingDurationToggle]) {
                    return curr
                }
                return accumulator;
            })[ratingDurationToggle]];

        const labelLookup = {
            "FullYear": "Full Year",
            "Jan": "January",
            "Feb": "February",
            "Mar": "March",
            "Apr": "April",
            "May": "May",
            "Jun": "June",
            "Jul": "July",
            "Aug": "August",
            "Sep": "September",
            "Oct": "October",
            "Nov": "November",
            "Dec": "December"
        }

        const yearOptions = [{ "value": "2016", "label": "2016" }, { "value": "2017", "label": "2017" }];

        let renderStory = {};

        if (storyData.hasOwnProperty("0") && selectedElement.storyMode) {
            renderStory = { ...storyData[selectedElement.storyPosition], "storyPosition": selectedElement.storyPosition, "numSlides": Object.keys(storyData).length };
        }



        return (
            <div className="vizpodContainer">
                <div className="topContainer">
                    <img className="logoImage" src={"img/" + network + ".png"} />
                    <div className="buttonsContainer">
                        <ToggleSwitch option1={yearOptions[0]} option2={yearOptions[1]} selectedOption={selectedElement.selectedYear} interactionCallback={val => { this.toggleYear(val) }} />
                        <ToggleSwitch option1={{ "label": "DURATION", "value": "mins" }} option2={{ "label": "RATINGS", "value": "aa" }} interactionCallback={val => { this.toggleRatingDuration(val) }} selectedOption={selectedElement.ratingDurationToggle} />
                        {storyData.hasOwnProperty("0") &&
                            <ToggleSwitch option1={{ "label": "", "value": false }} option2={{ "label": "STORY MODE", "value": true }} selectedOption={selectedElement.storyMode} interactionCallback={val => { this.toggleStorymode(val) }} />
                        }
                    </div>
                </div>

                <div className="floatLeft">
                    <span className="bubbleSpan">Monthly Trends</span>
                    <MultiLineAndBars renderData={renderData[selectedYear]} interactionCallback={(ob) => { this.linegraphClickHandler(ob) }} selectedElement={selectedElement} />
                </div>

                <div className="floatLeft">
                    <span className="bubbleSpan">{labelLookup[selectedElement.timePeriod]}</span><span className="bubbleSpan">{selectedElement.selectedYear}</span>
                    {selectedElement.timePeriod !== "FullYear" &&
                        <span className="buttonSpan" onClick={(e) => { this.showFullYear(e) }}>Show Full Year</span>
                    }
                    <DonutRadial renderData={selectedData} interactionCallback={(ob) => this.donutClickHandler(ob)} selectedElement={selectedElement} ratingDurationToggle={ratingDurationToggle} ratingRange={ratingRange} />
                </div>

                {renderStory.hasOwnProperty("message") &&
                    <StoryBox {...renderStory} endStory={() => { this.toggleStorymode(false) }} changeSlide={(val) => { this.changeSlide(val) }} />
                }

            </div>);
    }
}

VizPod.propTypes = {
    renderData: PropTypes.object.isRequired,
    interactionCallback: PropTypes.func.isRequired,
    selectedElement: PropTypes.object.isRequired,
    network: PropTypes.string.isRequired,
    storyData: PropTypes.object.isRequired
}
