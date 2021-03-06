import React,{Component} from "reactn";
import Responsive from "../../responsive/Responsive";
import {Link,withRouter} from "react-router-dom";
import Dummy from "../../utilComp/Dummy";

import "./headerLeft.scss";

export const infoHeaderCenter = {
    none: 0,
    normalChat: 1,
    groupChat: 2
};

class HeaderLeft extends Component{

    render() {

        const {pathname} = this.props.location;
        /*
            renders number of new messages
         */
        const renderNewMsgNumber = () => {
            if(this.global.newMessages > 0){
                return (
                    <div className="btnBack-number">
                        {this.global.newMessages}
                    </div>
                )
            }
            return null;
        };

        const renderBtnBack = () => {
            /*
                only small screens
             */
            return (
                <div className="float-left left">
                    <i id="btnBackToChatList"
                       className="fas fa-arrow-left fa-2x d-block d-md-none"
                       onClick={() => {this.props.history.goBack()}}
                    />
                    {renderNewMsgNumber()}
                </div>
            );
        };

        const renderChatInfo = () => {
            /*
                if there is a normal chat open, this info gets displayed
             */
            switch(this.global.infoHeaderCenter){

                case infoHeaderCenter.normalChat:
                    return (
                        <HeaderCenter>
                            <h3 id="chat-info-name">
                                {this.global.ihcData.name}
                            </h3>
                            <Link to={pathname + "/userInfo/" + this.global.ihcData.uid}>
                                <i className="fas fa-info-circle fa-2x"
                                   data-toggle="tooltip"
                                   title="chat info"
                                />
                            </Link>
                        </HeaderCenter>
                    );

                case infoHeaderCenter.groupChat:
                    return(
                        <HeaderCenter>
                            <h3 id="chat-info-name">
                                {this.global.ihcData.name}
                            </h3>
                            <Link to={"/chat/groupInfo/" + this.global.ihcData.gcid}>
                                <i className="fas fa-info-circle fa-2x"
                                   data-toggle="tooltip"
                                   title="chat info"
                                />
                            </Link>
                        </HeaderCenter>
                    );

                default:
                    return(
                        <Responsive displayIn={["Laptop","Tablet"]}>
                            <h3 className="pt-2 pl-2">chat</h3>
                        </Responsive>
                    );
            }
        };

        return(
            <Dummy>
                <Responsive displayIn={["Mobile"]}>
                    {renderBtnBack()}
                </Responsive>
                {renderChatInfo()}
            </Dummy>
        )
    }
}
export default withRouter(HeaderLeft);

function HeaderCenter(props){
    return(
        <div id="chat-info" className="center pt-2">
            {props.children}
        </div>
    )
}