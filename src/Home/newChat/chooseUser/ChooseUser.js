import React,{Component} from "react";
import {tabs} from "../NewChat";
import Dummy from "../../../utilComp/Dummy";
import {makeRequest} from "../../../global/requests";
import SelectChat from "../../selectChat/SelectChat";

import './chooseUser.scss';

const errorCode={
    none: 0,
    error: 1
};

export default class ChooseUser extends Component{

    _clickedOutsideTimer;

    constructor(props) {
        super(props);
        this.state = {
            error: errorCode.none,
            showOptions: false,
            /*
                the value of the search input
             */
            searchValue: ''
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
    };

    loadChats = async (
        searchValue,
        numAlreadyLoaded
    ) => {

        const config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                search: searchValue,
                limit: 10,
                start: numAlreadyLoaded
            })
        };
        /*
            response is returned
         */
        return await makeRequest('/user/noChat', config);
    };

    render() {

        return(
            <Dummy>
                <div className="user-top">
                    <div className="searchUser">
                        <input type="text"
                               name="newChat-searchUser"
                               className="form-control"
                               placeholder="Benutzer suchen"
                               onChange={this.searchChanged}
                        />
                    </div>
                    <div className="user-more">
                        <i className="fas fa-ellipsis-h fa-2x"
                           onClick={this.showOptions}
                        />
                        {this.state.showOptions ?
                            <div className="options">
                                <ul>
                                    <li onClick={this.newGroupClick}>
                                        neue Gruppe
                                    </li>
                                    <li onClick={this.joinGroupClick}>
                                        einer Gruppe beitreten
                                    </li>
                                </ul>
                            </div>
                            : null
                        }
                    </div>
                </div>
                <SelectChat
                    showSearchBar={false}
                    searchValue={this.state.searchValue}
                    loadChats={this.loadChats}
                />
            </Dummy>
        );
    }
    componentDidMount() {
        document.body.addEventListener('click',this.clickedOutsideOptions);
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        //this.listNode = ReactDOM.findDOMNode(this.listRef);
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