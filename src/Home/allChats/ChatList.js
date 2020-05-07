import React,{Component} from "react";
import ChatSearchBox from "./ChatSearchBox";
import ChatItem from "./ChatItem";
import chatSocket from "../../chatData/chatSocket";

export default class ChatList extends Component{

    constructor(props) {
        super(props);
        this.state = {
            chats: [],
            searchValue: ''
        };
    }

    componentDidMount() {
        if(chatSocket.finishedLoading){
            this.setState({
                chats: chatSocket.getChatArraySortedByDate()
            });
        }else{
            chatSocket.event.on('chats loaded',chats => {
                this.setState({
                    chats: chats
                });
            });
        }
    }

    render() {

        const paddingTop = this.props.paddingTop || '1rem';
        let found = 0;

        const showNothingFoundMsg = () => {
            if(found === 0)
                return(
                    <span>
                        Nichts gefunden
                    </span>
                );
            return null;
        };

        return(
            <div style={{
                paddingTop: paddingTop
            }}>
                <div className="chat-container m-2">
                    <ChatSearchBox
                        onSearch={searchValue => {
                            this.setState({
                                searchValue: searchValue
                            })
                        }}
                    />

                    <ul className="chat-list list-group">
                        {this.state.chats.map((chat,i) => {
                            if(chat.chatName.includes(this.state.searchValue)) {
                                found++;
                                return (
                                    <ChatItem
                                        key={i}
                                        _key_={i}
                                        id={chat.id}
                                        type={chat.type}
                                        name={chat.chatName}
                                        lastMessage={chat.lastMessage}
                                    />
                                );
                            }
                            return null;
                        })}
                    </ul>
                    {showNothingFoundMsg()}
                </div>
            </div>
        )
    }
}