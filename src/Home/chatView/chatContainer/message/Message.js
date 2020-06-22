import React,{Component} from "react";
import Colors from "../../../../util/Color";
import {globalData} from "../../../../global/globalData";

import './message.scss'

export default class Message extends Component{

    render() {

        const msg = this.props.msg;

        return(
            <div className={"p-2 border rounded " + (msg.bySelf ? "float-right " : "float-left ") + "msg-container-other msg-container"}>
                {msg.userTop ?
                    <div className="w-100">
                        <strong className="msg-container-header"><span
                            style={{
                                color: Colors.names[msg.userTop.color]
                            }}>
                            {msg.userTop.username}
                        </span>
                        </strong>
                    </div>
                : null}
                <div className="w-100 msg-container-content">
                    <p className="mb-0">
                        {msg.type === globalData.messageTypes.normalMessage ?
                            msg.content.text
                        : null
                        }
                    </p>
                </div>
                <div className="w-100 msg-date-outer">
                    <div className="msg-date">
                        {msg.mDateString}
                    </div>
                </div>
            </div>
        )
    }
}