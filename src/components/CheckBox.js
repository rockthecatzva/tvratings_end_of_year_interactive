import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types';


export default class CheckBox extends React.Component {

    render() {
        const { label, interactionCallback, selected } = this.props;

        const  Container = styled.div`
        width: fit-content;
        padding 3px;
        margin-left: auto;
        margin-right: auto;`,

        GreyedButton = styled.div`
        padding-left: 5px;
        padding-right: 5px;  
        color: #727272;
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

          SelectedButton = styled.div`
          padding-left: 5px;
          padding-right: 5px;
          height: 18px;
          border: solid 1px #000;
          background-color: #fff;
          border-radius: 34px;
          position: relative;
          cursor: pointer;
          display: inline-block;
          top: 5px;
          margin-left: 5px;
          margin-right: 5px;     
          box-shadow: 0px 0px 3px 0px #000;       
        `
          

        const buttonClick = ()=>{
            if(selected){
                interactionCallback(false)
            }
            else{
                interactionCallback(true)
            }
        }

        let button;

        if(selected){
            button = <SelectedButton onClick={()=>{buttonClick()}} >{label}</SelectedButton>
        }
        else{
            button = <GreyedButton onClick={()=>{buttonClick()}} >{label}</GreyedButton>
        }

        return (<Container>
                  {button}
                </Container>);
    }
}

CheckBox.propTypes = {
    label: PropTypes.string.isRequired,
    selected: PropTypes.bool.isRequired,
    interactionCallback: PropTypes.func.isRequired
}



