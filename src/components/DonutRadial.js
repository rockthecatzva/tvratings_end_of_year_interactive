import React, { Component } from 'react'
import PropTypes from 'prop-types';
import styled from 'styled-components'
import * as d3 from 'd3';
import {
    scaleLinear as d3ScaleLinear
} from 'd3-scale';
import { arc as d3Arc } from 'd3-shape'

import MultiLineAndBars from '../components/MultiLineAndBars'

export default class DonutRadial extends Component {

    clickHandler(e, show, premiereStatus) {
        //this.props.interactionCallback(show.name + " " + show.aa + "k avg " + Math.round(show.mins / 60) + "hrs")
        this.props.interactionCallback({...show, ...{premiereStatus}})
    }

    render() {
        const { renderData, ratingDurationToggle, network, selectedElement, ratingRange } = this.props;
        //console.log(ratingRange)

        const width = 450,
            height = 550;

        const Donut = styled.div`
                width: ${width + "px"};
                height: ${height + "px"};
                float: left;
              `;

        const SVG = styled.svg`
            width: ${(width+50) + "px"};
            height: ${(height+50) + "px"};
              `;

        const InnerRing = styled.path`
            fill: rgb(122,122,0);
            stroke: rgb(0,0,0);`;

        const InnerPremieres = styled.path`
            fill: rgb(51,51,255);
            stroke: rgb(255,255,255);`;

        const InnerRepeats = styled.path`
            fill: #AEB6BF;
            stroke: rgb(255,255,255);`;

        const ShowArc = styled.path`
            fill: rgb(255,255,255);
            stroke: rgb(0,0,0);`;

        
        const ShowArcPrems = styled.path`
            fill: rgb(51,51,255);
            stroke: #fff;`;
        
        const ShowArcRepeats = styled.path`
            fill: #AEB6BF;
            stroke: #fff;`;

        const ShowArcSelected = styled.path`
            fill: #f00;
            stroke: #fff;`
        
        const innerCircleRadius = 140,
            primaryDonutRadiusInner = innerCircleRadius - 60,
            primaryDonutRadiusOuter = innerCircleRadius,
            innerArc = d3Arc()
                .innerRadius(primaryDonutRadiusInner)
                .outerRadius(primaryDonutRadiusOuter),
            seriesArcRadiusInner = 141,
            seriesArc = d3Arc()
                .innerRadius(seriesArcRadiusInner);

        let renderLabels = [],
            arcSet = [];

        const totalDuration = renderData.premieres.FullYear.mins + renderData.repeats.FullYear.mins;
        const premPieSize = (Math.PI * 2) * (renderData.premieres.FullYear.mins / totalDuration);
        const precentPrems = Math.round((renderData.premieres.FullYear.mins/totalDuration)*100),
              percentRepeats = Math.round((renderData.repeats.FullYear.mins/totalDuration)*100);

        arcSet.push(<InnerPremieres transform={"translate(" + width / 2 + "," + height / 2 + ")"} d={innerArc({ startAngle: 0, endAngle: premPieSize })} key={0} />);

        let centroid = innerArc.centroid({ startAngle: 0, endAngle: premPieSize });//need to reduce redundancy
        renderLabels.push(<text transform={"translate(" + width / 2 + "," + ((height / 2)-5) + ")"} fontSize={10} textAnchor={"middle"} stroke={"none"} fill={"#fff"} x={centroid[0]} y={centroid[1]}     >{precentPrems+"%"}</text>)
        renderLabels.push(<text transform={"translate(" + width / 2 + "," + ((height / 2)+5) + ")"} fontSize={10} textAnchor={"middle"} stroke={"none"} fill={"#fff"} x={centroid[0]} y={centroid[1]}     >Premieres</text>)

        const repeatPieSize = (Math.PI * 2) * (renderData.repeats.FullYear.mins / totalDuration);
        arcSet.push(<InnerRepeats transform={"translate(" + width / 2 + "," + height / 2 + ")"} d={innerArc({ startAngle: premPieSize, endAngle: repeatPieSize + premPieSize })} key={1} />);
        centroid = innerArc.centroid({ startAngle: premPieSize, endAngle: repeatPieSize + premPieSize });//need to reduce redundancy
        renderLabels.push(<text transform={"translate(" + width / 2 + "," + ((height / 2)-5) + ")"} fontSize={10} textAnchor={"middle"} stroke={"none"} fill={"#000"} x={centroid[0]} y={centroid[1]}     >{percentRepeats+"%"}</text>)
        renderLabels.push(<text transform={"translate(" + width / 2 + "," + ((height / 2)+5) + ")"} fontSize={10} textAnchor={"middle"} stroke={"none"} fill={"#000"} x={centroid[0]} y={centroid[1]}     >Repeats</text>)
        
        
        
        const durationMinimum = 360;

        const premList = renderData["series-prems"]["FullYear"].sort((a, b) => {
            if (a[ratingDurationToggle] < b[ratingDurationToggle]) return 1;
            if (a[ratingDurationToggle] > b[ratingDurationToggle]) return -1;
            return 0;
        }).filter(show => { return show.mins >= durationMinimum })

        const repeatList = renderData["series-repeats"]["FullYear"].sort((a, b) => {
            if (a[ratingDurationToggle] < b[ratingDurationToggle]) return 1;
            if (a[ratingDurationToggle] > b[ratingDurationToggle]) return -1;
            return 0;
        }).filter(show => { return show.mins >= durationMinimum })


        const maxRatingRad = 300,
            minRatingRad = 150;

        let startAngle = 0,
            endAngle = 0,
            rad = 0;

        const premArcWidth = 1 / premList.length,
            repeatArcWidth = 1 / repeatList.length;

        const hScale = d3ScaleLinear()
            .domain(ratingRange)
            .range([minRatingRad, maxRatingRad]);



        premList.forEach(function (show) {
            rad = hScale(show[ratingDurationToggle])
            endAngle += (premPieSize) * premArcWidth;
            if(selectedElement.premiereStatus==="premiere" && selectedElement.name===show.name){
                arcSet.push(<ShowArcSelected transform={"translate(" + width / 2 + "," + height / 2 + ")"} d={seriesArc({ startAngle: startAngle, endAngle: endAngle, outerRadius: rad })} onClick={(e) => { this.clickHandler(e, show, "premiere") }} />)
            }
            else{
                arcSet.push(<ShowArcPrems transform={"translate(" + width / 2 + "," + height / 2 + ")"} d={seriesArc({ startAngle: startAngle, endAngle: endAngle, outerRadius: rad })} onClick={(e) => { this.clickHandler(e, show, "premiere") }} />)
            }
            
            startAngle += (premPieSize) * premArcWidth;
        }, this);

        repeatList.forEach(function (show) {
            rad = hScale(show[ratingDurationToggle])
            endAngle += (repeatPieSize) * repeatArcWidth;
            if(selectedElement.premiereStatus==="repeat" && selectedElement.name===show.name){
                arcSet.push(<ShowArcSelected transform={"translate(" + width / 2 + "," + height / 2 + ")"} d={seriesArc({ startAngle: startAngle, endAngle: endAngle, outerRadius: rad })} onClick={(e) => { this.clickHandler(e, show, "repeat") }} />)
            }
            else{
                arcSet.push(<ShowArcRepeats transform={"translate(" + width / 2 + "," + height / 2 + ")"} d={seriesArc({ startAngle: startAngle, endAngle: endAngle, outerRadius: rad })} onClick={(e) => { this.clickHandler(e, show, "repeat") }} />)
            }
            
            startAngle += (repeatPieSize) * repeatArcWidth;
        }, this);




        const TextShowname = styled.text`
                font-size: 0.9em`,
              TextInfo = styled.text`
                fill: #7D7D7D;
                stroke: none;
                font-size: 0.8em`

        let messageBox = [];//<text x={width / 2} y={height / 2} textAnchor={"middle"} >{"temp"}</text>
        if(selectedElement.hasOwnProperty("name")){
            messageBox.push(<TextShowname x={width / 2} y={(height / 2)} textAnchor={"middle"} >{selectedElement.name}</TextShowname>)
            messageBox.push(<TextInfo x={width / 2} y={(height / 2)+17} textAnchor={"middle"} >{selectedElement.aa+"k avg"}</TextInfo>)
            messageBox.push(<TextInfo x={width / 2} y={(height / 2)+34} textAnchor={"middle"} >{Math.round(selectedElement.mins/60)+" "+selectedElement.premiereStatus+" hrs"}</TextInfo>)
        }
        else{
           messageBox.push(<text x={width / 2} y={height / 2} textAnchor={"middle"} >{"Full Year Prime: "+renderData.prime.FullYear+"k"}</text>)
        }

        const PrimeCircle = styled.circle`
            fill: none;
            stroke: #000;
            stroke-width: 2;
            `;

        const PremiereCircle = styled.circle`
            fill: none;
            stroke: #000;
            stroke-width: 2;`;

        
        let primeAvgCircle = null,
            premiereAvgCircle = null;
        

        if(ratingDurationToggle==="aa"){
            primeAvgCircle = <PrimeCircle transform={"translate(" + width / 2 + "," + height / 2 + ")"} r={hScale(renderData.prime.FullYear)} strokeDasharray={"5,5"} />
            renderLabels.push(<circle transform={"translate(" + width / 2 + "," + height / 2 + ")"} r={4} stroke={"none"} fill={"#000"} cx={0} cy={-hScale(renderData.prime.FullYear)}/>)
            renderLabels.push(<line  transform={"translate(" + width / 2 + "," + height / 2 + ")"} stroke={"#000"} strokeDasharray={"5,5"} x1={-140} y1={-hScale(renderData.prime.FullYear)} x2={0} y2={-hScale(renderData.prime.FullYear)}  />)
            renderLabels.push(<text transform={"translate(" + width / 2 + "," + ((height / 2)+5) + ")"} stroke={"none"} fill={"#000"} x={-220} y={-hScale(renderData.prime.FullYear)+4}  fontSize={11} >{"Prime avg: "+renderData.prime.FullYear+"k"}</text>)
            
            premiereAvgCircle = <PremiereCircle transform={"translate(" + width / 2 + "," + height / 2 + ")"} r={hScale(renderData.premieres.FullYear.aa)} strokeDasharray={"5,5"} />
            renderLabels.push(<circle transform={"translate(" + width / 2 + "," + height / 2 + ")"} r={4} stroke={"none"} fill={"#000"} cx={0} cy={-hScale(renderData.premieres.FullYear.aa)}/>)
            renderLabels.push(<line  transform={"translate(" + width / 2 + "," + height / 2 + ")"} stroke={"#000"} strokeDasharray={"5,5"} x1={-130} y1={-hScale(renderData.premieres.FullYear.aa)} x2={0} y2={-hScale(renderData.premieres.FullYear.aa)}  />)
            renderLabels.push(<text transform={"translate(" + width / 2 + "," + ((height / 2)-5) + ")"} stroke={"none"} fill={"#000"} x={-220} y={-hScale(renderData.premieres.FullYear.aa)+4}  fontSize={11} >{"Premiere avg: "+renderData.premieres.FullYear.aa+"k"}</text>)
        }
        



        const NetworkLabel = styled.p`
            font-size: 1.2em;
            font-weight: bold;
            text-align: center;`

        return (
            <Donut>
                <NetworkLabel>{network}</NetworkLabel>
                <SVG>
                    {arcSet}
                    {messageBox}
                    {primeAvgCircle}
                    {renderLabels}
                    {premiereAvgCircle}
                </SVG>

            <MultiLineAndBars renderData={renderData} interactionCallback={(e, ob)=>{this.clickHandler(e,ob,null)}} selectedElement={selectedElement} />

            </Donut>);
    }
}

DonutRadial.propTypes = {
    renderData: PropTypes.object.isRequired,
    interactionCallback: PropTypes.func.isRequired,
    selectedElement: PropTypes.object.isRequired,
    ratingRange: PropTypes.array.isRequired,
    network: PropTypes.string.isRequired,
    ratingDurationToggle: PropTypes.string.isRequired
}
