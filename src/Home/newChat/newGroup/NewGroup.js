import React,{Component} from "react";
import {withRouter} from "react-router-dom";
import SelectUsers from "../../selectUsers/SelectUsers";
import GroupInfoForm from "./GroupInfoForm";
import {makeRequest} from "../../../global/requests";

const tabs = {
    selectUsers: 0,
    enterChatInfo: 1
};

class NewGroup extends Component{

    constructor(props) {
        super(props);
        this.state = {
            currentTab: tabs.selectUsers,
            selectedUsers: []
        }
    }

    showEnterChatInfo = selectedUsers => {

        this.setState({
            currentTab: tabs.enterChatInfo,
            selectedUsers: selectedUsers
        });
    };

    submitGroup = data => {

        const users = new Array(this.state.selectedUsers.length);
        for(let i=0;i<this.state.selectedUsers.length;i++){
            users[i] = {
                uid: this.state.selectedUsers[i].uid,
                username: this.state.selectedUsers[i].username,
                isAdmin: false
            };
        }

        this.createGroupChat(data,users).then(r => {});
    };

    createGroupChat = async (data,users) => {
        try {
            const config = {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    data: data,
                    users: users
                })
            };
            const response = await makeRequest('/group/', config);
            /*
                if ok, modal is closed
             */
            if(response.ok)
                this.props.history.goBack();

        }catch(error){

        }
    };

    loadUsers = async (
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
        return await makeRequest('/user/', config);
    };

    render() {

        switch(this.state.currentTab){

            case tabs.selectUsers:
                return (
                    <SelectUsers
                        onNext={this.showEnterChatInfo}
                        loadUsers={this.loadUsers}
                    />
                );

            case tabs.enterChatInfo:
                return(
                    <GroupInfoForm
                        submitGroup={this.submitGroup}
                    />
                );

            default:
                return null;
        }
    }
}
export default withRouter(NewGroup);