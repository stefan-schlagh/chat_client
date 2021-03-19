import React from "react";
import {globalData} from "../../../../global/globalData";
import NormalMessage from "./NormalMessage";
import StatusMessage from "./StatusMessage";
import Colors from "../../../../util/Color";

import './message.scss'

export default function Message(props){

    const msg = props.msg;

    switch (msg.type) {

        case globalData.messageTypes.normalMessage: {

            return (
                <div className={"msg-container-outer"}>
                    <NormalMessage msg={msg}/>
                </div>
            )
        }

        case globalData.messageTypes.statusMessage: {

            return (
                <div className={"msg-container-outer"}>
                    <StatusMessage msg={msg}/>
                </div>
            );
        }

        default:
            return <span />;
    }
}

export function UsernameSpan(props){

    return(
        <span
            style={{
                color: Colors.names[props.user.color]
            }}>
                {props.user.username}
        </span>
    );
}