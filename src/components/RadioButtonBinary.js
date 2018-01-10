import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types';


export default class ToggleSwitch extends React.Component {

    render() {
        const { option1, option2, interactionCallback, selectedOption } = this.props;

        const Container = styled.div`
            width: fit-content;
            padding 3px;
            margin-left: auto;`,

            OutterSwitch = styled.div`
                width: 34px;
                height: 18px;
                background-color: #ccc;
                border-radius: 34px;
                position: relative;
                cursor: pointer;
              `,

            InnerSwitchLeft = styled.div`
                width: 14px;
                height: 14px;
                background-color: #fff;
                border-radius: 100%;
                position: absolute;
                left: 3px;
                top: 2px;
              `,
            InnerSwitchRight = styled.div`
              width: 14px;
              height: 14px;
              background-color: #fff;
              border-radius: 100%;
              position: absolute;
              right: 3px;
              top: 2px;
            `;

        const optionClick = (e) => {
            //console.log(e.target.value, typeof(e.target.value));
            e.stopPropagation();
            interactionCallback(e.target.value)
        }

        const toggleClick = () => {
            if (option1.checked) {
                interactionCallback(option2.value)
            }
            else {
                interactionCallback(option1.value)
            }
        }


        let toggle = null;

        if (option1.value === selectedOption) {
            option1.checked = true;
            toggle = (<OutterSwitch onClick={() => { toggleClick() }}  >
                <InnerSwitchLeft />
            </OutterSwitch>);
        }
        else {
            option2.checked = true;
            toggle = (<OutterSwitch onClick={() => { toggleClick() }}  >
                <InnerSwitchRight />
            </OutterSwitch>);
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



