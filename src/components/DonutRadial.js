import React, { Component } from 'react'
import PropTypes from 'prop-types';
import styled from 'styled-components'
import * as d3 from 'd3';
import {
    scaleLinear as d3ScaleLinear
} from 'd3-scale';
import { arc as d3Arc } from 'd3-shape'

export default class DonutRadial extends Component {

    render() {
        const { renderData, ratingDurationToggle, selectedElement, ratingRange, interactionCallback } = this.props;
        //console.log(renderData)

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

        const totalDuration = renderData.premieres.mins + renderData.repeats.mins;
        const premPieSize = (Math.PI * 2) * (renderData.premieres.mins / totalDuration);
        const precentPrems = Math.round((renderData.premieres.mins/totalDuration)*100),
              percentRepeats = Math.round((renderData.repeats.mins/totalDuration)*100);

        arcSet.push(<InnerPremieres transform={"translate(" + width / 2 + "," + height / 2 + ")"} d={innerArc({ startAngle: 0, endAngle: premPieSize })} key={0} />);

        let centroid = innerArc.centroid({ startAngle: 0, endAngle: premPieSize });//need to reduce redundancy
        renderLabels.push(<text transform={"translate(" + width / 2 + "," + ((height / 2)-5) + ")"} fontSize={10} textAnchor={"middle"} stroke={"none"} fill={"#fff"} x={centroid[0]} y={centroid[1]}     >{precentPrems+"%"}</text>)
        renderLabels.push(<text transform={"translate(" + width / 2 + "," + ((height / 2)+5) + ")"} fontSize={10} textAnchor={"middle"} stroke={"none"} fill={"#fff"} x={centroid[0]} y={centroid[1]}     >Premieres</text>)

        const repeatPieSize = (Math.PI * 2) * (renderData.repeats.mins / totalDuration);
        arcSet.push(<InnerRepeats transform={"translate(" + width / 2 + "," + height / 2 + ")"} d={innerArc({ startAngle: premPieSize, endAngle: repeatPieSize + premPieSize })} key={1} />);
        centroid = innerArc.centroid({ startAngle: premPieSize, endAngle: repeatPieSize + premPieSize });//need to reduce redundancy
        renderLabels.push(<text transform={"translate(" + width / 2 + "," + ((height / 2)-5) + ")"} fontSize={10} textAnchor={"middle"} stroke={"none"} fill={"#000"} x={centroid[0]} y={centroid[1]}     >{percentRepeats+"%"}</text>)
        renderLabels.push(<text transform={"translate(" + width / 2 + "," + ((height / 2)+5) + ")"} fontSize={10} textAnchor={"middle"} stroke={"none"} fill={"#000"} x={centroid[0]} y={centroid[1]}     >Repeats</text>)
        
        
        
        const durationMinimum = 0;

        const premList = renderData["series-prems"].sort((a, b) => {
            if (a[ratingDurationToggle] < b[ratingDurationToggle]) return 1;
            if (a[ratingDurationToggle] > b[ratingDurationToggle]) return -1;
            return 0;
        }).filter(show => { return show.mins >= durationMinimum })
        

        const repeatList = renderData["series-repeats"].sort((a, b) => {
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
                arcSet.push(<ShowArcSelected transform={"translate(" + width / 2 + "," + height / 2 + ")"} d={seriesArc({ startAngle: startAngle, endAngle: endAngle, outerRadius: rad })} onClick={() => { interactionCallback({...show, "premiereStatus":"premiere"}) }} />)
            }
            else{
                arcSet.push(<ShowArcPrems transform={"translate(" + width / 2 + "," + height / 2 + ")"} d={seriesArc({ startAngle: startAngle, endAngle: endAngle, outerRadius: rad })} onClick={() => { interactionCallback({...show, "premiereStatus":"premiere"}) }} />)
            }
            
            startAngle += (premPieSize) * premArcWidth;
        }, this);

        repeatList.forEach(function (show) {
            rad = hScale(show[ratingDurationToggle])
            endAngle += (repeatPieSize) * repeatArcWidth;
            if(selectedElement.premiereStatus==="repeat" && selectedElement.name===show.name){
                arcSet.push(<ShowArcSelected transform={"translate(" + width / 2 + "," + height / 2 + ")"} d={seriesArc({ startAngle: startAngle, endAngle: endAngle, outerRadius: rad })} onClick={() => { interactionCallback({...show, "premiereStatus":"repeat"}) }} />)
            }
            else{
                arcSet.push(<ShowArcRepeats transform={"translate(" + width / 2 + "," + height / 2 + ")"} d={seriesArc({ startAngle: startAngle, endAngle: endAngle, outerRadius: rad })} onClick={() => { interactionCallback({...show, "premiereStatus":"repeat"}) }} />)
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
           messageBox.push(<text x={width / 2} y={height / 2} textAnchor={"middle"} >{selectedElement.timePeriod+" Prime: "+renderData.prime+"k"}</text>)
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
            primeAvgCircle = <PrimeCircle transform={"translate(" + width / 2 + "," + height / 2 + ")"} r={hScale(renderData.prime)} strokeDasharray={"5,5"} />
            renderLabels.push(<circle transform={"translate(" + width / 2 + "," + height / 2 + ")"} r={4} stroke={"none"} fill={"#000"} cx={0} cy={-hScale(renderData.prime)}/>)
            renderLabels.push(<line  transform={"translate(" + width / 2 + "," + height / 2 + ")"} stroke={"#000"} strokeDasharray={"5,5"} x1={-140} y1={-hScale(renderData.prime)} x2={0} y2={-hScale(renderData.prime)}  />)
            renderLabels.push(<text transform={"translate(" + width / 2 + "," + ((height / 2)+5) + ")"} stroke={"none"} fill={"#000"} x={-220} y={-hScale(renderData.prime)+4}  fontSize={11} >{"Prime avg: "+renderData.prime+"k"}</text>)
            
            premiereAvgCircle = <PremiereCircle transform={"translate(" + width / 2 + "," + height / 2 + ")"} r={hScale(renderData.premieres.aa)} strokeDasharray={"5,5"} />
            renderLabels.push(<circle transform={"translate(" + width / 2 + "," + height / 2 + ")"} r={4} stroke={"none"} fill={"#000"} cx={0} cy={-hScale(renderData.premieres.aa)}/>)
            renderLabels.push(<line  transform={"translate(" + width / 2 + "," + height / 2 + ")"} stroke={"#000"} strokeDasharray={"5,5"} x1={-130} y1={-hScale(renderData.premieres.aa)} x2={0} y2={-hScale(renderData.premieres.aa)}  />)
            renderLabels.push(<text transform={"translate(" + width / 2 + "," + ((height / 2)-5) + ")"} stroke={"none"} fill={"#000"} x={-220} y={-hScale(renderData.premieres.aa)+4}  fontSize={11} >{"Premiere avg: "+renderData.premieres.aa+"k"}</text>)
        }
        



       

        return (
            <Donut>
                <SVG>
                    {arcSet}
                    {messageBox}
                    {primeAvgCircle}
                    {renderLabels}
                    {premiereAvgCircle}
                </SVG>
            </Donut>);
    }
}

DonutRadial.propTypes = {
    renderData: PropTypes.object.isRequired,
    interactionCallback: PropTypes.func.isRequired,
    selectedElement: PropTypes.object.isRequired,
    ratingRange: PropTypes.array.isRequired,
    ratingDurationToggle: PropTypes.string.isRequired
}
