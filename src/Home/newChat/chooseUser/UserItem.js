import React, {Component} from "react";
import {Link,withRouter} from "react-router-dom";
import chatSocket from "../../../chatData/chatSocket";

class UserItem extends Component{

    elementClicked = event => {

        chatSocket.temporaryChat.createNew(this.props.uid,this.props.username);
    };

    render() {
        return(
            <li>
                <Link to={"/chat/user/" + this.props.uid}
                      onClick={this.elementClicked}
                      replace={true}
                >
                {this.props.username}
                </Link>
            </li>
        )
    }
}
export default withRouter(UserItem);