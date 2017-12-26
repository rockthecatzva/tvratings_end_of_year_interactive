import React, { Component } from 'react'
import PropTypes from 'prop-types';
import styled from 'styled-components'

import MultiLineAndBars from '../components/MultiLineAndBars'
import DonutRadial from '../components/DonutRadial'

export default class VizPod extends Component {

    showFullYear(e){
        e.preventDefault();
        this.props.interactionCallback({"timePeriod": "FullYear"})
    }

    donutClickHandler(dataOb) {
        this.props.interactionCallback({...dataOb, "timePeriod": this.props.selectedElement.timePeriod})
    }
    
    linegraphClickHandler(monthOb){
        this.props.interactionCallback(monthOb)
    }

    render() {
        const { renderData, interactionCallback, ratingDurationToggle, network, selectedElement, ratingRange } = this.props;

        const width = 450,
            height = 1050;

        const PodDiv = styled.div`
                width: ${width + "px"};
                height: ${height + "px"};
                float: left;
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
        
        let filterPeriod = selectedElement.timePeriod;
        let selectedData = {"prime": renderData.prime[filterPeriod], 
                            "premieres": renderData.premieres[filterPeriod], 
                            "repeats": renderData.repeats[filterPeriod],
                            "series-prems": renderData["series-prems"][filterPeriod],
                            "series-repeats": renderData["series-repeats"][filterPeriod]};

        if(selectedElement.hasOwnProperty("month")){

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

        return (
            <PodDiv>
                <NetworkLabel>{network}</NetworkLabel>
                <p>Prime hours for {labelLookup[selectedElement.timePeriod]}
                    {selectedElement.timePeriod!=="FullYear" &&
                        <Button onClick={(e)=>{this.showFullYear(e)}}>Show Full Year</Button>
                    }
                </p>
                
                
                <DonutRadial renderData={selectedData} interactionCallback={(ob)=>this.donutClickHandler(ob)} selectedElement={selectedElement} ratingDurationToggle={ratingDurationToggle} ratingRange={ratingRange} />
                <MultiLineAndBars renderData={renderData} interactionCallback={(ob)=>{this.linegraphClickHandler(ob)}} selectedElement={selectedElement} />

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
