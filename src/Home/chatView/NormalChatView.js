import React,{Component} from "reactn";
import chatSocket from "../../chatData/chatSocket";
import ChatViewLoader from "./ChatViewLoader";
import ChatContainer from "./ChatContainer";
import TempChatContainer from "./TempChatContainer";
import {infoHeaderCenter} from "../Header/HeaderLeft";

const errorCode = {
    none: 0,
    nan: 1,
    tempChat: 2,
    userNotExisting: 3,
    blocked: 4
};

export class NormalChatView extends Component{

    constructor(props) {
        super(props);
        this.state = {
            uid: 0,
            loaded: false,
            error: errorCode.none
        }
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
            if(this.state.error === errorCode.nan){
                return(
                    <div>
                        <h2>ungültige Addresse</h2>
                    </div>
                );
            }
            /*
                chat wird nur gerendert, wenn geladen
             */
            if(this.state.loaded){

                if(this.state.error === errorCode.none){

                    return(
                        <ChatContainer
                            uid={this.state.uid}
                            chatType={chatSocket.currentChat.type}
                            chatId={chatSocket.currentChat.id}
                        />
                    )
                }else if(this.state.error === errorCode.tempChat){
                    return(
                        <TempChatContainer />
                    )
                }else if(this.state.error === errorCode.blocked){
                    return(
                        <div>
                            <h2>Dieser User hat dich blockiert</h2>
                        </div>
                    )
                }else{
                    return(
                        <div>
                            <h2>Dieser User existiert nicht</h2>
                        </div>
                    )
                }
            }
        };

        return <div className="h-100">
            {renderLoader()}
            {renderChat()}
        </div>;
    }

    componentDidMount() {
        this.userChanged();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        /*
            did uid change?
         */
        if(prevProps.uid !== this.props.uid){
            /*
                is props.uid a number?
             */
            if(isNaN(this.props.uid)){
                this.setState({
                    error: errorCode.nan
                });
            }
            else{
                this.userChanged();
            }

        }
    }
    /*
        is called when the user changed and when the component mounted
            this is checked after each update
     */
    userChanged = () => {

        const uid = parseInt(this.props.uid);

        const userExists = () => {
            chatSocket.userExists(uid)
                .then(res => {
                    /*
                        if there was an error, the error code gets set
                     */
                    if(!res.userExists){
                        this.setState({
                            error: errorCode.userNotExisting
                        });
                    }else if(res.isUserBlocked){
                        this.setState({
                            error: errorCode.blocked
                        });
                    }else{
                        /*
                            no error
                                checks if existing or tempChat
                         */
                        if(res.chatExists) {
                            this.setState({
                                error: errorCode.none
                            });
                            this.setGlobal({
                                infoHeaderCenter: infoHeaderCenter.normalChat,
                                data: {
                                    name: chatSocket.users.get(uid).username,
                                    uid: uid
                                }
                            }).then();
                            setCurrentChat(false);
                        }else {
                            this.setState({
                                error: errorCode.tempChat
                            });
                            this.setGlobal({
                                infoHeaderCenter: infoHeaderCenter.normalChat,
                                data: {
                                    name: chatSocket.temporaryChat.chatNow.chatName,
                                    uid: uid
                                }
                            }).then();
                            setCurrentChat(true);
                        }
                    }
                    this.setState({
                        loaded: true
                    });
                });
        };

        const setCurrentChat = tempChat => {
            /*
                is the chat a tempchat?
             */
            if(tempChat){
                chatSocket.setCurrentChat({
                    type: 'tempChat',
                    id: 0
                });
            }
            /*
                currentChat in chatSocket gets updated
                if the chat does not exist, id is -1
            */
            else if(chatSocket.users.getIndex(uid) === -1){
                /*
                    current chat gets set to null -> no chat selected
                 */
                chatSocket.setCurrentChat(null);
            }else {
                chatSocket.setCurrentChat({
                    type: 'normalChat',
                    id: chatSocket.users.get(uid).normalChat
                });
            }
        };

        if(chatSocket.finishedLoading){
            userExists();
        }else{
            chatSocket.event.on('chats loaded',() => {
                userExists();
            });
        }

        this.setState({
            uid: parseInt(this.props.uid)
        });
    };
    /*
        property- display normalChat is removed from global
     */
    componentWillUnmount() {
        this.setGlobal({
            infoHeaderCenter: infoHeaderCenter.none,
            data: null
        }).then();
    }

}

export function GroupChatView (props){

}

export function GroupChatInfoView (props){

}