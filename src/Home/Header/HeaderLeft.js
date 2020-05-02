import React,{Component} from "react";
import Responsive from "../../responsive/Responsive";

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

        const renderChatInfo = () => {
            if(!this.props.modalOpen) {
                if (this.props.showChatInfo) {
                    return (
                        <div id="chat-info" className="chat-info float-left top-center pt-2">
                            <h3 id="chat-info-name">
                                {this.props.chatname}
                            </h3>
                            <i className="fas fa-info-circle fa-2x"
                               data-toggle="tooltip"
                               title="chat info"
                            />
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