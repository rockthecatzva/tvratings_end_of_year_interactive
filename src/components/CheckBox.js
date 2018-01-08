import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types';


export default class CheckBox extends React.Component {

    render() {
        const { label, interactionCallback, selected } = this.props;

        const Container = styled.div`
            width: fit-content;
            padding 3px;
            margin-left: auto;`

        const optionClick = (e) => {
            console.log(e.target.checked, typeof(e.target.value));
            e.stopPropagation();
            interactionCallback(e.target.checked)
        }

        return (<Container>
                   <input id="storyMode" type="checkbox" onChange={(e)=>{optionClick(e)}} checked={selected} />
                   <label htmlFor="storyMode">{label}</label>
                </Container>);
    }
}

CheckBox.propTypes = {
    label: PropTypes.string.isRequired,
    selected: PropTypes.bool.isRequired,
    interactionCallback: PropTypes.func.isRequired
}



