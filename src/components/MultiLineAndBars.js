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
            MARGIN = 10,
            axisMargin = 21;

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

        const GraphBox = styled.div`
                width: ${width + "px"};
                height: ${height + "px"};
                float: left;
              `;

        const SVG = styled.svg`
            width: ${width + "px"};
            height: ${height + "px"};
              `;

    

        let maxVal = 0,
            circles = [];

        months.forEach(m=>{
            if (renderData.prime[m]>maxVal) {
                maxVal=renderData.prime[m]
            }
            if (renderData.premieres[m].aa>maxVal) {
                maxVal=renderData.premieres[m].aa
            }
            if (renderData.repeats[m].aa>maxVal) {
                maxVal=renderData.repeats[m].aa
            }
        });
        
        const x = d3.scaleLinear().domain([0, months.length-1]).range([MARGIN, width - MARGIN])
        const y = d3.scaleLinear().domain([0, maxVal]).range([height - MARGIN, MARGIN]);


        const CirclePoint = styled.circle`
            stroke: #AEB6BF;
            fill: #fff;
            stroke-width: 3;
            `;

        const CirclePointSelected = styled.circle`
            stroke: #f00;
            fill: #fff;
            stroke-width: 4;
            `;


        function onPrimeDotClick(e, ob){
            console.log(ob)
            interactionCallback(e,ob, null)
        }

        months.forEach((m,i)=>{
            if(m===selectedElement.month){
                circles.push(<CirclePointSelected r={4} cx={x(i)} cy={y(renderData.prime[m])} key={i} onClick={e=>{onPrimeDotClick(e, {"month": m})}} />)
            }
            else{
                circles.push(<CirclePoint r={4} cx={x(i)} cy={y(renderData.prime[m])} key={i} onClick={e=>{onPrimeDotClick(e, {"month": m})}} />)
            }
            
        })

        const tickSize = 5;
        const xAxis = d3AxisBottom()
        .scale(x)
        .tickSize(tickSize)
        .tickFormat((d,i)=>{return months[i]});

        const renderAxis = <g className="xAxis" transform={"translate(0," + (height - axisMargin) + ")"} ref={node => d3.select(node).call(xAxis)} />
        
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
            stroke: #AEB6BF;
            stroke-width: 2;
            `;
        return (
            <GraphBox>
                <SVG>
                    <PrimeLine d={line(months.map(m=>{return renderData.prime[m]}))}/>
                    <PremiereLine d={line(months.map(m=>{return renderData.premieres[m].aa}))}/>
                    <RepeatLine d={line(months.map(m=>{return renderData.repeats[m].aa}))}/>
                    {circles}
                    {renderAxis}
                </SVG>
            </GraphBox>);
    }
}

MultiLineAndBars.propTypes = {
    renderData: PropTypes.object.isRequired,
    interactionCallback: PropTypes.func.isRequired,
    selectedElement: PropTypes.object.isRequired
}
