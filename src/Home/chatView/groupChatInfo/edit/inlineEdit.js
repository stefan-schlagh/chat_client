import React,{Component} from "react";
import InlineEdit from 'react-ions/lib/components/InlineEdit'

export default class Edit extends Component{

    constructor(props) {
        super(props);
        this.state = {
            isEditing: false,
            value: this.props.value
        }
    }

    handleEdit = async event => {

        const value = event.target.value;

        this.setState({
            isEditing: false,
            value: value
        });

        await this.props.onSubmit(value);
    };

    editPressed = () => {
        this.setState({
            isEditing: true
        });
    };

    render () {
        return (
            <div className={this.props.class}>
                <InlineEdit
                    name={this.props.name}
                    value={this.state.value}
                    isEditing={this.state.isEditing}
                    changeCallback={this.handleEdit}
                    optClass={"input"}
                />
                <i
                    className="fas fa-edit edit"
                    onClick={this.editPressed}
                />
            </div>
        )
    }
}