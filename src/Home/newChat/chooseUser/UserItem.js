import React,{Component} from "react";
import {Link} from "react-router-dom";

export default class UserItem extends Component{
    render() {
        return(
            <Link to={"/chat/user/" + this.props.uid}>
                <li>
                    {this.props.username}
                </li>
            </Link>
        )
    }
}