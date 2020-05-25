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
    /*
        an Array with the uids of the users gets returned to the parent component
     */
    btnNextClicked = event => {

        this.props.onNext(this.state.selectedUsers);
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
                    <h4 className="w-100">
                        <span className={"selected-num" + (this.state.showOnlySelected ? " selected" : "")}
                              onClick={event => {
                                  this.setState(state => ({
                                      showOnlySelected: !state.showOnlySelected
                                  }));
                              }}
                        >
                            {this.state.selectedUsers.length}&nbsp;Benutzer
                        </span>
                        &nbsp;ausgewählt
                        <i className="fas fa-arrow-right fa-lg float-right btn-next"
                           onClick={this.btnNextClicked}
                        />
                    </h4>
                )
            }
        };
        /*
            selected users cannot be shown if there is no one selected.
                --> showOnlySelected = false
         */
        if(this.state.selectedUsers.length === 0 && this.state.showOnlySelected)
            this.setState({
                showOnlySelected: false
            });

        return(
            <div className="user-results">
                <div className="select-users">
                    {renderSelectedUsers()}
                </div>
                {!this.state.showOnlySelected ?
                    <UserList selectUser={this.selectUser}
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