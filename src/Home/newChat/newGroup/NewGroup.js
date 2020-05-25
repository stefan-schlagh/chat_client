import React,{Component} from "react";
import SelectUsers from "./SelectUsers";
import GroupInfoForm from "./GroupInfoForm";

const tabs = {
    selectUsers: 0,
    enterChatInfo: 1
};

export default class NewGroup extends Component{

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
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    data: data,
                    users: users
                })
            };
            const response = await fetch('/createGroupChat', config);

            console.log(response.ok);

        }catch(error){

        }
    };

    render() {

        switch(this.state.currentTab){

            case tabs.selectUsers:
                return (
                    <SelectUsers
                        onNext={this.showEnterChatInfo}
                    />);

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