import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types';


export default class ToggleSwitch extends React.Component {

    render() {
        const { option1, option2, interactionCallback, selectedOption } = this.props;

        const Container = styled.div`
            width: fit-content;
            padding 3px;
            margin-left: auto;
            margin-right: auto;`,

            OutterSwitch = styled.div`
                width: 34px;
                height: 18px;
                background-color: #ccc;
                border-radius: 34px;
                position: relative;
                cursor: pointer;
                display: inline-block;
                top: 5px;
                margin-left: 5px;
                margin-right: 5px;            
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
            `,
            SelectedLabel = styled.span`
                font-weight: bold;
                color: #000;`,
            DeselectedLabel = styled.span`
                cursor: pointer;
                font-weight: normal;
                color: #ccc;`


        const toggleClick = () => {
            if (option1.checked) {
                interactionCallback(option2.value)
            }
            else {
                interactionCallback(option1.value)
            }
        }


        let toggle, label1, label2;

        if (option1.value === selectedOption) {
            option1.checked = true;
            toggle = (<InnerSwitchLeft />);
            label1 = <SelectedLabel>{option1.label}</SelectedLabel>
            label2 = <DeselectedLabel onClick={() => { toggleClick() }}>{option2.label}</DeselectedLabel>
        }
        else {
            option2.checked = true;
            toggle = (<InnerSwitchRight />);
            label1 = <DeselectedLabel onClick={() => { toggleClick() }}>{option1.label}</DeselectedLabel>
            label2 = <SelectedLabel>{option2.label}</SelectedLabel>
        }

        return (<Container>

            {label1}
            <OutterSwitch onClick={() => { toggleClick() }}  >
                {toggle}
            </OutterSwitch>
            {label2}
        </Container>);
    }
}

ToggleSwitch.propTypes = {
    option1: PropTypes.object.isRequired,
    option2: PropTypes.object.isRequired,
    selectedOption: PropTypes.string.isRequired,
    interactionCallback: PropTypes.func.isRequired
}



