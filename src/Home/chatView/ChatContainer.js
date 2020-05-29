import React,{Component} from "react";
import ReactDOM from 'react-dom';
import MessageForm from "./MessageForm";
import chatSocket from "../../chatData/chatSocket";
import Message from "./Message";

export default class ChatContainer extends Component{

    _isMounted = false;
    _messages;
    _messagesNode;

    constructor(props) {
        super(props);
        this.assignMessagesRef = this.assignMessagesRef.bind(this);
        this.state = {
            msgLoading: false,
            scrollToBottom: 0,
            newMessages: 0,
            typeMessages: []
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

    newMessage = uid => {
        /*
            wenn nach unten gescrollt:
                state.newMsg = 0
            wenn nicht nach unten gescrollt
                wenn eigene msg
                     state.newMsg = 0
                     nach unten scrollen
                wenn nicht eigene msg
                    state.newMsg ++
                    derzeitigen scrollstatus beibehalten
         */
        if(this.getScrollToBottom() === 0){
            this.setState({
                newMessages: 0
            });
        }else{
            if(uid === chatSocket.userSelf.uid){
                this.setState({
                    scrollToBottom: 0,
                    newMessages: 0
                });
            }else{
                this.setState(state => ({
                    newMessages: state.newMessages +1
                }));
            }
        }
    };

    componentDidMount() {
        this.messagesNode = ReactDOM.findDOMNode(this.messages);
        if(this.messagesNode.scrollTop === 0)
            this.loadMessages();

        const chat = chatSocket.getChat(this.props.chatType,this.props.chatId);
        chat.event.on('messages loaded',this.messagesLoaded);
        chat.event.on('new message',this.newMessage);

        this.isMounted = true;
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
            prevChat.event.rm('new message',this.newMessage);

            const newChat = chatSocket.getChat(this.props.chatType,this.props.chatId);
            newChat.event.on('messages loaded',this.messagesLoaded);
            newChat.event.on('new message',this.newMessage);

            //scrollToBottom wird auf 0 gesetzt
            this.setScrollToBottom(0);
            //wenn scrolltop = 0, werden messages geladen
            if (this.messagesNode.scrollTop === 0)
                this.loadMessages();
        }
        /*
            wenn scrollToBottom 0 wird zu bottom gescrollt
         */
        if(this.state.scrollToBottom === 0)
            this.setScrollToBottom(0);

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

        const renderNewMessages = () => {
            if(this.state.newMessages > 0)
                return(
                    <div id="scroll-down-number" className="number">
                        {this.state.newMessages}
                    </div>
                );
            return null;
        };

        const renderBtnToBottom = () => {
            if(this.isMounted) {
                if (this.getScrollToBottom() > 10) {
                    return (
                        <div id="messages-bottom"
                             className="messages-bottom"
                             onClick={() => {
                                 this.setState({
                                     scrollToBottom: 0,
                                     newMessages: 0
                                 })
                             }}
                        >
                            <div id="btnToBottom" className="chevron-down">
                                <i className="fas fa-chevron-down fa-2x"/>
                            </div>
                            {renderNewMessages()}
                        </div>
                    )
                }
            }
            return null;
        };

        let lastDate = new Date(0);
        /*
            wenn der Tag der letzten Nachrichten ein anderer wie der von dieser ist,
            wird ein Container mit Datum gerendert
         */
        const renderDateContainer = msg => {
            if(msg.isDifferentDay(lastDate)){
                lastDate = msg.date;
                return(
                    <div className = "date-container">
                        <div>
                            {msg.getDateString()}
                        </div>
                    </div>
                )
            }
            lastDate = msg.date;
            return null;
        };

        const renderAlertNoMessages = () => {
            if(chat.messages.length === 0)
                return(
                    <div className="alert alert-primary" role="alert">
                        Noch keine Nachrichten vorhanden
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
                    {chat.messages.map((msg,i) => {
                        return (
                            <div key={i}>
                                {renderDateContainer(msg.value)}
                                <Message
                                    msg={msg.value}
                                />
                            </div>
                        );
                    })}
                    {renderAlertNoMessages()}
                    {renderBtnToBottom()}
                </div>
                <MessageForm
                    chatType={this.props.chatType}
                    chatId={this.props.chatId}
                />
            </div>
        )
    }

    componentWillUnmount() {
        this.isMounted = false;

        const chat = chatSocket.getChat(this.props.chatType,this.props.chatId);
        chat.event.rm('messages loaded',this.messagesLoaded);
        chat.event.rm('new message',this.newMessage);
    }

    get isMounted() {
        return this._isMounted;
    }

    set isMounted(value) {
        this._isMounted = value;
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