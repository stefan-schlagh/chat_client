import React,{Component} from "react";
import {withRouter} from 'react-router-dom';

import './Modal.scss';

class Modal extends Component{

    render() {
        const clickedOutside = () => {
            this.props.history.goBack();
        };
        return(
            <div
                className="modal-outer"
                onClick={clickedOutside}>
                <div className="h-100" style={{display: "flex"}}>

                        <div
                            className="modal-inner"
                            onClick={event => {event.stopPropagation()}}>
                            <div
                                className="btn-close"
                                onClick={() => {this.props.history.goBack()}}>
                                &times;
                            </div>
                            {this.props.children}
                        </div>

                </div>
            </div>
        )
    }
}
export default withRouter(Modal);

export function ModalHeader(props){
    return(
        <div className="m-header">
            {props.children}
        </div>
    )
}

export function ModalMain(props){
    return(
        <div className="m-main">
            {props.children}
        </div>
    )
}