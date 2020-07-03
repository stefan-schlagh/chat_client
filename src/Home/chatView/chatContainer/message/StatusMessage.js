import React from "react";
import Dummy from "../../../../utilComp/Dummy";
import {getStatusMessageString} from "../../../../chatData/message/statusMessage";

export default function StatusMessage(props){

    const msg = props.msg;

    return(
        <div className={
            (msg.bySelf ? "self " : "other ") +
            "msg-container"
        }>
            <StatusMsgContent msg={msg}/>
            <div className="date-outer">
                <div className="date">
                    {msg.mDateString}
                </div>
            </div>
        </div>
    );
}
function StatusMsgContent(props) {

    const msg = props.msg;

    return(
        <Dummy>
            {getStatusMessageString(msg,true)}
        </Dummy>
    );
}