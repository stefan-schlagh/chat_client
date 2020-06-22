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
                <NormalMessage msg={msg}/>
            )
        }

        case globalData.messageTypes.statusMessage: {

            return (
                <StatusMessage msg={msg}/>
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