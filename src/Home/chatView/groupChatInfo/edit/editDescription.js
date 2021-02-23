import React,{Component} from "react";
import {makeRequest} from "../../../../global/requests";
import EditableLabel from "../../../../util/EditableLabel";

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
            <EditableLabel
                className={"description"}
                value={this.props.description}
                onChange={this.onSubmit}
            />
        )
    }
}