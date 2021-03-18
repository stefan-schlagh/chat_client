import React,{Component} from "react";
import Dummy from "../../../utilComp/Dummy";
import SelectChat from "../../selectChat/SelectChat";
import 'rc-dropdown/assets/index.css';
import {fetchPublicGroups} from "../apiCalls";
import ChatItem from "./ChatItem";

import './chooseGroup.scss';

const errorCode={
    none: 0,
    error: 1
};

export default class ChooseGroup extends Component{

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
        return await fetchPublicGroups({
            search: searchValue,
            limit: 10,
            start: numAlreadyLoaded,
            isNotPart: true
        });
    };

    render() {

        return(
            <Dummy>
                <div className="chooseGroup-top">
                    <div className="searchGroup">
                        <input type="text"
                               name="newChat-searchGroup"
                               className="form-control"
                               placeholder="Gruppe suchen"
                               onChange={this.searchChanged}
                        />
                    </div>
                </div>
                <SelectChat
                    showSearchBar={false}
                    searchValue={this.state.searchValue}
                    loadChats={this.loadChats}
                    renderItem={(item,index) => (
                        <ChatItem
                            key={index}
                            id={item.id}
                            name={item.name}
                        />
                    )}
                />
            </Dummy>
        );
    }
}