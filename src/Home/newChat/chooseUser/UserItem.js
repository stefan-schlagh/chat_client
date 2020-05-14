import React, {Component} from "react";
import {Link} from "react-router-dom";
import chatSocket from "../../../chatData/chatSocket";

export default class UserItem extends Component{

    elementClicked = event => {

        chatSocket.temporaryChat.createNew(this.props.uid,this.props.username);
        this.props.hide();
    };

    render() {
        return(
            <Link to={"/chat/user/" + this.props.uid}
                  onClick={this.elementClicked}
            >
                <li>
                    {this.props.username}
                </li>
            </Link>
        )
    }
}