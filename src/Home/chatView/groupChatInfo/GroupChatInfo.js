import React,{Component} from "react";
import {withRouter} from 'react-router-dom';
import chatSocket from "../../../chatData/chatSocket";
import Dropdown from "rc-dropdown/es";
import UserOptions from "./UserOptions";
import ChatOptions from "./ChatOptions";
import AddUsersModal from "./AddUsersModal";

import'./groupChatInfo.scss';

/*
    TODO groupchatinfo change socket events
 */
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
        const uidSelf = chatSocket.userSelf.uid;

        return(
            <div className="groupChatInfo">
                <div className="chatName">
                    <h1>
                        {this.props.data.chatName}
                    </h1>
                    {this.props.data.memberSelf.isAdmin ?
                        <i className="fas fa-edit fa-lg edit"/>
                        : null
                    }
                </div>
                <div className="description">
                    {this.props.data.description}
                    {this.props.data.memberSelf.isAdmin ?
                        <i className="fas fa-edit edit"/>
                        : null
                    }
                </div>
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