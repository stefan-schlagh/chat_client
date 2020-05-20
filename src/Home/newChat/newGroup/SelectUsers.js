import React,{Component} from "react";
import UserList from "./UserList";
import UserItem from "./UserItem";

export default class SelectUsers extends Component{

    constructor(props) {
        super(props);
        this.state = {
            /*
                the users already selected
             */
            selectedUsers: [],
            /*
                the value of the search input
             */
            searchValue: '',
            showOnlySelected: false
        }
    }
    /*
        gets called when a user gets selected
     */
    selectUser = (uid,username) => {
        this.setState(state => ({
            selectedUsers: state.selectedUsers.concat({uid: uid,username: username})
        }));
    };

    deselectUser = (uid) => {
        this.setState(state => {
            const arrClone = [...state.selectedUsers];
            const index = arrClone.findIndex(item => {
                return item.uid === uid;
            });
            arrClone.splice(index,1);
            return {
                selectedUsers: arrClone
            }
        });
    };

    deselectIndex = index => {
        this.deselectUser(this.state.selectedUsers[index].uid);
    };

    isUserSelected = (uid) => {
        return this.state.selectedUsers.find(item => {
            return item.uid === uid;
        });
    };

    render() {

        const renderSelectedUsers = () => {
            if(this.state.selectedUsers.length === 0){
                return (
                    <h4>
                        Noch niemand ausgewählt
                    </h4>);
            }else{
                return(
                    <h4>
                        {this.state.selectedUsers.length}&nbsp;Benutzer ausgewählt
                    </h4>
                )
            }
        };

        return(
            <div className="user-results">
                <div className="select-users">
                    {renderSelectedUsers()} anzeigen:
                    <div className="user-select-btn-toggle">
                        <i className="fas fa-check fa-lg"
                           onClick={event => {
                               this.setState(state => ({
                                   showOnlySelected: !state.showOnlySelected
                               }));
                           }}
                        />
                    </div>
                </div>
                {!this.state.showOnlySelected ?
                    <UserList searchValue={this.state.searchValue}
                              selectUser={this.selectUser}
                              deselectUser={this.deselectUser}
                              isUserSelected={this.isUserSelected}
                    />
                :
                    <ul className="list-group">
                        {this.state.selectedUsers.map((item,index) => (
                            <UserItem
                                key={index}
                                index={index}
                                uid={item.uid}
                                username={item.username}
                                selectUser={() => {}}
                                deselectUser={this.deselectIndex}
                                isSelected={true}
                            />
                        ))}
                    </ul>
                }
            </div>
        )
    }
}