import React,{Component} from "react";
import chatSocket from "../../chatData/chatSocket";

import './typeMessageContainer.scss';

export default class TypeMsgContainer extends Component{

    constructor(props) {
        super(props);
        this.state = {
            usersTyping: []
        };
    }
    typeStateChanged = () => {

        const chat = chatSocket.getChat(this.props.chatType,this.props.chatId);
        this.setState({
            usersTyping: chat.getUsersTyping()
        });
    };

    render() {

        return(
            <div className="typeMsg-container">
                {this.state.usersTyping.map((user,index) => (
                    <div key={index} className="typeMsg">
                        {user.username + " schreibt..."}
                    </div>
                ))}
            </div>
        );
    }

    componentDidMount() {

        const chat = chatSocket.getChat(this.props.chatType,this.props.chatId);
        chat.event.on("typeState changed",this.typeStateChanged);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        /*
            es wird überprüft, ob sich der chat geändert hat
            wenn ja, werden events neu initialisiert
         */
        if(prevProps.chatType !== this.props.chatType || prevProps.chatId !== this.props.chatId) {

            const prevChat = chatSocket.getChat(prevProps.chatType,prevProps.chatId);
            prevChat.event.rm("typeState changed",this.typeStateChanged);

            const newChat = chatSocket.getChat(this.props.chatType,this.props.chatId);
            newChat.event.on("typeState changed",this.typeStateChanged);
        }
    }

    componentWillUnmount() {

        const chat = chatSocket.getChat(this.props.chatType,this.props.chatId);
        chat.event.rm("typeState changed",this.typeStateChanged);
    }
}