import React,{Component} from "react";
import chatSocket from "../../chatData/chatSocket";
import Colors from "../../util/Color";

export default class Message extends Component{

    render() {

        const msg = this.props.msg;

        const isMsgBySelf = () => {
            return msg.uid === chatSocket.userSelf.uid;
        };

        const user = isMsgBySelf() ? chatSocket.userSelf : chatSocket.users.get(msg.uid);

        return(
            <div className={"p-2 border rounded " + (isMsgBySelf() ? "float-right " : "float-left ") + "msg-container-other msg-container"}>
                <div className="w-100">
                    <strong className="msg-container-header"><span
                        style={{
                            color: Colors.names[user.color]
                        }}>
                        {//wenn msg von user selbst ist, wird "Du" angezeigt
                            isMsgBySelf() ? "Du" : user.username}
                    </span>
                    </strong>
                </div>
                <div className="w-100 msg-container-content">
                    <p className="mb-0">
                        {msg.content}
                    </p>
                </div>
                <div className="w-100 msg-date-outer">
                    <div className="msg-date">
                        {msg.getMessageViewDateString()}
                    </div>
                </div>
            </div>
        )
    }
}