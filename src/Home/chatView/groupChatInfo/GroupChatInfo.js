import React,{Component} from "react";
import ChatViewLoader from "../ChatViewLoader";
import {Link,withRouter} from 'react-router-dom';
import chatSocket from "../../../chatData/chatSocket";

import'./groupChatInfo.scss';

class GroupChatInfo extends Component{

    constructor(props) {
        super(props);
        this.state = {
            error: false,
            loaded: false,
            data: null
        }
    }

    componentDidMount() {
        this.loadChatInfo();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        /*
            did gcid change?
         */
        if(prevProps.gcid !== this.props.gcid)
            this.loadChatInfo();
    }

    loadChatInfo = () => {

        const loadChatInfoI = async() =>{

            const config = {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            };
            const response = await fetch('/group/' + this.props.gcid + '/',config);

            if(response.ok){

                let data = await response.json();

                this.setState({
                    data: data
                });
            }
        };

        loadChatInfoI()
            .then(r => {
                this.setState({
                    loaded: true,
                    error: false
                })
            })
            .catch(err => {
                this.setState({
                    loaded: true,
                    error: true
                })
            });
    };

    render() {

        const {pathname} = this.props.location;

        if(this.state.error)
            return(
                <div className="alert alert-danger" role="alert">
                    Ein Fehler ist aufgetreten!
                </div>
            );
        else if(!this.state.loaded)
            return (
                <ChatViewLoader msg = "info wird geladen"/>
            );
        const uidSelf = chatSocket.userSelf.uid;
        return(
            <div className="groupChatInfo">
                <h1>{this.state.data.name}</h1>
                <h4>{this.state.data.users.length} Mitglieder:</h4>
                <ul className="userList">
                    {this.state.data.users.map((item,index) => (
                        <li key={index}>
                            <Link to={pathname + "/userInfo/" + item.uid}>
                                {uidSelf === item.uid ?
                                    <span>Du</span>
                                :
                                    item.username
                                }
                                {item.isAdmin === 1 ?
                                    <div className="user-admin">
                                        Admin
                                    </div>
                                : null}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}
export default withRouter(GroupChatInfo);