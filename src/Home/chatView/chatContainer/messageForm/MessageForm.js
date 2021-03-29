import React, {Component, Fragment} from "react";
import chatSocket from "../../../../chatData/chatSocket";
import 'emoji-mart/css/emoji-mart.css';
import { Picker } from 'emoji-mart';
import {withRouter} from "react-router-dom";
import {globalData} from "../../../../global/globalData";
import {sendMessage} from "../../apiCalls";
import Responsive from "../../../../responsive/Responsive";
import FileChooser from "./FileChooser";
import {FileList} from "./FileList";

import './messageForm.scss';

class MessageForm extends Component{

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
            message: '',
            files: [],
            showEmoji: false
        }
    }

    onTyping = event => {

        this.setState({
           message: event.target.value
        });

        this.handleTypeMessage();
    };

    handleTypeMessage = () => {
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
        if(this.state.message !== '' || this.state.files.length > 0){
            // is held at the client
            const messageContentSelf = {
                text: this.state.message,
                files: this.state.files
            };
            // gets send to the server
            const messageContentSend = {
                text: this.state.message,
                files: this.getFileIds()
            };
            /*
                input wird geleert
             */
            this.setState({
                message: ''
            });
            if(this.isTempChat) {

                const {pathname} = this.props.location;
                /*
                    the chat is created
                 */
                chatSocket.temporaryChat.createNewNormalChat(messageContentSelf,messageContentSend)
                    .then(redirect => {
                        if(redirect) {
                            this.props.history.replace("/chat");
                            this.props.history.replace(pathname);
                        }
                    });
            }else{

                this.sendMessage(messageContentSend)
                    .then(mid => {
                        // reset file array
                        this.setState({
                            files: []
                        })
                        /*
                            message is added to chat
                         */
                        const chat = chatSocket.getChat(this.props.chatType, this.props.chatId);
                        chat.addMessage(
                            chatSocket.userSelf.uid,
                            mid,
                            globalData.messageTypes.normalMessage,
                            messageContentSelf
                        );
                    })
                    .catch(err => {});
            }
        }
    };

    sendMessage = async msgContent => {
        /*
            message is sent to server
         */
        const response = await sendMessage({
            type: globalData.messageTypes.normalMessage,
            content: msgContent
        });

        if (response.ok) {

            const data = await response.json();
            /*
                mid is returned
             */
            return data.mid;
        }
        throw new Error();
    };

    onEmojiInput = emoji => {

        this.setState({
            message: this.state.message + emoji.native
        });
        this.handleTypeMessage();
    };

    toggleEmoji = event => {
        this.setState(state => ({
            showEmoji: !state.showEmoji
        }))
    };

    addFiles = files => {
        this.setState(state => {{
            if(state.files.length + files.length <= 10)
                return {
                    files: [...state.files, ...files]
                }
        }})
    }

    deleteFile = file => {
        this.setState(state => {
            let filesClone = state.files.slice()
            let i = 0
            for(const stateFile of filesClone){
                if(stateFile.fid === file.fid) {
                    filesClone.splice(i, 1)
                    break
                }
                i++
            }
            return {
                files: filesClone
            }
        })
    }

    getFileIds = () => {
        const fileIds = []
        for(const file of this.state.files)
            fileIds.push(file.fid)
        return fileIds
    }

    render() {
        return(
            <Fragment>
                <FileList
                    files={this.state.files}
                    deleteFile={this.deleteFile}
                />
                <form onSubmit={this.onSubmit}
                      className="msg-form">
                    <div className="message-input">
                        <input autoComplete="off"
                               placeholder="Nachricht:"
                               name="message-input-text"
                               value={this.state.message}
                               onChange={this.onTyping}
                        />
                        <Responsive displayIn={["Laptop","Tablet"]}>
                            <i className="far fa-smile fa-2x emoji-toggle"
                               onClick={this.toggleEmoji}
                            />
                        </Responsive>
                        <FileChooser
                            onFileUpload={this.addFiles}
                            files={this.state.files}
                        />
                    </div>
                    <button className="btn-submit" type="submit">
                        <i className="far fa-paper-plane fa-2x"
                           data-toggle="tooltip"
                           title="send message" />
                    </button>
                </form>
                {this.state.showEmoji ?
                    <div style={{
                        position: 'absolute',
                        bottom: '60px',
                        right: '50px',
                        width: '350px',
                        height: '425px'
                    }}>
                        <Picker
                            onSelect={this.onEmojiInput}
                            native={true}
                        />
                    </div>
                : null}
            </Fragment>
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

export default withRouter(MessageForm);