import React from 'react'
import PropTypes from 'prop-types';
import * as deepEqual from 'deep-equal'
import './ToggleSwitch.css'

export default class ToggleSwitch extends React.Component {

    shouldComponentUpdate(nextProps) {
        return (!deepEqual(nextProps.selectedOption, this.props.selectedOption))
    }


    render() {
        const { option1, option2, interactionCallback, selectedOption } = this.props;

        const toggleClick = () => {
            if (option1.checked) {
                interactionCallback(option2.value)
            }
            else {
                interactionCallback(option1.value)
            }
        }


        let toggle, label1, label2, 
            toggleClass="switch",
            label1Class="",
            label2Class="";

        if (option1.value === selectedOption) {
            option1.checked = true;
            toggleClass += " innerSwitchLeft"
            label1 = <span className="selectedLabel">{option1.label}</span>
            label2 = <span className="deselectedLabel" onClick={() => { toggleClick() }}>{option2.label}</span>
        }
        else {
            option2.checked = true;
            toggleClass += " innerSwitchRight"
            label1 = <span className="deselectedLabel" onClick={() => { toggleClick() }}>{option1.label}</span>
            label2 = <span className="selectedLabel">{option2.label}</span>
        }

        toggle = <div className={toggleClass} />;
        //label1 = <span className="selectedLabel">{option1.label}</span>
        //label2 = <span className="deselectedLabel" onClick={() => { toggleClick() }}>{option2.label}</span>

        return (
            <div className="toggleContainer">
                <div className="leftLabel label">{label1}</div>
                <div className="outerSwitch" onClick={() => { toggleClick() }}  >
                    {toggle}
                </div>
                <div className="label">{label2}</div>
            </div>);
    }
}

ToggleSwitch.propTypes = {
    option1: PropTypes.object.isRequired,
    option2: PropTypes.object.isRequired,
    selectedOption: PropTypes.string.isRequired,
    interactionCallback: PropTypes.func.isRequired
}



