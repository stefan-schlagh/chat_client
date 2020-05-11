import React,{Component} from "react";
import Responsive from "../../responsive/Responsive";
import chatSocket from "../../chatData/chatSocket";
import {Link} from "react-router-dom";
import {routes} from "../Home";

export default class HeaderLeft extends Component{

    render() {
        /*
            renders number of new messages
         */
        const renderNewMsgNumber = () => {
            if(this.props.newMessages > 0){
                return (
                    <div className="btnBack-number">
                        {this.props.newMessages}
                    </div>
                )
            }
            return null;
        };

        const renderBtnBack = () => {
            /*
                only small screens
                    if a modal is open, it gets closed by this button
             */
            if(this.props.modalOpen){
                return(
                    <div className="float-left top-left">
                        <i id="btnBackToChatList"
                           className="fas fa-arrow-left fa-2x d-block d-md-none"
                           onClick={() => {this.props.closeModal()}}
                        />
                        {renderNewMsgNumber()}
                    </div>
                );
            }
            else if(this.props.currentRoute === routes.normalChat)
                return (
                    <div className="float-left top-left">
                        <Link to={"/chat"}>
                            <i id="btnBackToChatList" className="fas fa-arrow-left fa-2x d-block d-md-none"/>
                        </Link>
                        {renderNewMsgNumber()}
                    </div>
                );
        };

        const getChatName = () => {
            // es wird nach chat gesucht
            const chat = chatSocket.getChat(this.props.currentChat.type,this.props.currentChat.id);
            //wenn undefined, wird default test returned
            if(chat === undefined)
                return 'Socket.IO';
            else
                return chat.chatName;
        };

        const renderButtonChatInfo = () => {
            // es wird nach chat gesucht
            const chat = chatSocket.getChat(this.props.currentChat.type,this.props.currentChat.id);
            //wenn undefined, wird null returned
            if(chat === undefined)
                return null;
            else
                if(chat.type === 'normalChat'){
                    const userInfoClicked = event => {
                        this.props.showUserInfo(chat.otherUser);
                    };
                    //userinfo wird gezeigt
                    return(
                        <i className="fas fa-info-circle fa-2x"
                           data-toggle="tooltip"
                           title="chat info"
                           onClick={userInfoClicked}
                        />
                    );
                }else{
                    //Link auf chatInfo
                    return(
                        <Link to={"/chat/" + chat.id + "/info"}>
                            <i className="fas fa-info-circle fa-2x"
                               data-toggle="tooltip"
                               title="chat info"
                            />
                        </Link>
                    );
                }
        };

        const renderChatInfo = () => {
            if(!this.props.modalOpen) {
                if (this.props.currentRoute === routes.allChats) {
                    return (
                        <h3 className="pt-2 pl-2">
                            Socket.IO
                        </h3>
                    );
                }else {
                    return (
                        <div id="chat-info" className="chat-info float-left top-center pt-2">
                            <h3 id="chat-info-name">
                                {getChatName()}
                            </h3>
                            {renderButtonChatInfo()}
                        </div>
                    );
                }
            }

            return(
                <Responsive displayIn={["Laptop","Tablet"]}>
                    <h3 className="pt-2 pl-2">Socket.IO chat</h3>
                </Responsive>
            );
        };

        return(
            <div>
                <Responsive displayIn={["Mobile"]}>
                    {renderBtnBack()}
                </Responsive>
                {renderChatInfo()}
            </div>
        )
    }
}