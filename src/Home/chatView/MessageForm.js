import React,{Component} from "react";
import chatSocket from "../../chatData/chatSocket";

export default class MessageForm extends Component{

    _userTyping = false;
    _typeEventEmitted = false;
    _typeTimeout;
    /*
        if the MessageFrom belongs to a tempChat, it has some other actions to do
     */
    _isTempChat;

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
        /*
            type message get only handled if the chat is not temporary
         */
        if(!this.isTempChat) {

            if (this.userTyping) {
                clearTimeout(this.typeTimeout);
            }
            this.userTyping = true;
            if (!this.typeEventEmitted) {
                this.typeEventEmitted = true;
                chatSocket.socket.emit('started typing');
            }
            this.typeTimeout = setTimeout(() => {
                this.userTyping = false;
                if (this.typeEventEmitted) {
                    this.typeEventEmitted = false;
                    chatSocket.socket.emit('stopped typing');
                }
            }, 1000);
        }
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
            if(this.isTempChat) {
                /*
                    the chat is created
                 */
                chatSocket.temporaryChat.createNewNormalChat(message);
            }else{
                /*
                    message wird zu server emitted, über callback wird msgId geholt
                 */
                chatSocket.socket.emit('chat message', message, mid => {
                    /*
                        eigene msg wird angehängt
                    */
                    const chat = chatSocket.getChat(this.props.chatType, this.props.chatId);
                    chat.addMessage(chatSocket.userSelf.uid, message, mid);
                });
            }
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

    componentDidMount() {
        /*
            isTempChat gets set
         */
        this.isTempChat = this.props.chatType === 'tempChat';
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        /*
            isTempChat gets updated
         */
        this.isTempChat = this.props.chatType === 'tempChat';
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

    get isTempChat() {
        return this._isTempChat;
    }

    set isTempChat(value) {
        this._isTempChat = value;
    }
}