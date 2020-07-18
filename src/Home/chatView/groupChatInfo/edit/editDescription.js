import React,{Component} from "react";
import Edit from "./inlineEdit";
import {makeRequest} from "../../../../global/requests";

export default class DescriptionEdit extends Component{

    onSubmit = async value => {
        const config = {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                description: value
            })
        };

        await makeRequest(
            "/group/" + this.props.gcid + "/description",
            config
        );
    };

    render () {
        return (
            <Edit
                class={"description"}
                name={"editDescription"}
                value={this.props.description}
                onSubmit={this.onSubmit}
            />
        )
    }
}