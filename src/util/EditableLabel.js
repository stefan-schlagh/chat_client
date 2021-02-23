import React,{Component} from "react";
import "./EditableLabel.scss";

export default class EditableLabel extends Component{

    constructor(props) {
        super(props);
        this.state = {
            isEditing: false,
            value: this.props.value
        }
    }

    startEdit = () => {
        this.setState({
            isEditing: true
        });
    }

    cancelEdit = () => {
        this.setState({
            isEditing: false,
            value: this.props.value
        });
    }

    submitEdit = event => {
        event.preventDefault();
        this.setState({
            isEditing: false
        });
        // did really something change?
        if(this.props.value !== this.state.value)
            if(typeof this.props.onChange === "function")
                this.props.onChange(this.state.value)
    }

    render() {
        return (
            <span className={"label-edit " + this.props.className}>
                {this.state.isEditing ?
                    <form
                        onSubmit={this.submitEdit}
                    >
                        <input
                            type="text"
                            value={this.state.value}
                            style={{width: this.state.value.length + "ch"}}
                            onChange={(event) => {
                                this.setState({
                                    value: event.target.value
                                })
                            }}
                        />
                        &nbsp;
                        <i
                            className="fas fa-check fa-lg edit-submit"
                            onClick={this.submitEdit}
                        />
                        &nbsp;
                        <i
                            className="fas fa-times fa-lg edit-cancel"
                            onClick={this.cancelEdit}
                        />
                    </form>
                    :

                    <span
                        onDoubleClick={this.startEdit}
                        className={"value-noEdit"}
                    >
                        {this.props.children != null ?
                            this.props.children
                            :
                            this.state.value
                        }
                        &nbsp;
                        <i
                            className="fas fa-pen edit-start"
                            onClick={this.startEdit}
                        />
                    </span>
                }
            </span>
        )
    }
}