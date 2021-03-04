import React, {Component} from "react";
import {Link} from 'react-router-dom';
import {ModalHeader, ModalMain} from "../../utilComp/Modal";
import Dummy from "../../utilComp/Dummy";
import {fetchUserInfo} from "./userInfoApiCalls";
import chatSocket from "../../chatData/chatSocket";

import './userInfo.scss'

export const errorCode = {
    none: 0,
    isSelf: 1,
    //not a number
    nan: 2,
    notExisting: 3,
    blocked: 4,
    defaultError: 5
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
                        </h1>
                    </ModalHeader>
                    <ModalMain>
                        <div className="userInfo">
                            {this.state.userInfo.groups.length > 0 ?
                                <Dummy>
                                    <h3>gemeinsame Gruppen:</h3>
                                    <ul className={"groupList"}>
                                        {this.state.userInfo.groups.map((item,index) => (
                                            <li key={index}>
                                                <Link to={"/chat/groupInfo/" + item.id}>
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
                            }
                        </div>
                    </ModalMain>
                </Dummy>
            )
        }
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
                }else if(data.blocked){
                    this.setState({
                        error: errorCode.blocked,
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