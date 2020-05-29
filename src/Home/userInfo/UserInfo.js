import React,{Component} from "react";
import {Link} from 'react-router-dom';
import chatSocket from "../../chatData/chatSocket";

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
                <div className="modal-header-b">
                    <h1>
                        Du
                    </h1>
                </div>
            )
        }else{
            return(
                <div>
                    <div className="modal-header-b">
                        <h1>
                            {this.state.userInfo.username}
                            &nbsp;
                            <Link to={"/chat/user/" + this.state.uid}>
                                <i className="far fa-comment-alt" />
                            </Link>
                        </h1>
                    </div>
                    <h2>Gruppen</h2>
                </div>
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
        const response = await fetch('/user/' + uid, config);
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