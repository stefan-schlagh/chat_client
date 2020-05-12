import React,{Component} from "react";

export default class Modal extends Component{
    render() {
        const clickedOutside = () => {
            this.props.hide();
        };
        return(
            <div
                className="modal-outer"
                onClick={clickedOutside}
            >
                <div className="h-100" style={{display: "flex"}}>

                        <div
                            className="modal-inner"

                            onClick={event => {event.stopPropagation()}}
                        >
                            <div
                                className="modal-btn-close"
                                onClick={this.props.hide}
                            >
                                &times;
                            </div>
                            {this.props.children}
                        </div>

                </div>
            </div>
        )
    }
}