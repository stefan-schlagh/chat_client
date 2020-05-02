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
                            className="col-sm-12 my-auto modal-inner"
                            style={{
                                maxWidth: '800px'
                            }}
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