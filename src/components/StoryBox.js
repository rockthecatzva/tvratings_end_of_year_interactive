import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types';
import './StoryBox.css'

export default class StoryBox extends React.Component {

    render() {
        const { endStory, changeSlide, x, y, w, message, storyPosition, numSlides, arrowType } = this.props;

        const dynamicStyle = {
            position: "absolute",
            width: w,
            left: x,
            top: y,
        }

        const Container = styled.div`
            position: absolute;
            
            height: fit-content;
            
           

            &:after {
                ${"right: 100%;"}
                top: 50%;
                border: solid transparent;
                content: " ";
                height: 0;
                width: 0;
                position: absolute;
                pointer-events: none;
                border-right-color: #000;
                border-width: 20px;
                margin-top: -20px;
            }

            `,
            ButtonSpan = styled.span`
              cursor: pointer;
              border: solid 1px #fff;
              font-size: 0.8em;
              padding-left: 3px;
              padding-right: 3px;
              margin: 4px;
              border-radius: 3px;`,
            CloseSpan = styled.span`
              cursor: pointer;
              position: absolute;
              right: 1em;
              `,
            HorizontalLine = styled.div`
            width: 95%;
            margin-left: auto;
            margin-right: auto;
            height: 0px;
            padding: 3px;
            border-top: solid 1px #fff;`,

            CloseContainer = styled.div`
                height: 1em;`


        

        return (<div style={dynamicStyle} className={"storyContainer "+arrowType} >

            <CloseContainer><CloseSpan onClick={endStory} >&times;</CloseSpan></CloseContainer>
            {message}
    
            <HorizontalLine />

            {(storyPosition > 0) &&
                <ButtonSpan onClick={() => { changeSlide(storyPosition - 1) }}>Prev</ButtonSpan>
            }
            {(storyPosition < numSlides - 1) &&
                <ButtonSpan onClick={() => { changeSlide(storyPosition + 1) }}>Next</ButtonSpan>
            }
            {(storyPosition >= numSlides - 1) &&
                <ButtonSpan onClick={endStory}>Close</ButtonSpan>
            }
        </div>);
    }
}

StoryBox.propTypes = {
    endStory: PropTypes.func.isRequired,
    changeSlide: PropTypes.func.isRequired,
    x: PropTypes.string.isRequired,
    y: PropTypes.string.isRequired,
    w: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    storyPosition: PropTypes.number.isRequired,
    numSlides: PropTypes.number.isRequired,
    arrowType: PropTypes.string.isRequired
}



