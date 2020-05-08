import React,{Component} from "react";
import chatSocket from "../../chatData/chatSocket";

export default class MessageForm extends Component{

    constructor(props) {
        super(props);
        this.state = {
            message: ''
        }
    }

    onTyping = event => {
        this.setState({
           message: event.target.value
        });
    };

    onSubmit = event => {
        event.preventDefault();
        /*
            es kann keine leere Nachricht geschickt werden
         */
        if(this.state.message !== ''){
            /*
                message wird zu server emitted, über callback wird msgId geholt
             */
            chatSocket.socket.emit('chat message', this.state.message,mid => {
                /*
                    eigene msg wird angehängt
                */
                const chat = chatSocket.getChat(this.props.chatType,this.props.chatId);
                chat.addMessage(chatSocket.userSelf.uid,this.state.message,mid);
                /*
                    input wird geleert
                 */
                this.setState({
                    message: ''
                });
            });
        }
    };

    render() {
        return(
            <form onSubmit={this.onSubmit}>
                <div className="msg-form">
                    <input autoComplete="off"
                           placeholder="Nachricht:"
                           value={this.state.message}
                           onChange={this.onTyping}
                    />
                    <button type="submit">
                        <i className="far fa-paper-plane fa-2x" data-toggle="tooltip" title="send message" />
                    </button>
                </div>
            </form>
        )
    }
}