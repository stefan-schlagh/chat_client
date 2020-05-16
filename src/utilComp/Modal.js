import React,{Component} from "react";
import {withRouter} from 'react-router-dom';

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
                                className="modal-btn-close"
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