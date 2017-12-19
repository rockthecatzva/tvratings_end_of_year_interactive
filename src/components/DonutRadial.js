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


export default class DonutRadial extends React.Component {

    clickHandler(e, show) {
        //this.props.interactionCallback
        this.props.interactionCallback(show.name + " " + show.aa + "k avg " + Math.round(show.mins / 60) + "hrs")
    }

    render() {
        const { renderData, interactionCallback } = this.props;

        const margin = {
            bottom: 35,
            top: 15,
            left: 40,
            right: 20
        },
            buffer = 0.1,
            tickSize = 4,
            radius = 6,
            labelOffset = 30;

        const width = 450,
            height = 600;

        const Donut = styled.div`
                width: ${width + "px"};
                height: ${height + "px"};
                float: left;
              `;

        const SVG = styled.svg`
            width: ${width + "px"};
            height: ${height + "px"};
              `;

        const InnerRing = styled.path`
            fill: rgb(122,122,0);
            stroke: rgb(0,0,0);`;

        const InnerPremieres = styled.path`
            fill: rgb(51,51,255);
            stroke: rgb(255,255,255);`;

        const InnerRepeats = styled.path`
            fill: rgb(153,51,255);
            stroke: rgb(255,255,255);`;

        const ShowArc = styled.path`
            fill: rgb(255,255,255);
            stroke: rgb(0,0,0);`;

        const innerCircleRadius = 140,
            primaryDonutRadiusInner = innerCircleRadius - 60,
            primaryDonutRadiusOuter = innerCircleRadius,
            innerArc = d3Arc()
                .innerRadius(primaryDonutRadiusInner)
                .outerRadius(primaryDonutRadiusOuter),
            seriesArcRadiusInner = 142,
            seriesArc = d3Arc()
                .innerRadius(seriesArcRadiusInner);


        console.log(renderData.premieres["FullYear"].mins, renderData.repeats.FullYear.mins)


        const arcSet = [];//[arc({startAngle: 0, endAngle: Math.PI/2})]
        const totalDuration = renderData.premieres.FullYear.mins + renderData.repeats.FullYear.mins;

        const premPieSize = (Math.PI * 2) * (renderData.premieres.FullYear.mins / totalDuration);


        //let endAngle = (Math.PI*2)*(renderData.premieres.FullYear.mins/totalDuration);
        arcSet.push(<InnerPremieres transform={"translate(" + width / 2 + "," + height / 2 + ")"} d={innerArc({ startAngle: 0, endAngle: premPieSize })} key={0} />);


        const repeatPieSize = (Math.PI * 2) * (renderData.repeats.FullYear.mins / totalDuration);

        //let lastEnd = endAngle;
        //endAngle += (Math.PI*2)*(renderData.repeats.FullYear.mins/totalDuration)
        arcSet.push(<InnerRepeats transform={"translate(" + width / 2 + "," + height / 2 + ")"} d={innerArc({ startAngle: premPieSize, endAngle: repeatPieSize + premPieSize })} key={1} />);

        //console.log(Math.PI*2, premPieSize, repeatPieSize, premPieSize+repeatPieSize)

        const durationMinimum = 360;

        const premList = renderData["series-prems"]["FullYear"].sort((a, b) => {
            if (a["aa"] < b["aa"]) return 1;
            if (a["aa"] > b["aa"]) return -1;
            return 0;
        }).filter(show => { return show.mins >= durationMinimum })

        const repeatList = renderData["series-repeats"]["FullYear"].sort((a, b) => {
            if (a["aa"] < b["aa"]) return 1;
            if (a["aa"] > b["aa"]) return -1;
            return 0;
        }).filter(show => { return show.mins >= durationMinimum })


        const maxRatingRad = 300,
            minRatingRad = 150;

        let startAngle = 0,
            endAngle = 0,
            rad = 0;

        const premArcWidth = 1 / premList.length,
            repeatArcWidth = 1 / repeatList.length;

        const hScale = d3.scaleLinear()
            .domain([d3.min(premList.concat(repeatList), function (s) { return s["aa"] }), d3.max(premList.concat(repeatList), function (s) { return s["aa"] })])
            .range([minRatingRad, maxRatingRad]);




        premList.forEach(function (show) {
            rad = hScale(show["aa"])
            endAngle += (premPieSize) * premArcWidth;
            arcSet.push(<ShowArc transform={"translate(" + width / 2 + "," + height / 2 + ")"} d={seriesArc({ startAngle: startAngle, endAngle: endAngle, outerRadius: rad })} onClick={(e) => { this.clickHandler(e, show) }} />)
            startAngle += (premPieSize) * premArcWidth;
        }, this);

        repeatList.forEach(function (show) {
            rad = hScale(show["aa"])
            endAngle += (repeatPieSize) * repeatArcWidth;
            arcSet.push(<ShowArc transform={"translate(" + width / 2 + "," + height / 2 + ")"} d={seriesArc({ startAngle: startAngle, endAngle: endAngle, outerRadius: rad })} onClick={(e) => { this.clickHandler(e, show) }} />)
            startAngle += (repeatPieSize) * repeatArcWidth;
        }, this);


        console.log(premList)

        const MessageBox = styled.text`
            fill: rgb(0,0,0);`;

        const messageBox = <text x={width / 2} y={height / 2} textAnchor={"middle"} >{this.props.message}</text>

        const PrimeCircle = styled.circle`
            fill: none;
            stroke: rgb(255,0,0);
            `;
        const primeAvgCircle = <PrimeCircle transform={"translate(" + width / 2 + "," + height / 2 + ")"} r={hScale(renderData.prime.FullYear)} strokeDasharray={"5,5"} />

        const PremiereCircle = styled.circle`
            fill: none;
            stroke: rgb(0,0,255);
            `;
        const premiereAvgCircle = <PremiereCircle transform={"translate(" + width / 2 + "," + height / 2 + ")"} r={hScale(renderData.premieres.FullYear.aa)} strokeDasharray={"5,5"} />

        return (
            <Donut>
                <SVG>
                    {arcSet}
                    {messageBox}
                    {primeAvgCircle}
                    {premiereAvgCircle}
                </SVG>
            </Donut>);
    }
}

DonutRadial.propTypes = {
    renderData: PropTypes.object.isRequired,
    interactionCallback: PropTypes.func.isRequired,
    message: PropTypes.string.isRequired
}
