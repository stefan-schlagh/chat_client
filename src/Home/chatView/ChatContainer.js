import React,{Component} from "react";
import ReactDOM from 'react-dom'
import MessageForm from "./MessageForm";
import chatSocket from "../../chatData/chatSocket";
import Message from "./Message";

export default class ChatContainer extends Component{
    
    _messages;
    _messagesNode;

    constructor(props) {
        super(props);
        this.assignMessagesRef = this.assignMessagesRef.bind(this);
        this.state = {
            msgLoading: false,
            scrollToBottom: 0
        };
    }
    //scroll: https://jsfiddle.net/jwm6k66c/2480/
    scrollHandler = event => {
        this.setState({
            scrollToBottom: this.getScrollToBottom()
        });
        /*
            wenn oben angelangt, werden Nachrichten geladen
         */
        if (this.messagesNode.scrollTop === 0)
            this.loadMessages();
    };

    setScrollToBottom = val => {
        this.messagesNode.scrollTop = this.messagesNode.scrollHeight - this.messagesNode.offsetHeight - val;
    };

    getScrollToBottom  = () => {
        return this.messagesNode.scrollHeight - this.messagesNode.offsetHeight - this.messagesNode.scrollTop;
    };

    assignMessagesRef = target => {
        this.messages = target;
    };

    loadMessages = () => {
        this.setState({
            msgLoading: true
        });
        const chat = chatSocket.getChat(this.props.chatType,this.props.chatId);
        chat.loadMessages(10);
    };

    messagesLoaded = () => {
        this.setState({
            msgLoading: false
        });
        this.setScrollToBottom(this.state.scrollToBottom);
    };

    componentDidMount() {
        this.messagesNode = ReactDOM.findDOMNode(this.messages);
        if(this.messagesNode.scrollTop === 0)
            this.loadMessages();

        const chat = chatSocket.getChat(this.props.chatType,this.props.chatId);
        chat.event.on('messages loaded',this.messagesLoaded);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        /*
            es wird überprüft, ob sich der chat geändert hat
            wenn das der Fall ist:
                wird messages loaded listener auf neuen chat angewandt
                scrollToBottom wird auf 0 gesetzt
                scrolltop wird überprüft
         */
        if(prevProps.chatType !== this.props.chatType || prevProps.chatId !== this.props.chatId) {
            //message loaded listener
            const prevChat = chatSocket.getChat(prevProps.chatType,prevProps.chatId);
            prevChat.event.rm('messages loaded',this.messagesLoaded);
            const newChat = chatSocket.getChat(this.props.chatType,this.props.chatId);
            newChat.event.on('messages loaded',this.messagesLoaded);
            //scrollToBottom wird auf 0 gesetzt
            this.setScrollToBottom(0);
            //wenn scrolltop = 0, werden messages geladen
            if (this.messagesNode.scrollTop === 0)
                this.loadMessages();
        }
    }

    render() {

        const chat = chatSocket.getChat(this.props.chatType,this.props.chatId);

        const showLoaderTop = () => {
            if(this.state.msgLoading)
                return(
                    <div className="messageLoader-top">
                        <div className="spinner-border text-secondary" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                );
            return null;
        };

        return(
            <div className="chat-container">
                <div className="messages"
                     onScroll={this.scrollHandler}
                     ref={this.assignMessagesRef}
                >
                    {showLoaderTop()}
                    {chat.messages.map((msg,i) => (
                        <div key={i}>
                            <Message
                                msg={msg.value}
                            />
                        </div>
                    ))}
                </div>
                <MessageForm />
            </div>
        )
    }

    get messages() {
        return this._messages;
    }

    set messages(value) {
        this._messages = value;
    }

    get messagesNode() {
        return this._messagesNode;
    }

    set messagesNode(value) {
        this._messagesNode = value;
    }
}