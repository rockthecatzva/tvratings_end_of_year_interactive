import React, { Component } from 'react'
import PropTypes from 'prop-types';
import styled from 'styled-components'

import MultiLineAndBars from '../components/MultiLineAndBars'
import DonutRadial from '../components/DonutRadial'
import ToggleSwitch from '../components/ToggleSwitch'
//import RadioButtonBinary from '../components/RadioButtonBinary'
//import CheckBox from '../components/CheckBox'
import StoryBox from '../components/StoryBox'

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
            console.log(showInfo)
            nextStory = { ...this.props.selectedElement, ...nextStoryData, ...showInfo[0] }
        }
        console.log("Changing the slide to ", val, nextStory);
        this.props.interactionCallback({ ...nextStory, "storyPosition": val })
    }

    toggleStorymode(val) {
        console.log(val)
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
        console.log(this.props.selectedElement, showInfo[0])
        if (showInfo.length) {
            this.props.interactionCallback({ ...this.props.selectedElement, "selectedYear": val, ...showInfo[0] })
        }
        else {
            //the show wasnt found in the newly selected year
            //delete the dat         
            this.props.interactionCallback({ ...this.deleteShowProps(this.props.selectedElement), "selectedYear": val })
        }

    }

    showFullYear() {
        const showInfo = this.props.renderData[this.props.selectedElement.selectedYear][this.props.selectedElement.premiereStatus === "premiere" ? "series-prems" : "series-repeats"]["FullYear"].filter((s) => { if (s.name === this.props.selectedElement.name) return true; return false;})
        this.props.interactionCallback({ ...this.props.selectedElement, ...showInfo[0], "timePeriod": "FullYear" })
    }

    deselectShow() {
        this.props.interactionCallback({ ...this.deleteShowProps(this.props.selectedElement) })
    }

    donutClickHandler(dataOb) {
        console.log(dataOb)
        if (dataOb.name === null) {
            this.deselectShow();
        }
        else {
            this.props.interactionCallback({ ...this.props.selectedElement, ...dataOb })
        }

    }

    linegraphClickHandler(monthOb) {
        console.log(monthOb, this.props.selectedElement);
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
            this.props.interactionCallback({ ...this.deleteShowProps(this.props.selectedElement)})
        }
    }

    render() {
        const { renderData, network, selectedElement, storyData } = this.props;

        const width = 1050,
            height = 600;

        const PodDiv = styled.div`
                width: ${width + "px"};
                height: ${height + "px"};
                padding: 15px;
                border-top: solid 1px #AEB6BF;
                margin-top: 2em;
                margin-left: auto;
                margin-right: auto;
                clear: both;
                position: relative;
              `;

        const Button = styled.span`
                padding: 3px;
                font-size: 0.6em;
                background-color: #fff;
                border: solid 1px #000;
                border-radius: 3px;  
                cursor: pointer;
                margin-left: 1em;
                top: -0.3em;
                position: relative;
              `;

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

        const NetLogo = styled.img`
            max-width: 200px;
            max-height: 75px;
            
       `;

        const TopContainer = styled.div`
        position: relative;
        height: fit-content;
        `;

        const ButtonGroup = styled.div`
        font-size: 0.8em;
        position: absolute;
        right: 0px;
        top: 0px;`

        const LineContainer = styled.div`
        float: left;
        text-align: center;
        padding-left: 3em;`;

        const DonutContainer = styled.div`
        text-align: center;
        float: left;
            `

        const Bubbleify = styled.span`
            padding: 4px;
            background-color: #000;
            color: #fff;
            border-radius: 3px;
            margin: 2px;
            font-weight: bold;
            text-align: center;`;


        const yearOptions = [{ "value": "2016", "label": "2016" }, { "value": "2017", "label": "2017" }];

        let renderStory = {};

        if (storyData.hasOwnProperty("0") && selectedElement.storyMode) {
            renderStory = { ...storyData[selectedElement.storyPosition], "storyPosition": selectedElement.storyPosition, "numSlides": Object.keys(storyData).length };
        }



        return (
            <PodDiv>
                <TopContainer>
                    <NetLogo src={"../img/" + network + ".png"} />

                    <ButtonGroup>
                        <ToggleSwitch option1={yearOptions[0]} option2={yearOptions[1]} selectedOption={selectedElement.selectedYear} interactionCallback={val => { this.toggleYear(val) }} />
                        <ToggleSwitch option1={{ "label": "Duration", "value": "mins" }}
                            option2={{ "label": "Ratings", "value": "aa" }}
                            interactionCallback={val => { this.toggleRatingDuration(val) }}
                            selectedOption={selectedElement.ratingDurationToggle}
                        />
                        {storyData.hasOwnProperty("0") &&
                            <ToggleSwitch option1={{ "label": "", "value": false }} option2={{ "label": "Story mode", "value": true }}
                                selectedOption={selectedElement.storyMode} interactionCallback={val => { this.toggleStorymode(val) }} />

                        }
                    </ButtonGroup>
                </TopContainer>

                <LineContainer>
                    <Bubbleify>Monthly Trends</Bubbleify>
                    <MultiLineAndBars renderData={renderData[selectedYear]} interactionCallback={(ob) => { this.linegraphClickHandler(ob) }} selectedElement={selectedElement} />
                </LineContainer>

                <DonutContainer>

                    <Bubbleify>{labelLookup[selectedElement.timePeriod]}</Bubbleify><Bubbleify>{selectedElement.selectedYear}</Bubbleify>

                    {selectedElement.timePeriod !== "FullYear" &&
                        <Button onClick={(e) => { this.showFullYear(e) }}>Show Full Year</Button>
                    }

                    <DonutRadial renderData={selectedData} interactionCallback={(ob) => this.donutClickHandler(ob)} selectedElement={selectedElement} ratingDurationToggle={ratingDurationToggle} ratingRange={ratingRange} />
                </DonutContainer>

                {renderStory.hasOwnProperty("message") &&
                    <StoryBox {...renderStory} endStory={() => { this.toggleStorymode(false) }} changeSlide={(val) => { this.changeSlide(val) }} />
                }

            </PodDiv>);
    }
}

VizPod.propTypes = {
    renderData: PropTypes.object.isRequired,
    interactionCallback: PropTypes.func.isRequired,
    selectedElement: PropTypes.object.isRequired,
    network: PropTypes.string.isRequired,
    storyData: PropTypes.object.isRequired
}
