import React,{Component} from "react";
import chatSocket from "../../chatData/chatSocket";

export default class MessageForm extends Component{

    _userTyping = false;
    _typeEventEmitted = false;
    _typeTimeout;

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

        if(this.userTyping) {
            clearTimeout(this.typeTimeout);
        }
        this.userTyping = true;
        if(!this.typeEventEmitted){
            this.typeEventEmitted = true;
            chatSocket.socket.emit('started typing');
        }
        this.typeTimeout = setTimeout(() => {
            this.userTyping = false;
            if(this.typeEventEmitted){
                this.typeEventEmitted = false;
                chatSocket.socket.emit('stopped typing');
            }
        },1000);
    };

    onSubmit = event => {
        event.preventDefault();
        /*
            es kann keine leere Nachricht geschickt werden
         */
        if(this.state.message !== ''){
            const message = this.state.message;
            /*
                input wird geleert
             */
            this.setState({
                message: ''
            });
            /*
                message wird zu server emitted, über callback wird msgId geholt
             */
            chatSocket.socket.emit('chat message', message,mid => {
                /*
                    eigene msg wird angehängt
                */
                const chat = chatSocket.getChat(this.props.chatType,this.props.chatId);
                chat.addMessage(chatSocket.userSelf.uid,message,mid);
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

    get userTyping() {
        return this._userTyping;
    }

    set userTyping(value) {
        this._userTyping = value;
    }

    get typeEventEmitted() {
        return this._typeEventEmitted;
    }

    set typeEventEmitted(value) {
        this._typeEventEmitted = value;
    }

    get typeTimeout() {
        return this._typeTimeout;
    }

    set typeTimeout(value) {
        this._typeTimeout = value;
    }
}