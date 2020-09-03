import React,{Component} from "react";

import "./TogglePassword.scss"

export default class TogglePassword extends Component{

    constructor(props) {
        super(props);
        this.state = {
            showPassword: false
        }
    }
    render() {
        return(
            <div className="psw-group">
                <i className={(this.state.showPassword ? "fa-eye-slash" : "fa-eye") + " fas psw-toggle-icon"}
                   onClick={() => this.setState(state => ({showPassword: !state.showPassword}))}
                />
                <input type={this.state.showPassword ? "text" : "password"}
                       {...this.props}
                />
            </div>
        )
    }


}