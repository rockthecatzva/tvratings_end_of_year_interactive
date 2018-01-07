import React, { Component } from 'react'
import PropTypes from 'prop-types';
import styled from 'styled-components'

import MultiLineAndBars from '../components/MultiLineAndBars'
import DonutRadial from '../components/DonutRadial'
import ToggleSwitch from '../components/ToggleSwitch'

export default class VizPod extends Component {

    toggleYear(val){
        const showInfo = this.props.renderData[val][this.props.selectedElement.premiereStatus === "premiere" ? "series-prems" : "series-repeats"][this.props.selectedElement.timePeriod].filter((s) => { if (s.name === this.props.selectedElement.name) return true; })
        console.log(this.props.selectedElement, showInfo[0])
        if(showInfo.length){
            this.props.interactionCallback({...this.props.selectedElement, "selectedYear": val, ...showInfo[0]})
        }
        else{
            //the show wasnt found in the newly selected year
            //delete the data
            let elem = this.props.selectedElement;
            delete elem.name;
            delete elem.aa;
            delete elem.mins;
            delete elem.premiereStatus;
            
            this.props.interactionCallback({...elem, "selectedYear": val})
        }
        
    }

    showFullYear(e) {
        e.preventDefault();
        const showInfo = this.props.renderData[this.props.selectedElement.selectedYear][this.props.selectedElement.premiereStatus === "premiere" ? "series-prems" : "series-repeats"]["FullYear"].filter((s) => { if (s.name === this.props.selectedElement.name) return true; })
        console.log(this.props.selectedElement, showInfo[0])
        this.props.interactionCallback({ ...showInfo[0], "premiereStatus": this.props.selectedElement.premiereStatus, "timePeriod": "FullYear", "selectedYear": this.props.selectedElement.selectedYear})
    }

    deselectShow(e) {
        e.preventDefault();
        this.props.interactionCallback({ "timePeriod": this.props.selectedElement.timePeriod, "selectedYear": this.props.selectedElement.selectedYear })
    }

    donutClickHandler(dataOb) {
        this.props.interactionCallback({ ...dataOb, "timePeriod": this.props.selectedElement.timePeriod, "selectedYear": this.props.selectedElement.selectedYear })
    }

    linegraphClickHandler(monthOb) {
        console.log(monthOb, this.props.selectedElement);
        let showInfo = [],
            showIndicator = "";

        if (this.props.selectedElement.hasOwnProperty("premiereStatus")) {
            //need to update the series-info to only show data for the current month
            if (this.props.selectedElement.premiereStatus === "premiere") {
                showIndicator = "series-prems";
            }
            else {
                showIndicator = "series-repeats";
            }
            showInfo = this.props.renderData[this.props.selectedElement.selectedYear][showIndicator][monthOb.timePeriod].filter((s) => { if (s.name === this.props.selectedElement.name) return true; })
        }

        if (showInfo.length) {
            this.props.interactionCallback({ "timePeriod": monthOb.timePeriod, "selectedYear": this.props.selectedElement.selectedYear, ...showInfo[0], "premiereStatus": this.props.selectedElement.premiereStatus })
        }
        else {
            this.props.interactionCallback({ "timePeriod": monthOb.timePeriod, "selectedYear": this.props.selectedElement.selectedYear })
        }

        //this.props.interactionCallback({ ...this.props.selectedElement, ...monthOb })
    }

    render() {
        const { renderData, interactionCallback, ratingDurationToggle, network, selectedElement } = this.props;

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
              `;

        const NetworkLabel = styled.p`
              font-size: 1.2em;
              font-weight: bold;
              text-align: center;`

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
        const RemoveShowButton = styled.div`
              padding: 3px;
              font-size: 0.8em;
              background-color: #fff;
              border: solid 1px #000;
              border-radius: 3px;  
              cursor: pointer;
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

        const years =["2016", "2017"];
        let allShowsSet = [];

        years.forEach((yr)=>{
            allShowsSet = allShowsSet.concat(...renderData[yr]["series-prems"][selectedElement.timePeriod]);
            allShowsSet = allShowsSet.concat(...renderData[yr]["series-repeats"][selectedElement.timePeriod]);
        })

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

        const MaxWidth = styled.div`
            width: 100%
            height: 1em;`;


        const DonutLabel = styled.div`
            text-align: center;
            font-size: 1.2em;`;

        const NetLogo = styled.img`
            max-width: 200px;
            max-height: 75px;
            
       `;

        const LogoContainer = styled.span`
        position: absolute;
        `;

        const LineContainer = styled.div`
        float: left;
        padding-left: 3em;`;

        const DonutContainer = styled.div`
        float: left;
            `

        const Bubbleify = styled.span`
            padding: 4px;
            border: solid 1px #000;
            background-color: #000;
            color: #fff;
            border-radius: 3px;
            font-weight: bold;
            text-align: center;`;

        const BubbleifyGrey = styled.span`
            font-size: 0.8em;
            padding: 4px;
            background-color: #aeb6bf;
            color: #000;
            border-radius: 3px;
            text-align: center;`;


        const Clickable = styled.span`
            font-size: 1.6em;
            cursor: pointer;
            position: relative;
            top: 0.17em`

        const FilterAlert = styled.span`
            font-size: 0.8em;
            color: red;`

        const shortIndicator = (selectedElement.premiereStatus === "premiere") ? " (P)" : " (R)";

        const yearOptions = [{"value": "2016", "label": "2016"}, {"value": "2017", "label": "2017"}];

        return (
            <PodDiv>
                <LogoContainer>
                    <NetLogo src={"../img/" + network + ".png"} />
                </LogoContainer>

                <ToggleSwitch option1={yearOptions[0]} option2={yearOptions[1]} selectedOption={selectedElement.selectedYear} interactionCallback={val=>{this.toggleYear(val)}} />

                <LineContainer>
                    <div><Bubbleify>Monthly Trends</Bubbleify></div>
                    {selectedElement.hasOwnProperty("name") &&
                        <div><BubbleifyGrey> <Clickable onClick={(e) => { this.deselectShow(e) }} >	&#9447;</Clickable>{selectedElement.name + shortIndicator}</BubbleifyGrey></div>
                    }
                    <MultiLineAndBars renderData={renderData[selectedYear]} interactionCallback={(ob) => { this.linegraphClickHandler(ob) }} selectedElement={selectedElement} />
                </LineContainer>

                <DonutContainer>

                    <DonutLabel>
                        <Bubbleify>{labelLookup[selectedElement.timePeriod]}</Bubbleify>

                        {selectedElement.timePeriod !== "FullYear" &&
                            <Button onClick={(e) => { this.showFullYear(e) }}>Show Full Year</Button>
                        }
                    </DonutLabel>


                    <DonutRadial renderData={selectedData} interactionCallback={(ob) => this.donutClickHandler(ob)} selectedElement={selectedElement} ratingDurationToggle={ratingDurationToggle} ratingRange={ratingRange} />
                </DonutContainer>

            </PodDiv>);
    }
}

VizPod.propTypes = {
    renderData: PropTypes.object.isRequired,
    interactionCallback: PropTypes.func.isRequired,
    selectedElement: PropTypes.object.isRequired,
    network: PropTypes.string.isRequired,
    ratingDurationToggle: PropTypes.string.isRequired
}
