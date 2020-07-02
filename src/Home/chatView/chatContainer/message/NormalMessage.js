import React from "react";
import {UsernameSpan} from "./Message";

export default function NormalMessage(props){

    const msg = props.msg;

    return(
        <div className={
            (msg.bySelf ? "self " : "other ") +
            "msg-container"
        }>
            {msg.userTop ?
                <div className="w-100">
                    <strong className="header">
                        <UsernameSpan user={msg.userTop}/>
                    </strong>
                </div>
                : null}
            <div className="content">
                <p>
                    {msg.content.text}
                </p>
            </div>
            <div className="date-outer">
                <div className="date">
                    {msg.mDateString}
                </div>
            </div>
        </div>
    )
}