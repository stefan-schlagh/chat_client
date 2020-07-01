import React,{Component} from "react";
import {withRouter} from 'react-router-dom';
import chatSocket from "../../../chatData/chatSocket";
import Dropdown from "rc-dropdown/es";
import UserOptions from "./UserOptions";
import ChatOptions from "./ChatOptions";
import AddUsersModal from "./AddUsersModal";

import'./groupChatInfo.scss';

class GroupChatInfo extends Component{

    constructor(props) {
        super(props);
        this.state = {
            error: false,
            data: null
        }
    }

    render() {

        if(this.state.error)
            return(
                <div className="alert alert-danger" role="alert">
                    Ein Fehler ist aufgetreten!
                </div>
            );
        /*else if(!this.state.loaded)
            return (
                <ChatViewLoader msg = "info wird geladen"/>
            );*/
        const uidSelf = chatSocket.userSelf.uid;

        return(
            <div className="groupChatInfo">
                <div>
                    <h1>
                        {this.props.data.chatName}
                    </h1>
                    {this.props.data.memberSelf.isAdmin ?
                        <i className="fas fa-edit fa-lg edit-chatName"/>
                        : null
                    }
                    <Dropdown
                        trigger={['click']}
                        overlay={
                            <ChatOptions
                                gcid={this.props.gcid}
                                memberSelf={this.props.data.memberSelf}
                            />
                        }
                        >
                        <i
                            className="fas fa-ellipsis-v fa-lg chat-options-btn fa-2x"
                            role="button"
                        />
                    </Dropdown>
                </div>
                <h4>
                    {this.props.data.members.length}
                    &nbsp;Mitglieder:
                </h4>
                <ul className="userList">
                    {this.props.data.members.map((item,index) => (
                        <li key={index}>
                            <div className="userItem">
                            {uidSelf === item.uid ?
                                <span>Du</span>
                            :
                                item.username
                            }
                            <div className="right">
                                {item.isAdmin ?
                                    <span className="user-admin">
                                        Admin&nbsp;&nbsp;
                                    </span>
                                : null}
                                <Dropdown
                                    trigger={['click']}
                                    overlay={
                                        <UserOptions
                                            gcid={this.props.gcid}
                                            memberSelf={this.props.data.memberSelf}
                                            member={item}
                                        />
                                    }
                                    animation="slide-up"
                                    alignPoint
                                >
                                    <i
                                        className="fas fa-ellipsis-v fa-lg"
                                        role="button"
                                    />
                                </Dropdown>
                            </div>
                            </div>
                        </li>
                    ))}
                </ul>
                <AddUsersModal
                    gcid={this.props.gcid}
                />
            </div>
        );
    }
}
export default withRouter(GroupChatInfo);