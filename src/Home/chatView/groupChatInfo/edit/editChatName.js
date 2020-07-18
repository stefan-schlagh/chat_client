import React,{Component} from "react";
import Edit from "./inlineEdit";
import {makeRequest} from "../../../../global/requests";

export default class ChatNameEdit extends Component{

    onSubmit = async value => {
        const config = {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chatName: value
            })
        };

        await makeRequest(
            "/group/" + this.props.gcid + "/chatName",
            config
        );
    };

    render () {
        return (
            <Edit
                class={"chatName"}
                name={"editChatName"}
                value={this.props.chatName}
                onSubmit={this.onSubmit}
            />
        )
    }
}