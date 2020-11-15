import React, {Component} from "react";
import {Link} from 'react-router-dom';
import {ModalHeader, ModalMain} from "../../utilComp/Modal";
import Dummy from "../../utilComp/Dummy";
import {fetchUserInfo} from "./userInfoApiCalls";

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
            userInfo: null
        }
    }

    render() {
        if(!this.state.loaded){
            return null;

        }else if(this.state.error === errorCode.isSelf){
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
        }else if(!this.state.error.none){
            return(
                <div>Error!</div>
            )
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
                        <h2>Gruppen</h2>
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

                if (data.uidSelf === uid) {
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