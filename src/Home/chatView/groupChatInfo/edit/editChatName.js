import React,{Component} from "react";
import {makeRequest} from "../../../../global/requests";
import EditableLabel from "../../../../utilComp/EditableLabel";

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
            <EditableLabel
                className={"chatName"}
                value={this.props.chatName}
                onChange={this.onSubmit}
            />
        )
    }
}