import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types';


export default class StoryBox extends React.Component {

    render() {
        const { endStory, changeSlide, x, y, w, message, storyPosition, numSlides } = this.props;

        const Container = styled.div`
            position: absolute;
            width: ${w};
            height: fit-content;
            top: ${y};
            left: ${x};
            padding: 5px;
            margin: 6px;
            color: #fff;
            border-radius: 3px;
            background-color: #000;
            font-size: 0.8em;
            text-align: left;
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

        return (<Container>

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
        </Container>);
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
    numSlides: PropTypes.number.isRequired
}



