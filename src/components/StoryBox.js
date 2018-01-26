import React from 'react'
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

        return (<div style={dynamicStyle} className={"storyContainer "+arrowType} >

            <div className="closeContainer"><span className="closeSpan" onClick={endStory} >&times;</span></div>
            {message}
    
            <div className="horizontalLine" />

            {(storyPosition > 0) &&
                <span className="buttonSpan" onClick={() => { changeSlide(storyPosition - 1) }}>Prev</span>
            }
            {(storyPosition < numSlides - 1) &&
                <span className="buttonSpan" onClick={() => { changeSlide(storyPosition + 1) }}>Next</span>
            }
            {(storyPosition >= numSlides - 1) &&
                <span className="buttonSpan" onClick={endStory}>Close</span>
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



