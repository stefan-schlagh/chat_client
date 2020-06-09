import React,{Component} from "reactn";
import ChatSearchBox from "./ChatSearchBox";
import ChatItem from "./ChatItem";
import chatSocket from "../../chatData/chatSocket";

import './chatList.scss';

export default class ChatList extends Component{

    constructor(props) {
        super(props);
        this.state = {
            //the current searchValue at the chatlist
            searchValue: ''
        };
    }

    chatsLoaded = chats => {
        this.setGlobal({
            chats: chats
        });
    };

    componentDidMount() {
        /*
            chats get initialized
            is loading of chats already finished?
                --> chatArray gets requested immediately
         */
        if(chatSocket.finishedLoading){
            this.setGlobal({
                chats: chatSocket.getChatArraySortedByDate()
            });
        /*
            otherwise --> event handler that gets triggered when loading finished
         */
        }else{
            chatSocket.event.on('chats loaded',this.chatsLoaded);
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

        const renderTempChat = () => {
            /*
                is tempChat not null?
             */
            if(this.global.tempChat){
                return(
                    <ChatItem
                        key={-1}
                        id={0}
                        type={'tempChat'}
                        name={this.global.tempChat.chatName}
                        unreadMessages={0}
                        latestMessage={null}
                    />
                );
            }
            return null;
        };

        return(
            <div style={{
                paddingTop: paddingTop,
                height: '100%'
            }}>
                <div className="chat-c-list">
                    <ChatSearchBox
                        onSearch={searchValue => {
                            this.setState({
                                searchValue: searchValue
                            })
                        }}
                        setHomeState={this.props.setHomeState}
                    />

                    <ul className="chat-list">
                        {renderTempChat()}
                        {this.global.chats.map((chat,i) => {
                            if(chat.chatName.includes(this.state.searchValue)) {
                                found++;
                                return (
                                    <ChatItem
                                        key={i}
                                        id={chat.id}
                                        type={chat.type}
                                        name={chat.chatName}
                                        unreadMessages={chat.unreadMessages}
                                        latestMessage={chat.latestMessage}
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
    componentWillUnmount() {
        /*
            Listeners are removed
         */
        chatSocket.event.rm('chats loaded',this.chatsLoaded);
    }
}