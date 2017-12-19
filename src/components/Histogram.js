import React, { Component } from 'react'
import PropTypes from 'prop-types';
//import ReactDOM from 'react-dom'
import * as d3 from 'd3';
import styled from 'styled-components'
import {
  axisBottom as d3AxisBottom
} from 'd3-axis';


export default class Histogram extends Component {

  clickHandler(e, vals) {
    e.stopPropagation();
    const highNums = Object.entries(vals).filter(r => {
      if (Number.isInteger(parseInt(r[0], 10))) return true;
      return false;
    }).map(n => { return parseInt(n[1], 10); });

    this.props.uxCallback(highNums);
    //console.log(highNums);
  }

  render() {
    console.log("Histogram Rendering")
    const { renderData, highlightValues } = this.props;
    const width = 400,
      height = 400,
      numBins = 10;

    const Histo = styled.div`
          width: ${width + "px"};
          height: ${height + "px"};
          float: left;
        `;

    const SVG = styled.svg`
      width: ${width + "px"};
      height: ${height + "px"};
        `;

    const Rect = styled.rect`
      stroke: #000;
      fill: #fff;
    `;

    const RectHighlight = styled.rect`
      stroke: #000;
      fill: #f0f;
    `;

    const LabelText = styled.text`
      text-anchor: middle;
    `;

    const Title = styled.p`
      width: 100%;
      font-size: 1.8em;
      text-align: center;
    `;

    const margin = { top: 20, right: 5, bottom: 20, left: 5 },
      labelMargin = 5,
      tickSize = 10,
      axisMargin = 21;

    const valSet = renderData.map((st, i) => { return st["value"] });
    //console.log(valSet, d3.min(valSet), d3.max(valSet))

    const xScale = d3.scaleLinear()
      .domain([d3.min(valSet), d3.max(valSet)])
      .range([margin.left, width - margin.right])
      .interpolate(d3.interpolateRound)

    const bins = d3.histogram()
      .domain(xScale.domain())
      .thresholds(xScale.ticks(numBins))(valSet)

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(bins, function (d) { return d.length; })])
      .range([0, height - (margin.top + margin.bottom)]);

    const xAxis = d3AxisBottom()
      .scale(xScale)
      .tickSize(tickSize)
      .tickFormat(d3.format(",.0f"));

    const renderAxis = <g className="xAxis" transform={"translate(0," + (height - axisMargin) + ")"} ref={node => d3.select(node).call(xAxis)} />

    let bars = [],
      labels = [];

    bins.forEach((b, i) => {
      let x = xScale(b.x0),
        h = (yScale(b.length)),
        y = (height - h) - margin.bottom,//yScale(b.length),
        w = (b.x1 === b.x0) ? xScale(1) : xScale(b.x1) - xScale(b.x0);

      let barOb = {
        key: i,
        x: x,
        y: y,
        width: w,
        height: h,
        onClick: (e) => { this.clickHandler(e, b) }
      };
            
      
      if (b.filter(v => highlightValues.indexOf(v)>-1).length) {
        bars.push(<RectHighlight {...barOb} />);
      }
      else{
        bars.push(<Rect {...barOb} />);
      }

      if (b.length > 0) {
        labels.push(<LabelText key={i} x={x + (w / 2)} y={y - labelMargin} >{b.length}</LabelText>)
      }

    });

    return (
      <Histo>
        <Title>Distribution of Values</Title>
        <SVG>
          {labels}
          {bars}
          {renderAxis}
        </SVG>
      </Histo>
    )
  }
}

Histogram.propTypes = {
  renderData: PropTypes.array.isRequired,
  highlightValues: PropTypes.array.isRequired,
  uxCallback: PropTypes.func.isRequired
}
