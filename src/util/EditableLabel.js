import React,{Component} from "react";

export default class EditableLabel extends Component{

    constructor(props) {
        super(props);
        this.state = {
            isEditing: false,
            value: this.props.value
        }
    }

    render() {
        return (
            <span className={this.props.className}>
                {this.state.isEditing ?
                    <form
                        onSubmit={event => {
                            event.preventDefault();
                            this.setState({
                                isEditing: false
                            });
                            if(typeof this.props.onChange === "function")
                                this.props.onChange(this.state.value)
                        }}
                    >
                        <input
                            type="text"
                            onChange={(event) => {
                                this.setState({
                                    value: event.target.value
                                })
                            }}
                        />
                    </form>
                    :

                    <span
                        onDoubleClick={() => {
                            this.setState({
                                isEditing: true
                            });
                        }}
                    >
                        {this.props.children}
                        &nbsp;
                        <i
                            className="fas fa-pen"
                            onClick={() => {
                                this.setState({
                                    isEditing: true
                                });
                            }}
                        />
                    </span>
                }
            </span>
        )
    }
}