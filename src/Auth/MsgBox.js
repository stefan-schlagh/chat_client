import React,{Component} from "react";

class ErrorMsg extends Component{
    render() {
        return(
            <small className="alert alert-danger p-1 message d-block">
                {this.props.children}
            </small>
        )
    }
}

export {ErrorMsg};