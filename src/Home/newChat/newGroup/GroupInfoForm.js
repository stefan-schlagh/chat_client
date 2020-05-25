import React,{Component} from "react";

export default class GroupInfoForm extends Component{

    constructor(props) {
        super(props);
        this.state={
            groupName: ''
        }
    }

    groupNameChanged = event => {
        this.setState({
            groupName: event.target.value
        })
    };

    formSubmitted = event => {

        event.preventDefault();
        this.props.submitGroup({
            name: this.state.groupName,
            description: '',
            isPublic: false
        });
    };

    render() {
        return(
            <div className="user-results">
                <form className="form-group p-3"
                      onSubmit={this.formSubmitted}
                >
                    <h4>
                        Gruppennamen eingeben
                    </h4>
                    <input
                        type="text"
                        id="input-groupName"
                        name="groupName"
                        className="form-control"
                        placeholder="Gruppenname"
                        onChange={this.groupNameChanged}
                    />
                    <div>
                        <button type="submit" className="float-right btn btn-primary m-3">
                            Gruppe erstellen
                        </button>
                    </div>
                </form>
            </div>
        )
    }
}