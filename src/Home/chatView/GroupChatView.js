import React,{Component} from "reactn";
import ChatViewLoader from "./ChatViewLoader";
import ChatContainer from "./chatContainer/ChatContainer";
import chatSocket from "../../chatData/chatSocket";
import {infoHeaderCenter} from "../Header/HeaderLeft";
import ModalRouterGroupChatInfo from "./groupChatInfo/ModalRouterGroupChatInfo";
import {
    AddressNotValid,
    ChatNotExisting,
    NoAuthorization,
    NoMemberInPublicChat,
    GeneralError
} from "./chatViewErrorMessages";
import {makeRequest} from "../../global/requests";

export const groupChatErrorCode = {
    none: 0,
    nan: 1,
    chatNotExisting: 2,
    notPartOfChat: 3,
    private: 4,
    general: 5
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
            chatData: null,
            error: groupChatErrorCode.none
        }
    }

    loadGroupChatInfo = async(gcid) => {

        try {
            const config = {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            };
            const response = await makeRequest('/group/' + this.props.gcid + '/', config);

            if(response.status === 403)
                return groupChatErrorCode.private;

            else if(response.status === 404)
                return groupChatErrorCode.chatNotExisting;

            else if (response.ok) {

                let data = await response.json();

                this.setState({
                    chatData: data
                });

                if(data.error) {

                    if (data.error === 'not part of chat')
                        return groupChatErrorCode.notPartOfChat;

                    else
                        return groupChatErrorCode.general

                }else if(chatSocket.chats.group.getIndex(gcid) !== -1){

                    return groupChatErrorCode.none;
                }
            }
            else {
                return groupChatErrorCode.general
            }
        } catch (err) {
            return groupChatErrorCode.general
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

                this.loadGroupChatInfo(gcid)
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
                    <AddressNotValid/>
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
                                    <ModalRouterGroupChatInfo
                                        gcid={this.state.gcid}
                                        data={this.state.chatData}
                                    />
                                );

                            default:
                                return null;
                        }

                    case groupChatErrorCode.notPartOfChat:
                        return (
                            <NoMemberInPublicChat/>
                        );

                    case groupChatErrorCode.private:
                        return (
                            <NoAuthorization/>
                        );

                    case groupChatErrorCode.chatNotExisting:
                        return (
                            <ChatNotExisting/>
                        );

                    case groupChatErrorCode.general:
                        return(
                            <GeneralError/>
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