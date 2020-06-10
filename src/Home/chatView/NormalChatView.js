import React, {Component} from "reactn";
import chatSocket from "../../chatData/chatSocket";
import ChatViewLoader from "./ChatViewLoader";
import ChatContainer from "./ChatContainer";
import TempChatContainer from "./TempChatContainer";
import {infoHeaderCenter} from "../Header/HeaderLeft";
import {UserErrorCode,getUserNormalChat} from "../../chatData/User";

export default class NormalChatView extends Component{

    constructor(props) {
        super(props);
        this.state = {
            uid: 0,
            loaded: false,
            error: UserErrorCode.none
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
            if(this.state.error === UserErrorCode.nan){
                return(
                    <div>
                        <h2>ungültige Addresse</h2>
                    </div>
                );
            }
            else if(this.state.error === UserErrorCode.isSelf){
                return(
                    <div>
                        <h2>Du kannst dir selbst nicht schreiben</h2>
                    </div>
                );
            }
            /*
                chat wird nur gerendert, wenn geladen
             */
            else if(this.state.loaded){

                if(this.state.error === UserErrorCode.none){

                    return(
                        <ChatContainer
                            chatType={this.global.currentChat.type}
                            chatId={this.global.currentChat.id}
                        />
                    )
                }else if(this.state.error === UserErrorCode.tempChat){
                    return(
                        <TempChatContainer />
                    )
                }else if(this.state.error === UserErrorCode.blocked){
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
                    error: UserErrorCode.nan
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

        /*
            is the user self?
         */
        if(chatSocket.userSelf.uid === uid){
            this.setState({
                error: UserErrorCode.isSelf,
                loaded: true
            });
        }else {

            const userExists = () => {

                getUserNormalChat(uid)
                    .then(res => {
                        /*
                            no error
                                checks if existing or tempChat
                         */
                        if (res === UserErrorCode.none) {
                            this.setState({
                                error: res
                            });
                            this.setGlobal({
                                infoHeaderCenter: infoHeaderCenter.normalChat,
                                ihcData: {
                                    name: chatSocket.users.get(uid).username,
                                    uid: uid
                                }
                            }).then();
                            /*
                                normalChat is selected
                             */
                            this.selectNormalChat(uid);
                            /*
                                tempChat
                             */
                        } else if (res === UserErrorCode.tempChat) {
                            this.setState({
                                error: res
                            });
                            this.setGlobal({
                                infoHeaderCenter: infoHeaderCenter.normalChat,
                                ihcData: {
                                    name: chatSocket.temporaryChat.chatNow.chatName,
                                    uid: uid
                                }
                            }).then();
                            /*
                                the temporary chat is selected
                             */
                            this.selectTempChat();
                        }
                        /*
                            some error has occured, state is set
                         */
                        else{
                           this.setState({
                               error: UserErrorCode.error
                           })
                        }
                        this.setState({
                            loaded: true
                        });

                    })
                    .catch(err => this.setState({
                        error: UserErrorCode.error
                    }));
            };

            if (chatSocket.finishedLoading) {
                userExists();
            } else {
                chatSocket.event.on('chats loaded', () => {
                    userExists();
                });
            }

            this.setState({
                uid: parseInt(this.props.uid)
            });
        }
    };
    /*
        the tempChat is selected
     */
    selectTempChat(){
        this.dispatch.showTempChat();
    }
    /*
        a normalCHat is selected
     */
    selectNormalChat(uid){
        /*
            does the user exist?
         */
        if (chatSocket.users.getIndex(uid) === -1) {

            this.setState({
                error: UserErrorCode.userNotExisting
            });
        }else {
            /*
                chat is pulled from chatSocket
             */
            const id = chatSocket.users.get(uid).normalChat;
            const chat = chatSocket.getChat('normalChat', id);

            this.dispatch.selectChat(chat);
        }
    }
    /*
        property- display normalChat is removed from global
     */
    componentWillUnmount() {
        this.setGlobal({
            infoHeaderCenter: infoHeaderCenter.none,
            ihcData: null
        }).then();
    }

}