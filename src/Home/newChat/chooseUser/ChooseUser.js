import React,{Component} from "react";
import {tabs} from "../NewChat";
import chatSocket from "../../../chatData/chatSocket";
import UserItem from "./UserItem";

export default class ChooseUser extends Component{

    _clickedOutsideTimer;

    constructor(props) {
        super(props);
        this.state = {
            showOptions: false,
            /*
                the value of the search input
             */
            searchValue: '',
            /*
                is the search valid?
             */
            searchValid: true,
            /*
                the last search result received from the server
             */
            searchResult: []
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
    /*
        gets called when the search of the user changed. the new result gets requested
     */
    searchChanged = event => {
        const searchValue = event.target.value;

        const searchValid = true;

        this.setState({
            searchValue: searchValue,
            searchValid: searchValid
        });
        /*
            new search result gets requested if search is valid
         */
        if(searchValid)
            this.requestSearchResult(searchValue);
    };
    /*
        the search result gets requested
     */
    requestSearchResult = searchValue => {
        chatSocket.socket.emit("getUsers-noChat",{
            search: searchValue,
            limit: 10
        });
    };
    /*
        gets called when the search result is received
     */
    searchResultReceived = data => {
        this.setState({
            searchResult: data
        });
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
        /*
            results only get rendered if search was valid
         */
        const renderResult = () => {
            if(this.state.searchValid) {
                if(this.state.searchResult.length > 0) {
                    return (
                        <div className="user-results">
                            <h5>Ergebnisse:</h5>
                            <ul className="list-user">
                                {this.state.searchResult.map((item, index) => (
                                    <UserItem
                                        key={index}
                                        uid={item.uid}
                                        username={item.username}
                                        hide={this.props.hide}
                                    />
                                ))}
                            </ul>
                        </div>
                    );
                }else{
                    return(
                        <div className="user-results">
                            <ul className="list-user">
                                <div className="alert alert-warning" role="alert">
                                    Nichts gefunden!
                                </div>
                            </ul>
                        </div>
                    )
                }
            }else{
                return(
                    <div className="user-results">
                        <div className="alert alert-danger" role="alert">
                            Ihre Suche enthält ungültige Zeichen!
                        </div>
                    </div>
                )
            }
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
                               onChange={this.searchChanged}
                        />
                    </div>
                    <div className="newChat-user-more">
                        <i className="fas fa-ellipsis-h fa-2x"
                           onClick={this.showOptions}
                        />
                        {renderOptions()}
                    </div>
                </div>
                {renderResult()}
            </div>
        );
    }
    componentDidMount() {
        document.body.addEventListener('click',this.clickedOutsideOptions);
        /*
            event listener for search result is added
         */
        chatSocket.event.on('users-noChat',this.searchResultReceived);
        this.requestSearchResult('');
    }
    componentWillUnmount() {
        clearTimeout(this.clickedOutsideTimer);
        document.body.removeEventListener('click',this.clickedOutsideOptions);
        /*
            event listener for search result is removed
         */
        chatSocket.event.rm('users-noChat',this.searchResultReceived);
    }

    get clickedOutsideTimer() {
        return this._clickedOutsideTimer;
    }

    set clickedOutsideTimer(value) {
        this._clickedOutsideTimer = value;
    }
}