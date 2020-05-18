import React,{Component,setGlobal} from "reactn";
import Responsive from "../../responsive/Responsive";
import {Link,withRouter} from "react-router-dom";

export const infoHeaderCenter = {
    none: 0,
    normalChat: 1
};

setGlobal({
    infoHeaderCenter: infoHeaderCenter.none,
    data: null
}).then();

class HeaderLeft extends Component{

    render() {

        const {pathname} = this.props.location;
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
             */
            return (
                <div className="float-left top-left">
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
            if(this.global.infoHeaderCenter === infoHeaderCenter.normalChat){

                return (
                    <div id="chat-info" className="chat-info float-left top-center pt-2">
                        <h3 id="chat-info-name">
                            {this.global.data.name}
                        </h3>
                        <Link to={pathname + "/userInfo/" + this.global.data.uid}>
                            <i className="fas fa-info-circle fa-2x"
                               data-toggle="tooltip"
                               title="chat info"
                            />
                        </Link>
                    </div>
                );
            }
            return(
                <Responsive displayIn={["Laptop","Tablet"]}>
                    <h3 className="pt-2 pl-2">chat</h3>
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
export default withRouter(HeaderLeft);