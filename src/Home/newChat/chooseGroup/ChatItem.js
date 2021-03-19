import React, {Component} from "reactn";
import {withRouter} from "react-router-dom";
import {joinGroupChat} from "../../chatView/apiCalls";
import chatSocket from "../../../chatData/chatSocket";

class ChatItem extends Component{

    newChat = data => {
        if(data.id === this.props.id){
            // select chat
            const chat = chatSocket.getChat('groupChat',this.props.id);
            this.dispatch.selectChat(chat).then(() => {
                this.props.history.push('/chat/group/' + this.props.id);
                chatSocket.event.rm('new chat',this.newChat);
            });
        }
    };

    elementClicked = event => {

        chatSocket.event.on('new chat',this.newChat);
        joinGroupChat(this.props.id)
            .then(() => {
            })
            .catch(() => {})
    };

    render() {
        return(
            <li>
                <span
                    className={"item"}
                    onClick={this.elementClicked}
                >
                    {this.props.name}
                </span>
            </li>
        )
    }
}
export default withRouter(ChatItem);