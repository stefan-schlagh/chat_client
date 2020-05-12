import React,{Component} from "react";
import {tabs} from "../NewChat";

export default class ChooseUser extends Component{

    _clickedOutsideTimer;

    constructor(props) {
        super(props);
        this.state = {
            showOptions: false
        };
    }
    /*
        options get shown
     */
    showOptions = event => {
        clearTimeout(this.clickedOutsideTimer);
        this.setState({
            showOptions: true
        });
    };
    /*
        options get hidden
     */
    clickedOutsideOptions = () => {
        this.clickedOutsideTimer = setTimeout(this.hideOptions,100);
    };
    hideOptions = () => {
        this.setState({
            showOptions: false
        });
    };
    /*
        when new group gets clicked
     */
    newGroupClick = event => {
        clearTimeout(this.clickedOutsideTimer);
        this.props.setCurrentTab(tabs.newGroup);
    };
    /*
        when join group is clicked
     */
    joinGroupClick = event => {
        clearTimeout(this.clickedOutsideTimer);
        this.props.setCurrentTab(tabs.chooseGroup);
    };

    render() {
        /*
            if state.showOptions is true, options get rendered
         */
        const renderOptions = () => {
            if(this.state.showOptions)
                return(
                    <div className="options">
                        <ul className="list-group">
                            <li className="list-group-item"
                                onClick={this.newGroupClick}
                            >
                                neue Gruppe
                            </li>
                            <li className="list-group-item"
                                onClick={this.joinGroupClick}
                            >
                                einer Gruppe beitreten
                            </li>
                        </ul>
                    </div>
                );
            return null;
        };

        return(
            <div className="modal-main">
                <div className="newChat-user-top">
                    <div className="newChat-searchUser">
                        <label htmlFor="newChat-searchUser"
                               className="d-none d-md-block">
                            <h4>Benutzer suchen</h4>
                        </label>
                        <input type="text"
                               name="newChat-searchUser"
                               className="form-control"
                               placeholder="Benutzer suchen"
                        />
                    </div>
                    <div className="newChat-user-more">
                        <i className="fas fa-ellipsis-h fa-2x"
                           onClick={this.showOptions}
                        />
                        {renderOptions()}
                    </div>
                </div>
            </div>
        );
    }
    componentDidMount() {
        document.body.addEventListener('click',this.clickedOutsideOptions);
    }
    componentWillUnmount() {
        clearTimeout(this.clickedOutsideTimer);
        document.body.removeEventListener('click',this.clickedOutsideOptions);
    }

    get clickedOutsideTimer() {
        return this._clickedOutsideTimer;
    }

    set clickedOutsideTimer(value) {
        this._clickedOutsideTimer = value;
    }
}