import React,{Component} from "react";
import Responsive from "../../responsive/Responsive";
import chatSocket from "../../chatData/chatSocket";
import {Link} from "react-router-dom";

export default class HeaderLeft extends Component{

    render() {

        const renderBtnBack = () => {
            if(this.props.showBtnBack) {
                return (
                    <Responsive displayIn={["Mobile"]}>
                        <div className="float-left top-left">
                            <i id="btnBackToChatList" className="fas fa-arrow-left fa-2x d-block d-md-none"/>
                        </div>
                    </Responsive>
                );
            }
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
                if (this.props.showChatInfo) {
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
                {renderBtnBack()}
                {renderChatInfo()}
            </div>
        )
    }
}