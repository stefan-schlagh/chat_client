import React,{Component} from "react";

import './groupInfoForm.scss';
import placeholder from '../../../img/placeholder.png';

export default class GroupInfoForm extends Component{

    constructor(props) {
        super(props);
        this.state={
            groupName: '',
            description: '',
            isPublic: false
        }
    }

    groupNameChanged = event => {
        this.setState({
            groupName: event.target.value
        })
    };

    descriptionChanged = event => {
        this.setState({
            description: event.target.value
        })
    };

    isPublicChanged = () => {
        this.setState(state => ({
           isPublic: !state.isPublic
        }));
    };

    formSubmitted = event => {

        event.preventDefault();

        if(this.state.groupName !== '')
            this.props.submitGroup({
                name: this.state.groupName,
                description: this.state.description,
                isPublic: this.state.isPublic
            });
    };

    render() {

        return(
            <div className="groupInfoForm">
                <form onSubmit={this.formSubmitted}>
                    <img
                        style={{
                            display: 'none'
                        }}
                        id="groupImgInput1"
                        src={placeholder}
                        alt="Placeholder"
                    />
                    <div className="form-group">
                        <label htmlFor="exampleFormControlInput1">
                            Gruppenname
                        </label>
                        <input type="text"
                               name="groupName"
                               className="form-control"
                               id="input-groupName"
                               placeholder="Gruppenname"
                               value={this.state.name}
                               onChange={this.groupNameChanged}
                               minLength={1}
                        />
                    </div>
                    <div className="form-group">
                        <label
                            htmlFor="description1"
                        >
                            Beschreibung
                        </label>
                        <textarea
                            className="form-control"
                            id="description1"
                            rows="3"
                            value={this.state.description}
                            onChange={this.descriptionChanged}
                        />
                    </div>
                    <div className="form-group">
                        <label className="check-container">
                            öffentlicher chat
                            <input
                                type="checkbox"
                                checked={this.state.isPublic}
                                onChange={this.isPublicChanged}
                            />
                            <span className="checkmark">
                                <i className="fas fa-check" />
                            </span>
                        </label>
                    </div>
                    <div className="form-group">
                        <button
                            type="submit"
                            className="float-right btn btn-primary m-3"
                        >
                            Gruppe erstellen
                        </button>
                    </div>
                </form>
            </div>
        )
    }
}