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
            searchValue: '',
            //should the tempChat be shown?
            showTempChat: false,
            tempChatName: ''
        };
    }

    tempChatShown = () => {

        const chat = chatSocket.temporaryChat.chatNow;

        this.setState({
            showTempChat: true ,
            tempChatName: chat.chatName
        });
    };

    tempChatUpdated = () => {

        const chat = chatSocket.temporaryChat.chatNow;

        this.setState({
            showTempChat: true ,
            tempChatName: chat.chatName
        });
    };

    tempChatHidden = () => {

        this.setState({
            showTempChat: false ,
            tempChatName: ''
        });
    };

    chatsLoaded = chats => {
        this.setGlobal({
            chats: chats
        });
    };

    componentDidMount() {
        /*
            is a tempChat already shown?
         */
        if(chatSocket.temporaryChat.isShown)
            this.setState({
                showTempChat: true
            });
        /*
            Listeners are attached
         */
        chatSocket.event.on("tempChat shown",this.tempChatShown);
        chatSocket.event.on("tempChat updated",this.tempChatUpdated);
        chatSocket.event.on("tempChat hidden",this.tempChatHidden);
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
            if(this.state.showTempChat){
                return(
                    <ChatItem
                        key={-1}
                        _key_={-1}
                        id={0}
                        type={'tempChat'}
                        name={this.state.tempChatName}
                        toTop={() => {}}
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
        chatSocket.event.rm("tempChat shown",this.tempChatShown);
        chatSocket.event.rm("tempChat updated",this.tempChatUpdated);
        chatSocket.event.rm("tempChat hidden",this.tempChatHidden);
        chatSocket.event.rm('chats loaded',this.chatsLoaded);
    }
}