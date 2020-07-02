import React,{Component} from "react";
import {Link} from 'react-router-dom';
import chatSocket from "../../chatData/chatSocket";
import {ModalHeader,ModalMain} from "../../utilComp/Modal";
import Dummy from "../../utilComp/Dummy";
import {makeRequest} from "../../global/requests";

const errorCode = {
    none: 0,
    isSelf: 1,
    //not a number
    nan: 2
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

    setUser = () => {

        if(isNaN(this.props.uid)){
            this.setState({
                error: errorCode.nan
            });
        }else if(chatSocket.userSelf.uid === parseInt(this.props.uid)){
            this.setState({
                error: errorCode.isSelf,
                loaded: true
            });
        }else{
            const uid = parseInt(this.props.uid);
            this.setState({
                uid: uid,
                error: errorCode.none,
                loaded: false
            });
            this.fetchUser(uid)
                .then()
                .catch();
        }
    };
    /*
        userInfo gets fetched from server
     */
    async fetchUser (uid) {

        const config = {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        };
        const response = await makeRequest('/user/' + uid, config);
        //const json = await response.json()
        if (response.ok) {
            //return json
            let data = await response.json();

            this.setState({
                userInfo: data,
                loaded: true
            });

            return data;
        } else {
            return null;
        }
    }

    componentDidMount() {
        this.setUser();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        /*
            check if uid changed
         */
        if(prevProps.uid !== this.props.uid){
            this.setUser();
        }
    }

    componentWillUnmount() {

    }


}