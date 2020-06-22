import React from "react";
import Dummy from "../../../../utilComp/Dummy";
import {UsernameSpan} from "./Message";
import {statusMessages} from "../../../../chatData/message/statusMessage";

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
    /*
        Du hast
        userxy hat
     */
    const renderStatusMsg = (
        otherUsers,
        s2 = ""
    ) => {
        const passiveUsers = msg.content.passiveUsers;
        return(
            <span>
                <UsernameSpan user={msg.userTop}/>
                {msg.bySelf ? " hast " : " hat "}
                {passiveUsers.length > 0
                    ? (passiveUsers.length + " Benutzer ")
                    : ""
                }
                {s2}
            </span>
        )
    };

    return(
        <Dummy>
            {renderStatusMsg(
                msg.content.passiveUsers,
                statusMessages[msg.content.type]
            )}
        </Dummy>
    );
}