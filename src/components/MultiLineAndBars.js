import React from 'react'
import PropTypes from 'prop-types';
import styled from 'styled-components'

//import * as d3 from 'd3';
import {
    scaleLinear as d3ScaleLinear
} from 'd3-scale';
import {
    axisBottom as d3AxisBottom,
    axisLeft as d3AxisLeft,
} from 'd3-axis';
import { line as d3Line } from 'd3-shape'
import { select as d3Select } from 'd3-selection';


export default class MultiLineAndBars extends React.Component {

    deselectShow() {
        this.props.interactionCallback({ "name": null })
    }

    componentDidMount() {
        console.log("Linegraph mounted")
    }

    render() {
        const { renderData, interactionCallback, selectedElement } = this.props;

        const width = 550,
            height = 400,
            MARGIN = {
                "left": 60,
                "right": 20,
                "top": 15,
                "bottom": 20
            };

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

        const GraphBox = styled.div`
                position: relative;
                width: ${width + "px"};
                height: ${height + "px"};
                padding-top: 1em;`;

        const SVG = styled.svg`
            width: ${width + "px"};
            height: ${height + "px"};`;

        const LegendBox = styled.div`
            height: 1em;
            width: 100%;`,

            LegendSpan = styled.span`
            padding-left: 2px;
            padding-right: 4px;
            background-color: #aeb6bf;`;

        const CirclePoint = styled.circle`
        cursor: pointer;
            stroke: #000;
            fill: #fff;
            stroke-width: 3;`;

        const CirclePointSelected = styled.circle`
            stroke: #f00;
            fill: #fff;
            stroke-width: 4;`;

        const FillGap = styled.path`
            stroke: #000;`;
            
        const PrimeLine = styled.path`
            fill: none;
            stroke: rgb(0,0,0);
            stroke-width: 2;`;

        const PremiereLine = styled.path`
            fill: none;
            stroke: #3498db;
            stroke-width: 2;`;

        const RepeatLine = styled.path`
            fill: none;
            stroke: #000;
            stroke-width: 2;`;

        const BarText = styled.text`
            font-size: 0.6em;
            text-anchor: middle;`;

        const ShowBar = styled.rect`
            fill: #aeb6bf;
            stroke: none;`,

            BarSpan = styled.span`
            background-color: #aeb6bf;
            width: 2em;
            height: 1em;`;

        const PremiereCircle = styled.circle`
            stroke: none;
            fill: #3498db;`;

        const RepeatCircle = styled.circle`
            stroke: none;
            fill: #000;`,

            CloseX = styled.span`
            font-size: 0.7em;
            cursor: pointer;`

        let maxVal = 0,
            circles = [],
            lines = [],
            renderAxis = [],
            showBars = [],
            textLabels = [];

        months.forEach(m => {
            //if a show is selected - then include show-level AA in maxVal
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

                if (selectedElement.premiereStatus === "repeat") {
                    renderData["series-repeats"][m].forEach((s) => {
                        if (s.name === selectedElement.name) {
                            if (s.aa > maxVal) {
                                maxVal = s.aa;
                            }
                        }
                    })

                    if (renderData["series-repeats"][m].aa > maxVal) {
                        maxVal = renderData["series-repeats"][m].aa
                    }
                }
            }

            //check all monthly-premiere levels (full year will be lower!)
            if (renderData.premieres[m].aa > maxVal) {
                maxVal = renderData.premieres[m].aa
            }
        });

        const x = d3ScaleLinear().domain([0, months.length - 1]).range([MARGIN.left, width - (MARGIN.left + MARGIN.right)])
        const y = d3ScaleLinear().domain([0, maxVal]).range([height - (MARGIN.top + MARGIN.bottom), MARGIN.bottom]);

