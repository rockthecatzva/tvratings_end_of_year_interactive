import React, { Component } from 'react'
import PropTypes from 'prop-types';
import styled from 'styled-components'

import MultiLineAndBars from '../components/MultiLineAndBars'
import DonutRadial from '../components/DonutRadial'

export default class VizPod extends Component {

    showFullYear(e) {
        e.preventDefault();
        this.props.interactionCallback({ ...this.props.selectedElement, "timePeriod": "FullYear" })
    }

    deselectShow(e) {
        e.preventDefault();
        this.props.interactionCallback({ "timePeriod": this.props.selectedElement.timePeriod })
    }

    donutClickHandler(dataOb) {
        this.props.interactionCallback({ ...dataOb, "timePeriod": this.props.selectedElement.timePeriod })
    }

    linegraphClickHandler(monthOb) {
        console.log(monthOb, this.props.selectedElement);
        let showInfo = [],
            showIndicator = "";

        if(this.props.selectedElement.hasOwnProperty("premiereStatus")){
            //need to update the series-info to only show data for the current month
            if(this.props.selectedElement.premiereStatus==="premiere"){
                showIndicator = "series-prems";
            }
            else{
                showIndicator = "series-repeats";
            }
            showInfo = this.props.renderData[showIndicator][monthOb.timePeriod].filter((s)=>{if (s.name===this.props.selectedElement.name) return true;})
        }

        if(showInfo.length){
            this.props.interactionCallback({"timePeriod": monthOb.timePeriod, ...showInfo[0], "premiereStatus": this.props.selectedElement.premiereStatus})
        }
        else{
            this.props.interactionCallback({"timePeriod": monthOb.timePeriod})
        }
        
        //this.props.interactionCallback({ ...this.props.selectedElement, ...monthOb })
    }

    render() {
        const { renderData, interactionCallback, ratingDurationToggle, network, selectedElement, ratingRange } = this.props;

        const width = 450,
            height = 1050;

        const PodDiv = styled.div`
                width: ${width + "px"};
                height: ${height + "px"};
                float: left;
                padding: 15px;
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

        let filterPeriod = selectedElement.timePeriod;
        let selectedData = {
            "prime": renderData.prime[filterPeriod],
            "premieres": renderData.premieres[filterPeriod],
            "repeats": renderData.repeats[filterPeriod],
            "series-prems": renderData["series-prems"][filterPeriod],
            "series-repeats": renderData["series-repeats"][filterPeriod]
        };

        if (selectedElement.hasOwnProperty("month")) {

        }

        const labelLookup = {
            "FullYear": "Full Year 2017",
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
            margin-left: auto;
            margin-right: auto;
            display: block;`;

        const LogoContainer = styled.div`
            height: 100px;
            display: flex;
            justify-content: center;
            align-items: center;
        `;

        const LineContainer = styled.div`
            position: relative;
            top: -70px;
            text-align: center;`;

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

        const shortIndicator = (selectedElement.premiereStatus==="premiere") ? " (P)":" (R)";
        
        return (
            <PodDiv>
                <LogoContainer>
                    <NetLogo src={"../img/" + network + ".png"} />
                </LogoContainer>

                <DonutLabel>
                    <Bubbleify>{labelLookup[selectedElement.timePeriod]}</Bubbleify>

                    {selectedElement.timePeriod !== "FullYear" &&
                        <Button onClick={(e) => { this.showFullYear(e) }}>Show Full Year</Button>
                    }
                </DonutLabel>


                <DonutRadial renderData={selectedData} interactionCallback={(ob) => this.donutClickHandler(ob)} selectedElement={selectedElement} ratingDurationToggle={ratingDurationToggle} ratingRange={ratingRange} />

                <LineContainer>
                    <div><Bubbleify>Monthly Trends</Bubbleify></div>
                    {selectedElement.hasOwnProperty("name") &&
                        <div><BubbleifyGrey> <Clickable onClick={(e) => { this.deselectShow(e) }} >	&#9447;</Clickable>{selectedElement.name+shortIndicator}</BubbleifyGrey></div>
                    }

                    {selectedElement.timePeriod !== "FullYear" &&
                        <div><FilterAlert> <Clickable onClick={(e) => { this.showFullYear(e) }} >	&#9447;</Clickable>{selectedElement.timePeriod.toUpperCase()} filter applied above</FilterAlert></div>
                    }

                    <MultiLineAndBars renderData={renderData} interactionCallback={(ob) => { this.linegraphClickHandler(ob) }} selectedElement={selectedElement} />
                </LineContainer>
            </PodDiv>);
    }
}

VizPod.propTypes = {
    renderData: PropTypes.object.isRequired,
    interactionCallback: PropTypes.func.isRequired,
    selectedElement: PropTypes.object.isRequired,
    ratingRange: PropTypes.array.isRequired,
    network: PropTypes.string.isRequired,
    ratingDurationToggle: PropTypes.string.isRequired
}
