import React,{Component} from "reactn";
import ReactDOM from 'react-dom';
import MessageForm from "./MessageForm";
import chatSocket from "../../../chatData/chatSocket";
import Message from "./message/Message";
import {isDifferentDay} from '../../../chatData/message/message'

import './chatContainer.scss';
import Dummy from "../../../utilComp/Dummy";

export default class ChatContainer extends Component{

    _isMounted = false;
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
        if (this.messagesNode.scrollTop === 0 && this.isChatSelected())
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

        const chat = chatSocket.getChat(this.global.currentChat.type,this.global.currentChat.id);
        /*
            loader is only shown, if top not reached
         */
        if(!chat.reachedTopMessages)
            this.setState({
                msgLoading: true
            });
        /*
            messages are loaded
         */
        chat.loadMessages(10)
            .then(messages => {
                /*
                    loader is hidden
                    messages are added
                 */
                this.dispatch.addLoadedMessages(messages);
                this.setState(state => ({
                    msgLoading: false
                }));
                this.setScrollToBottom(this.state.scrollToBottom);
            })
            .catch(err => this.setState({
                msgLoading: false
            }));
    };
    /*
        is called when the selected chat changed
     */
    chatChanged = () => {
        /*
            if scrollToBottom is 0, the messages are loaded
         */
        if (this.messagesNode.scrollTop === 0 && this.isChatSelected())
            this.loadMessages();
    };

    isChatSelected = () => {
        return !(this.global.currentChat.type === '' && this.global.currentChat.id === 0);
    }

    componentDidMount() {
        this.messagesNode = ReactDOM.findDOMNode(this.messages);

        this.chatChanged();

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

            //scrollToBottom wird auf 0 gesetzt
            this.setScrollToBottom(0);

            this.chatChanged();
        }
        /*
            wenn scrollToBottom 0 wird zu bottom gescrollt
         */
        if(this.state.scrollToBottom === 0) {
            this.setScrollToBottom(0);
            /*
                newMessages is set to 0
             */
            if(this.global.currentChat.newMessages > 0)
                this.setGlobal(global => ({
                   currentChat: {
                       ...global.currentChat,
                       newMessages: 0
                   }
                }));
        }

    }

    render() {

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

            if(this.global.currentChat.newMessages > 0)
                return(
                    <div id="scroll-down-number" className="number">
                        {this.global.currentChat.newMessages}
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
                                     scrollToBottom: 0
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
            if(isDifferentDay(msg.date,lastDate)){
                lastDate = msg.date;
                return(
                    <div className = "date-container">
                        <div>
                            {msg.dateString}
                        </div>
                    </div>
                )
            }
            lastDate = msg.date;
            return null;
        };

        const renderAlertNoMessages = () => {
            if(this.global.currentChat.messages.length === 0)
                return(
                    <div className="alert alert-primary" role="alert">
                        Noch keine Nachrichten vorhanden
                    </div>
                );
            return null;
        };

        const renderAlertNotInChat = () => {
            if(!this.global.currentChat.isStillMember)
                return(
                    <div className="error-container">
                        <div>
                            Du bist nicht mehr im chat
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
                    {this.global.currentChat.messages.map((msg,i) => {
                        return (
                            <Dummy key={i}>
                                {renderDateContainer(msg)}
                                <Message
                                    msg={msg}
                                />
                            </Dummy>
                        );
                    })}
                    {renderAlertNoMessages()}
                    {renderAlertNotInChat()}
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