import React, {Component} from "react";
import {Link} from 'react-router-dom';
import {ModalHeader, ModalMain} from "../../utilComp/Modal";
import Dummy from "../../utilComp/Dummy";
import {fetchUserInfo} from "./userInfoApiCalls";
import chatSocket from "../../chatData/chatSocket";
import Dropdown from "rc-dropdown";
import UserOptions from "./UserOptions";

import './userInfo.scss'

export const errorCode = {
    none: 0,
    isSelf: 1,
    //not a number
    nan: 2,
    notExisting: 3,
    defaultError: 4
};

export default class UserInfo extends Component{

    constructor(props) {
        super(props);
        this.state = {
            uid: 0,
            loaded: false,
            error: errorCode.none,
            // the loaded data
            userInfo: null
        }
    }

    render() {
        /*
            if not already loaded, show nothing
         */
        if(!this.state.loaded){
            return null;
        }
        /*
            if the user self is requested
         */
        else if(this.state.error === errorCode.isSelf){
            return(
                <Dummy>
                    <ModalHeader>
                        <h1>
                            Du
                        </h1>
                    </ModalHeader>
                    <ModalMain>
                        xx
                    </ModalMain>
                </Dummy>
            )
        /*
            if there is a error, show a generic error message
         */
        }else if(this.state.error !== errorCode.none){
            return(
                <div>Error!</div>
            )
        /*
            no error, show the userInfo
         */
        }else{
            return(
                <Dummy>
                    <ModalHeader>
                        <h1>
                            {this.state.userInfo.username}
                            &nbsp;
                            <Link to={"/chat/user/" + this.state.uid}>
                                <i className="far fa-comment-alt" />
                            </Link>
                            &nbsp;&nbsp;
                            <Dropdown
                                trigger={['hover','click']}
                                overlay={
                                    <UserOptions
                                        uid={this.state.uid}
                                        userInfo={this.state.userInfo}
                                        onBlockedBySelfChanged={blockedBySelf => {
                                            this.setState(state => ({
                                                userInfo: {
                                                    ...state.userInfo,
                                                    blockedBySelf: blockedBySelf
                                                }
                                            }))
                                            this.updateChat();
                                        }}
                                    />
                                }
                            >
                                <i
                                    className="fas fa-ellipsis-v user-options-btn "
                                    role="button"
                                />
                            </Dropdown>
                        </h1>
                    </ModalHeader>
                    <ModalMain>
                        <div className="userInfo">
                            {this.state.userInfo.blockedByOther ?
                                <div className={"error"}>
                                    Du wurdest von {this.state.userInfo.username} blockiert
                                </div>
                                :
                                null
                            }
                            {this.state.userInfo.blockedBySelf ?
                                <div className={"error"}>
                                    Du hast {this.state.userInfo.username} blockiert
                                </div>
                                :
                                null
                            }
                            {!this.isBlocked() ?
                                this.state.userInfo.groups.length > 0 ?
                                    <Dummy>
                                        <h3>{this.state.userInfo.groups.length} gemeinsame Gruppen:</h3>
                                        <ul className={"groupList"}>
                                            {this.state.userInfo.groups.map((item,index) => (
                                                <li key={index}>
                                                    <Link to={"/chat/group/" + item.id}>
                                                        {item.chatName}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </Dummy>
                                    :
                                    <h3>
                                        keine gemeinsamen Gruppen
                                    </h3>
                            :
                                null}
                        </div>
                    </ModalMain>
                </Dummy>
            )
        }
    }

    isBlocked = () => {
        return this.state.userInfo.blockedBySelf || this.state.userInfo.blockedByOther;
    }

    updateChat = () => {
        // update the chat in global
        if(chatSocket.users.getIndex(this.state.uid) !== -1)
            chatSocket.users.get(this.state.uid).updateChatBlockInfo(this.state.userInfo);
    }

    setUser = async() => {

        if(isNaN(this.props.uid)){
            this.setState({
                error: errorCode.nan
            });
        }else{
            const uid = parseInt(this.props.uid);
            this.setState({
                uid: uid,
                error: errorCode.none,
                loaded: false
            });
            try {
                const data = await fetchUserInfo(uid)
                const uidSelf = chatSocket.userSelf.uid;

                if (uidSelf === uid) {
                    this.setState({
                        error: errorCode.isSelf,
                        loaded: true
                    });
                }else if(!data.userExists){
                    this.setState({
                        error: errorCode.notExisting,
                        loaded: true
                    });
                }else {
                    this.setState({
                        userInfo: data,
                        loaded: true
                    });
                }
            }catch(err){
                this.setState({
                    error: errorCode.defaultError,
                    loaded: true
                });
            }
        }
    };

    async componentDidMount() {
        try {
            await this.setUser();
        }catch(err){
            this.setState({
                error: 4,
                loaded: true
            });
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        try{
            /*
                check if uid changed
             */
            if(prevProps.uid !== this.props.uid){
                await this.setUser();
            }
        }catch(err){
            this.setState({
                error: 4,
                loaded: true
            });
        }
    }
}