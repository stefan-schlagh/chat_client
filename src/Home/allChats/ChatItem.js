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

    isSelected = () => {
        return this.props.id === chatSocket.currentChat.id && this.props.type === chatSocket.currentChat.type;
    };

    render() {

        const chat = chatSocket.getChat(this.props.type,this.props.id);

        const lastMsg = chat.getFirstMessage();

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

        return(
            <li key={this.props._key_}
                className={"list-group-item p-1" + (this.isSelected() ? " selected " : "")}
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

    newMessage = uid => {
        /*
            wenn chat nicht selected, wird newMessages inkrmentiert
         */
        if(!this.isSelected()) {
            this.setState(state => ({
                unreadMessages: state.unreadMessages + 1
            }));
        }
        /*
            chat wird nach oben gereiht
         */
        this.props.toTop(this.props._key_);
    };

    componentDidMount() {
        const chat = chatSocket.getChat(this.props.type,this.props.id);
        chat.event.on("new message",this.newMessage);
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        /*
            wenn component selected, wird newMessages counter zurückgesetzt
         */
        if(this.isSelected() && this.state.unreadMessages !== 0)
            this.setState({
                unreadMessages: 0
            });

    }
    componentWillUnmount() {
        const chat = chatSocket.getChat(this.props.type,this.props.id);
        chat.event.rm("new message",this.newMessage());
    }
}