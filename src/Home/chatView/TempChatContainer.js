import React,{Component} from "react";
import MessageForm from "./chatContainer/MessageForm";
import chatSocket from "../../chatData/chatSocket";

export default class TempChatContainer extends Component{

    render() {
        return(
            <div className="chat-container">
                <div className="messages">
                    <div className="alert alert-primary" role="alert">
                        Noch keine Nachrichten vorhanden
                    </div>
                </div>
                <MessageForm
                    chatType={'tempChat'}
                    chatId={0}
                />
            </div>
        );
    }
    componentDidMount() {
        chatSocket.temporaryChat.show();
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.uid !== this.props.uid)
            chatSocket.temporaryChat.update();
    }
    componentWillUnmount() {
        chatSocket.temporaryChat.hide();
    }
}