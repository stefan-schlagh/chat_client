import React,{Component} from "react";
import {Link} from "react-router-dom";
import chatSocket from "../../chatData/chatSocket";

export default class ChatItem extends Component{

    constructor(props) {
        super(props);
        this.state = {
            unreadMessages: 0
        }
    }
    render() {

        const chat = chatSocket.getChat(this.props.type,this.props.id);

        const lastMsg = chat.messages.get(this.props.lastMessage.mid);

        const renderUnreadMsg = () => {
            if(this.state.unreadMessages === 0)
                return null;
            else
                return(
                    <div className="newMsg-number">
                        {this.state.unreadMessages}
                    </div>
                );
        };

        const renderMsg = () => {
            if(lastMsg)
                return(
                    <span>
                        {lastMsg.getChatViewMsgString()}
                    </span>
                );
            else
                return(
                    <span>
                        Noch keine Nachrichten vorhanden
                    </span>
                );
        };

        const renderDate = () => {
            if(lastMsg)
                return(
                    <div className="lastMsg-date">
                        {lastMsg.getChatViewDateString()}
                    </div>
                );
            else
                return null;
        };

        const getLink = () => {
            if(this.props.type === 'normalChat'){
                return '/chat/user/' + chatSocket.getChat('normalChat',this.props.id).otherUser;
            }else if(this.props.type === 'groupChat'){
                return '/chat/' + this.props.id;
            }
        };
        
        const isSelected = () => {
            return this.props.id === chatSocket.currentChat.id && this.props.type === chatSocket.currentChat.type;
        };

        return(
            <li key={this.props._key_}
                className={"list-group-item p-1" + (isSelected() ? " selected " : "")}
            >
                <Link to={getLink()}>
                    <div className="w-100">
                        <strong>
                            {this.props.name}
                        </strong>
                        {renderUnreadMsg()}
                    </div>
                    <div className="w-100 lastMsg">
                        {renderMsg()}
                        {renderDate()}
                    </div>
                </Link>
            </li>
        )
    }
}