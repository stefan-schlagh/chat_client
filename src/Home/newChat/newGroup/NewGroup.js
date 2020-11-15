import React,{Component} from "react";
import {withRouter} from "react-router-dom";
import SelectUsers from "../../selectUsers/SelectUsers";
import GroupInfoForm from "./GroupInfoForm";
import {createGroupChat, fetchUsers} from "../apiCalls";

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
            const response = await createGroupChat({
                data: data,
                users: users
            });
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
        /*
            response is returned
         */
        return await fetchUsers({
            search: searchValue,
            limit: 10,
            start: numAlreadyLoaded
        })
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