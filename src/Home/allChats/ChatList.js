import React,{Component} from "react";
import ChatSearchBox from "./ChatSearchBox";
import ChatItem from "./ChatItem";
import chatSocket from "../../chatData/chatSocket";

export default class ChatList extends Component{

    constructor(props) {
        super(props);
        this.state = {
            //a array with all chats
            chats: [],
            //the current searchValue at the chatlist
            searchValue: '',
            //should the tempChat be shown?
            showTempChat: false,
            tempChatName: ''
        };
    }

    chatItemToTop = index => {
        const chatsClone = this.state.chats.splice(0);
        const item = chatsClone[index];
        chatsClone.splice(index,1);
        chatsClone.unshift(item);
        this.setState({
            chats: chatsClone
        });
    };
    /*
        gets emitted if a new chat gets loaded
     */
    newChat = chat => {
        /*
            chat object gets created
         */
        const chatObj = {
            type: chat.type,
            id: chat.id,
            chatName: chat.chatName,
            lastMessage: {
                date: chat.date
            }
        };
        /*
            this is concatenated with the Array
         */
        this.setState(state => ({
            chats: [chatObj].concat(state.chats)
        }));
    };

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
        this.setState({
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
        chatSocket.event.on('new chat',this.newChat);
        /*
            chats get initialized
            is loading of chats already finished?
                --> chatArray gets requested immediately
         */
        if(chatSocket.finishedLoading){
            this.setState({
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
                <div className="chat-container m-2">
                    <ChatSearchBox
                        onSearch={searchValue => {
                            this.setState({
                                searchValue: searchValue
                            })
                        }}
                        setHomeState={this.props.setHomeState}
                    />

                    <ul className="chat-list list-group pb-5" style={{height: 'calc (100% - 80px'}}>
                        {renderTempChat()}
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
                                        toTop={this.chatItemToTop}
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
        chatSocket.event.rm('new chat',this.newChat);
        chatSocket.event.rm('chats loaded',this.chatsLoaded);
    }
}