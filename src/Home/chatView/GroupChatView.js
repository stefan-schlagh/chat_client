import React,{Component} from "reactn";
import ChatViewLoader from "./ChatViewLoader";
import ChatContainer from "./chatContainer/ChatContainer";
import chatSocket from "../../chatData/chatSocket";
import {infoHeaderCenter} from "../Header/HeaderLeft";
import GroupChatInfo from "./groupChatInfo/GroupChatInfo";

export const groupChatErrorCode = {
    none: 0,
    nan: 1,
    chatNotExisting: 2,
    notPartOfChat: 3,
    private: 4
};

export const groupChatTabs = {
    chat: 0,
    info: 1
};

export default class GroupChatView extends Component{

    constructor(props) {
        super(props);
        this.state = {
            gcid: 0,
            loaded: false,
            error: groupChatErrorCode.none
        }
    }

    groupChatExists = async(gcid) => {
        /*
            does the chat already exist in the client
         */
        if(chatSocket.chats.group.getIndex(gcid) !== -1){
            return groupChatErrorCode.none;
        }else{
            return groupChatErrorCode.chatNotExisting;
        }
    };
    /*
        is called after the chatId changed
     */
    chatChanged = () => {
        /*
            is props.gcid a number?
         */
        if(isNaN(this.props.gcid)){
            this.setState({
                error: groupChatErrorCode.nan,
                loaded: true
            });
        }else{

            const chatExists = () => {

                const gcid = parseInt(this.props.gcid);

                this.groupChatExists(gcid)
                    .then(r => {
                        if (r === groupChatErrorCode.none) {

                            this.selectGroupChat(gcid);
                            this.setState({
                                loaded: true,
                                error: groupChatErrorCode.none,
                                gcid: gcid
                            });
                            this.setGlobal({
                                infoHeaderCenter: infoHeaderCenter.groupChat,
                                ihcData: {
                                    name: chatSocket.chats.group.get(gcid).chatName,
                                    gcid: gcid
                                }
                            }).then();
                        } else {
                            this.setState({
                                loaded: true,
                                error: r
                            });
                        }
                    })
                    .catch();
            };

            if (chatSocket.finishedLoading) {
                chatExists();
            } else {
                chatSocket.event.on('chats loaded', () => {
                    chatExists();
                });
            }
        }
    };
    /*
        groupChat is selected
     */
    selectGroupChat(gcid){
        /*
            does the chat exist?
         */
        if (chatSocket.chats.group.getIndex(gcid) === -1) {

            this.setState({
                error: groupChatErrorCode.chatNotExisting
            })
        } else {

            const chat = chatSocket.chats.group.get(gcid)
            this.dispatch.selectChat(chat);
        }
    }

    componentDidMount() {
        this.chatChanged();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        /*
            did gcid change?
         */
        if(prevProps.gcid !== this.props.gcid){
            this.chatChanged();

        }
    }

    componentWillUnmount() {
        this.setGlobal({
            infoHeaderCenter: infoHeaderCenter.none,
            ihcData: null
        }).then();
    }

    render() {
        const renderLoader = () => {
            if(!this.state.loaded){
                return(
                    <ChatViewLoader
                        msg="Chat wird geladen"
                    />
                )
            }
        };

        const renderChat = () => {
            /*
                es wird überprüft, ob uid number ist
                --> wenn nicht, ungültige Addresse
             */
            if (this.state.error === groupChatErrorCode.nan) {
                return (
                    <div>
                        <h2>ungültige Addresse</h2>
                    </div>
                );
            }
            /*
                chat wird nur gerendert, wenn geladen
             */
            else if (this.state.loaded) {

                switch(this.state.error){

                    case groupChatErrorCode.none:

                        switch(this.props.tab){
                            case(groupChatTabs.chat):
                                return (
                                    <ChatContainer
                                        chatType={this.global.currentChat.type}
                                        chatId={this.global.currentChat.id}
                                    />
                                );

                            case(groupChatTabs.info):
                                return(
                                    <GroupChatInfo
                                        gcid={this.state.gcid}
                                    />
                                );

                            default:
                                return null;
                        }

                    case groupChatErrorCode.notPartOfChat:
                        return (
                            <div>
                                <h2>Du bist nicht Mitglied in diesem chat jetzt beitreten</h2>
                            </div>
                        );

                    case groupChatErrorCode.private:
                        return (
                            <div>
                                <h2>Du bist nicht dazu berechtigt diesen chat anzusehen</h2>
                            </div>
                        );

                    case groupChatErrorCode.chatNotExisting:
                        return (
                            <div>
                                <h2>Dieser Chat existiert nicht</h2>
                            </div>
                        );

                    default:
                        return null;
                }
            }
        };

        return (
            <div className="h-100">
                {renderLoader()}
                {renderChat()}
            </div>
        );
    }
}