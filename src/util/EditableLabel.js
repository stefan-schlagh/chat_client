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
                            className="fas fa-check fa-lg"
                            onClick={this.submitEdit}
                        />
                        &nbsp;
                        <i
                            className="fas fa-times fa-lg"
                            onClick={this.cancelEdit}
                        />
                    </form>
                    :

                    <span
                        onDoubleClick={this.startEdit}
                    >
                        {this.props.children}
                        &nbsp;
                        <i
                            className="fas fa-pen"
                            onClick={this.startEdit}
                        />
                    </span>
                }
            </span>
        )
    }
}