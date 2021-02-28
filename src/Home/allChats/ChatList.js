import React,{Component} from "reactn";
import ChatSearchBox from "./ChatSearchBox";
import ChatItem from "./ChatItem";
import Dummy from "../../utilComp/Dummy";

import './chatList.scss';

export default class ChatList extends Component{

    constructor(props) {
        super(props);
        this.state = {
            //the current searchValue at the chatlist
            searchValue: ''
        };
    }

    render() {

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
                <Dummy>
                    <ChatSearchBox
                        onSearch={searchValue => {
                            this.setState({
                                searchValue: searchValue
                            })
                        }}
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
                                        isStillMember={chat.isStillMember}
                                    />
                                );
                            }
                            return null;
                        })}
                    </ul>
                    {showNothingFoundMsg()}
                </Dummy>
        )
    }
}