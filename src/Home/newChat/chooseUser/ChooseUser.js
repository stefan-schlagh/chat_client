import React,{Component} from "react";
import {tabs} from "../NewChat";
import Dummy from "../../../utilComp/Dummy";
import SelectChat from "../../selectChat/SelectChat";
import Dropdown from 'rc-dropdown';

import 'rc-dropdown/assets/index.css';

import './chooseUser.scss';
import {requestUsersNoChat} from "../apiCalls";

const errorCode={
    none: 0,
    error: 1
};

export default class ChooseUser extends Component{

    constructor(props) {
        super(props);
        this.state = {
            error: errorCode.none,
            /*
                the value of the search input
             */
            searchValue: ''
        };
    }
    /*
        when new group gets clicked
     */
    newGroupClick = event => {
        event.stopPropagation();
        this.props.setCurrentTab(tabs.newGroup);
    };
    /*
        when join group is clicked
     */
    joinGroupClick = event => {
        event.stopPropagation();
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

        /*
            response is returned
         */
        return await requestUsersNoChat({
            search: searchValue,
            limit: 10,
            start: numAlreadyLoaded
        });
    };

    render() {

        const options = (
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
        );

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
                        <Dropdown
                            trigger={['click']}
                            overlay={options}
                            animation="slide-up"
                            alignPoint
                        >
                            <i className="fas fa-ellipsis-h fa-2x"
                               role="button"
                            />
                        </Dropdown>
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
}