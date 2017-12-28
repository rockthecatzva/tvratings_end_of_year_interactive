import React, { Component } from 'react'
import PropTypes from 'prop-types';
import styled from 'styled-components'

import * as d3 from 'd3';
import {
    scaleLinear as d3ScaleLinear
} from 'd3-scale';
import {
    axisBottom as d3AxisBottom,
    axisLeft as d3AxisLeft,
} from 'd3-axis';
import { extent as d3ArrayExtent } from 'd3-array';
import { arc as d3Arc } from 'd3-shape'


export default class MultiLineAndBars extends React.Component {


    render() {
        const { renderData, interactionCallback, selectedElement } = this.props;

        const width = 400,
            height = 300,
            MARGIN = {
                "left": 45,
                "right": 20,
                "top": 15,
                "bottom": 20
            }
                ;

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

        const GraphBox = styled.div`
                width: ${width + "px"};
                height: ${height + "px"};
                margin-left: auto;
                margin-right: auto;
                font-family: 'aileron';
              `;

        const SVG = styled.svg`
            width: ${width + "px"};
            height: ${height + "px"};
           
              `;

        const LegendSVG = styled.svg`
            width: ${width-(MARGIN.left+MARGIN.right) + "px"};
            height: 50px;
            border: solid 1p #AEB6BF;
            position: relative;
            left: ${MARGIN.left+"px"};
         `;


        let maxVal = 0,
            circles = [],
            lines = [],
            renderAxis = [],
            showBars = [],
            textLabels = [];

        months.forEach(m => {
            /*if (renderData.prime[m] > maxVal) {
                maxVal = renderData.prime[m]
            }*/

            //if a show is selected - then include show-level AA in maxVal
            //this will only look at show premiers - not repeats - what if highly rated repeats??
            if (selectedElement.hasOwnProperty("name")) {
                if (selectedElement.premiereStatus === "premiere") {
                    renderData["series-prems"][m].forEach((s) => {
                        if (s.name === selectedElement.name) {
                            if (s.aa > maxVal) {
                                maxVal = s.aa;
                            }
                        }
                    })
                    if (renderData["series-prems"][m].aa > maxVal) {
                        maxVal = renderData["series-prems"][m].aa
                    }
                }
            }

            if (renderData.premieres[m].aa > maxVal) {
                maxVal = renderData.premieres[m].aa
            }


            /*
            if (renderData.repeats[m].aa > maxVal) {
                maxVal = renderData.repeats[m].aa
            }*/


        });

        const x = d3.scaleLinear().domain([0, months.length - 1]).range([MARGIN.left, width - (MARGIN.left + MARGIN.right)])
        const y = d3.scaleLinear().domain([0, maxVal]).range([height - (MARGIN.top + MARGIN.bottom), MARGIN.bottom]);


        const CirclePoint = styled.circle`
            stroke: #000;
            fill: #fff;
            stroke-width: 3;
            `;

        const CirclePointSelected = styled.circle`
            stroke: #f00;
            fill: #fff;
            stroke-width: 4;
            `;

        const FillGap = styled.path`
            stroke: #000;`;
        
        const HideAxis = styled.g`
            stroke: none;`

        const AxisG = styled.g`
            font-family: 'aileron';`;

            
        function onPrimeDotClick(ob) {
            console.log(ob)
            interactionCallback(ob)
        }

        months.forEach((m, i) => {
            if (m === selectedElement.timePeriod) {
                circles.push(<CirclePointSelected r={4} cx={x(i)} cy={y(renderData.prime[m])} key={i} onClick={e => { onPrimeDotClick({ "timePeriod": m }) }} />)
            }
            else {
                circles.push(<CirclePoint r={3} cx={x(i)} cy={y(renderData.prime[m])} key={i} onClick={e => { onPrimeDotClick({ "timePeriod": m }) }} />)
            }

        })

        const tickSize = 5;
        const xAxis = d3AxisBottom()
            .scale(x)
            .tickSize(tickSize)
            .tickFormat((d, i) => { return months[i] }),
            yAxis = d3AxisLeft()
                .scale(y)
                .tickSize(tickSize);
        
        const barW = (width - (MARGIN.left+MARGIN.right)) / 12;

        renderAxis.push(<g transform={"translate(0," + (height - (MARGIN.top+MARGIN.bottom)) + ")"} ref={node => d3.select(node).call(xAxis)} />)
        renderAxis.push(<g  transform={"translate(" + (MARGIN.left-barW/2) + ",0)"} ref={node => d3.select(node).call(yAxis)} />)
        renderAxis.push(<FillGap d={"M"+(MARGIN.left-barW/2) +" " + (0.5+height - (MARGIN.top+MARGIN.bottom)) + " H "+MARGIN.left  } />)

        var line = d3.line()
            .x(function (d, i) {
                return x(i)
            })
            .y(function (d) {
                return y(d)
            });

        //console.log(line)

        const PrimeLine = styled.path`
            fill: none;
            stroke: rgb(0,0,0);
            stroke-width: 2;
            `;

        const PremiereLine = styled.path`
            fill: none;
            stroke: rgb(51,51,255);
            stroke-width: 2;
            `;

        const RepeatLine = styled.path`
            fill: none;
            stroke: #000;
            stroke-width: 2;
            `;

        const BarText = styled.text`
            font-size: 0.6em;
            text-anchor: middle;`;
        const ShowBar = styled.rect`
            fill: #aeb6bf;
            stroke: none;`

        const PremiereLabel = styled.text`
            font-size: 0.7em;
            stroke: none;
            fill: #fff;
            text-anchor: middle;`;

        const PremiereCircle = styled.circle`
            stroke: none;
            fill: rgb(51,51,255);
            `;
        
        const RepeatLabel = styled.text`
            font-size: 0.7em;
            stroke: none;
            fill: #fff;
            text-anchor: middle;`;

        const RepeatCircle = styled.circle`
            stroke: none;
            fill: #000;
            `;



        lines.push(<PrimeLine d={line(months.map(m => { return renderData.prime[m] }))} />);
        lines.push(<PremiereLine d={line(months.map(m => { return renderData.premieres[m].aa }))} strokeDasharray={"5,5"} />);
        lines.push(<RepeatLine d={line(months.map(m => { return renderData.repeats[m].aa }))} strokeDasharray={"5,5"} />);

        if (selectedElement.hasOwnProperty("name")) {
            //a show has been selected?
            let showGroup = "";
            if (selectedElement.premiereStatus === "premiere") {
                showGroup = "series-prems";
            }
            else {
                showGroup = "series-repeats";
            }

            let monthlyShowData = [],
                barH = 0;


            months.forEach((m, i) => {
                monthlyShowData = renderData[showGroup][m].filter((s) => { if (s.name === selectedElement.name) return s });
                if (monthlyShowData.length) {
                    barH = y(monthlyShowData[0].aa);
                    //console.log(m, monthlyShowData[0], barH)
                    showBars.push(<ShowBar x={x(i)} y={barH} width={barW} height={(height - (MARGIN.top+MARGIN.bottom)) - barH} />)
                    showBars.push(<BarText x={x(i) + (barW / 2)} y={barH-6} >{monthlyShowData[0].aa} </BarText>)

                    //<CirclePoint r={3} cx={x(i)} cy={y(renderData.prime[m])} key={i} onClick={e => { onPrimeDotClick({ "timePeriod": m }) }} />
                }

            })

        } else {
            if (selectedElement.timePeriod !== "FullYear") {
                // a month has been selected
                textLabels.push(<PremiereCircle cx={x(months.indexOf(selectedElement.timePeriod))} cy={y(renderData.premieres[selectedElement.timePeriod].aa)} r={12} />)
                textLabels.push(<PremiereLabel x={x(months.indexOf(selectedElement.timePeriod))} y={y(renderData.premieres[selectedElement.timePeriod].aa)+3} >{renderData.premieres[selectedElement.timePeriod].aa}</PremiereLabel>)

                textLabels.push(<RepeatCircle cx={x(months.indexOf(selectedElement.timePeriod))} cy={y(renderData.repeats[selectedElement.timePeriod].aa)} r={12} />)
                textLabels.push(<RepeatLabel x={x(months.indexOf(selectedElement.timePeriod))} y={y(renderData.repeats[selectedElement.timePeriod].aa)+3} >{renderData.repeats[selectedElement.timePeriod].aa}</RepeatLabel>)
                
            }
        }

        const labelW = 10,
              lineW = 45;
        let legendLineData = [],
            legendLabelData = [],
            leftStart;

        for(var i = 0; i<3; i++){
            leftStart = Math.round(((width-(MARGIN.left+MARGIN.right))/3)*i);
            legendLineData.push("M"+leftStart+" 9 H "+(leftStart+lineW));
            legendLabelData.push(leftStart+lineW+(labelW))
            //legendLineData.push(legendLineData[legendLineData.length-1]+labelW)
        }

        //console.log(legendLineData)
        //console.log(legendLabelData)

        return (
            <GraphBox>
                <SVG>
                {renderAxis}
                    <g transform={"translate(" + (-barW / 2) + ",0)"} >
                        {showBars}
                    </g>
                    {lines}
                    {circles}
                    {textLabels}
                    
                </SVG>
                <LegendSVG>
                    <PrimeLine d={legendLineData[0]} />
                    <text stroke={"none"} fill={"#000"} x={legendLabelData[0]} y={13} fontSize={11} >Prime</text>
                    <PremiereLine d={legendLineData[1]} strokeDasharray={"5,5"} />
                    <text stroke={"none"} fill={"#000"} x={legendLabelData[1]} y={13} fontSize={11} >Premieres</text>
                    <RepeatLine d={legendLineData[2]} strokeDasharray={"5,5"} />
                    <text stroke={"none"} fill={"#000"} x={legendLabelData[2]} y={13} fontSize={11} >Repeats</text>
                </LegendSVG>
            </GraphBox>);
    }
}

MultiLineAndBars.propTypes = {
    renderData: PropTypes.object.isRequired,
    interactionCallback: PropTypes.func.isRequired,
    selectedElement: PropTypes.object.isRequired
}
