import React,{Component} from "react";

export default class UserItem extends Component{

    clicked = event => {
        if(this.props.isSelected){
            this.props.deselectUser(this.props.index);
        }else
            this.props.selectUser(this.props.index);
    };

    render() {
        return(
            <li key={this.props.index}
                onClick={this.clicked}
            >
                <div className="username">
                    {this.props.username}
                </div>
                <div className={"user-select fa-lg" + (this.props.isSelected ? " selected" : "")}>
                    <i className="fas fa-check" />
                </div>
            </li>
        );
    }
}