        months.forEach((m, i) => {
            if (m === selectedElement.timePeriod) {
                circles.push(<CirclePointSelected r={4} cx={x(i)} cy={y(renderData.prime[m])} key={i} onClick={e => { interactionCallback({ "timePeriod": m }) }} />)
            }
            else {
                circles.push(<CirclePoint r={3} cx={x(i)} cy={y(renderData.prime[m])} key={i} onClick={e => { interactionCallback({ "timePeriod": m }) }} />)
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

        const barW = (width - (MARGIN.left + MARGIN.right)) / 12;

        renderAxis.push(<g key={renderAxis.length} transform={"translate(0," + (height - (MARGIN.top + MARGIN.bottom)) + ")"} ref={node => d3Select(node).call(xAxis)} />)
        renderAxis.push(<g key={renderAxis.length} transform={"translate(" + (MARGIN.left - barW / 2) + ",0)"} ref={node => d3Select(node).call(yAxis)} />)
        renderAxis.push(<FillGap key={renderAxis.length} d={"M" + (MARGIN.left - barW / 2) + " " + (0.5 + height - (MARGIN.top + MARGIN.bottom)) + " H " + MARGIN.left} />)

        var line = d3Line()
            .x(function (d, i) {
                return x(i)
            })
            .y(function (d) {
                return y(d)
            });

        let legendComponents = [];

        lines.push(<PrimeLine d={line(months.map(m => { return renderData.prime[m] }))} key={line.length} />);
        const premLine = (<PremiereLine d={line(months.map(m => { return renderData.premieres[m].aa }))} strokeDasharray={"5,5"} key={line.length + 1} />),
            repeatLine = (<RepeatLine d={line(months.map(m => { return renderData.repeats[m].aa }))} strokeDasharray={"5,5"} key={line.length + 2} />);

        if (selectedElement.hasOwnProperty("name")) {
            //a show has been selected?
            let showGroup = "";
            if (selectedElement.premiereStatus === "premiere") {
                showGroup = "series-prems";
                lines.push(premLine);
                textLabels.push(<text key={textLabels.length} stroke={"none"} fill={"#000"} x={x(11) + 6} y={y(renderData.prime[months[11]])} fontSize={11} >Prime</text>)
                textLabels.push(<text key={textLabels.length} stroke={"none"} fill={"#000"} x={x(11) + 6} y={y(renderData.premieres[months[11]].aa)} fontSize={11} >Premieres</text>)
            }
            else {
                showGroup = "series-repeats";
                lines.push(repeatLine);
                textLabels.push(<text key={textLabels.length} stroke={"none"} fill={"#000"} x={x(11) + 6} y={y(renderData.prime[months[11]])} fontSize={11} >Prime</text>)
                textLabels.push(<text key={textLabels.length} stroke={"none"} fill={"#000"} x={x(11) + 6} y={y(renderData.repeats[months[11]].aa)} fontSize={11} >Repeats</text>)
            }

            legendComponents = <div><LegendSpan><CloseX onClick={() => { this.deselectShow() }} >&#10060;</CloseX><BarSpan /><span>{selectedElement.name}</span></LegendSpan></div>;

            let monthlyShowData = [],
                barH = 0;

            months.forEach((m, i) => {
                monthlyShowData = renderData[showGroup][m].filter((s) => { return s.name === selectedElement.name });
                if (monthlyShowData.length) {
                    barH = y(monthlyShowData[0].aa);
                    showBars.push(<ShowBar key={showBars.length} x={x(i)} y={barH} width={barW} height={(height - (MARGIN.top + MARGIN.bottom)) - barH} />)
                    showBars.push(<BarText key={showBars.length} x={x(i) + (barW / 2)} y={barH - 6} >{monthlyShowData[0].aa.toFixed(2)} </BarText>)
                    const hours = Math.round(monthlyShowData[0].mins / 60),
                        hrLabel = (hours > 1) ? "Hrs" : "Hr"

                    showBars.push(<BarText key={showBars.length} x={x(i) + (barW / 2)} y={height - MARGIN.bottom - 30} >{hours} </BarText>)
                    showBars.push(<BarText key={showBars.length} x={x(i) + (barW / 2)} y={height - MARGIN.bottom - 20} >{hrLabel}</BarText>)
                }
            })
        } else {
            lines.push(premLine);
            lines.push(repeatLine);
            textLabels.push(<text key={textLabels.length} stroke={"none"} fill={"#000"} x={x(11) + 6} y={y(renderData.prime[months[11]])} fontSize={11} >Prime</text>);
            textLabels.push(<text key={textLabels.length} troke={"none"} fill={"#000"} x={x(11) + 6} y={y(renderData.premieres[months[11]].aa)} fontSize={11} >Premieres</text>);
            textLabels.push(<text key={textLabels.length} stroke={"none"} fill={"#000"} x={x(11) + 6} y={y(renderData.repeats[months[11]].aa)} fontSize={11} >Repeats</text>);

            if (selectedElement.timePeriod !== "FullYear") {
                // a month has been selected
                textLabels.push(<PremiereCircle key={textLabels.length} cx={x(months.indexOf(selectedElement.timePeriod))} cy={y(renderData.premieres[selectedElement.timePeriod].aa)} r={6} />);
                textLabels.push(<RepeatCircle key={textLabels.length} cx={x(months.indexOf(selectedElement.timePeriod))} cy={y(renderData.repeats[selectedElement.timePeriod].aa)} r={6} />);
            }
        }



        return (
            <GraphBox>
                <LegendBox>
                    {legendComponents}
                </LegendBox>
                <SVG>
                    <g transform={"translate(" + (-barW / 2) + ",0)"} >
                        {showBars}
                    </g>
                    {lines}
                    {circles}
                    {textLabels}
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
