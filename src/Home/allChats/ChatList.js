import React,{Component} from "react";
import ChatSearchBox from "./ChatSearchBox";
import ChatItem from "./ChatItem";
import chatSocket from "../../chatData/chatSocket";

export default class ChatList extends Component{

    constructor(props) {
        super(props);
        this.state = {
            chats: []
        };
    }

    componentDidMount() {
        if(chatSocket.finishedLoading){
            this.setState({
                chats: chatSocket.getChatArraySortedByDate()
            });
        }else{
            chatSocket.on('chats loaded',chats => {
                this.setState({
                    chats: chatSocket.getChatArraySortedByDate()
                });
            });
        }
    }

    render() {

        const paddingTop = this.props.paddingTop || '1rem';

        return(
            <div style={{
                paddingTop: paddingTop
            }}>
                <div className="chat-container m-2">
                    <ChatSearchBox />

                    <ul className="chat-list list-group">
                        {this.state.chats.map((chat,i) => (
                            <ChatItem
                                key={i}
                                _key_={i}
                                name={chat.chatName}
                                lastMessage={chat.messages[chat.messages.length-1]}
                            />
                        ))}
                    </ul>
                </div>
            </div>
        )
    }
}