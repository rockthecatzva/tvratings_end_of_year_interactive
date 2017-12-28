import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types';


export default class ToggleSwitch extends React.Component {

    render() {
        const { option1, option2, interactionCallback, selectedOption } = this.props;

        const Container = styled.div`
            border: solid 1px #000;
            border-radius: 3px;
            width: fit-content;
            padding 3px;
            margin-left: auto;
            margin-right: auto;`

        const optionClick = (e) => {
            console.log(e.target.value);
            e.stopPropagation();
            interactionCallback(e.target.value)
        }


        if (option1.value === selectedOption) {
            option1.checked = true;
        }
        else {
            option2.checked = true;
        }

        return (<Container>
                    <label>
                        <input type={"radio"} value={option1.value} checked={option1.checked} onChange={e => { optionClick(e); }} />
                        {option1.label}
                    </label>
                    <label>
                        <input type={"radio"} value={option2.value} checked={option2.checked} onChange={e => { optionClick(e); }} />
                        {option2.label}
                    </label>
                </Container>);
    }
}

ToggleSwitch.propTypes = {
    option1: PropTypes.object.isRequired,
    option2: PropTypes.object.isRequired,
    selectedOption: PropTypes.string.isRequired,
    interactionCallback: PropTypes.func.isRequired
}



