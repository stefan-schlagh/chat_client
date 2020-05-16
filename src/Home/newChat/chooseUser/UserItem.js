import React, {Component} from "react";
import {Link,withRouter} from "react-router-dom";
import chatSocket from "../../../chatData/chatSocket";

class UserItem extends Component{

    elementClicked = event => {

        this.props.history.goBack();
        chatSocket.temporaryChat.createNew(this.props.uid,this.props.username);
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
export default withRouter(UserItem);