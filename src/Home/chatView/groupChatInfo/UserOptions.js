import React,{Component} from "reactn";
import {Link, withRouter} from "react-router-dom";
import Dummy from "../../../utilComp/Dummy";
import {makeRequest} from "../../../global/requests";

class UserOptions extends Component {

    isSelfAdmin = () => {
        return this.props.memberSelf.isAdmin;
    };

    isMemberSelf(){
        return this.props.member.uid === this.global.userSelf.uid;
    };

    removeMemberFromChat = async () => {
        if(this.isSelfAdmin()) {

            const config = {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json'
                }
            };

            const response =
                await makeRequest(
                    '/group/' + this.props.gcid + '/member/' + this.props.member.uid,
                    config
                );
        }
    };

    makeMemberAdmin = async () => {
        if(this.isSelfAdmin()) {

            const config = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json'
                }
            };

            const response =
                await makeRequest(
                    '/group/' + this.props.gcid + '/member/' + this.props.member.uid + '/giveAdmin',
                    config
                );

        }
    };

    removeMemberAdmin = async () => {
        if(this.isSelfAdmin()) {

            const config = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json'
                }
            };

            const response =
                await makeRequest(
                    '/group/' + this.props.gcid + '/member/' + this.props.member.uid + '/removeAdmin',
                    config
                );
        }
    };

    render(){

        const {pathname} = this.props.location;

        return (
            <ul className="userOptions">
                <li key={0}>
                    <Link to={pathname + "/userInfo/" + this.props.member.uid}>
                        zeige {this.props.member.username} an
                    </Link>
                </li>
                <li key={1}>
                    <Link to={"/chat/user/" + this.props.member.uid}>
                        Nachricht an {this.props.member.username}
                    </Link>
                </li>
                {/*
                    if the member is admin, he has more options
                    */
                    this.isSelfAdmin() && ! this.isMemberSelf() ?
                        <Dummy>
                            <li
                                key={2}
                                className="noLink"
                                onClick={this.removeMemberFromChat}
                            >
                                aus chat entfernen
                            </li>
                            {this.props.member.isAdmin ?
                                <li
                                    key={3}
                                    className="noLink"
                                    onClick={this.removeMemberAdmin}
                                >
                                    admin status entfernen
                                </li>
                                :
                                <li
                                    key={4}
                                    className="noLink"
                                    onClick={this.makeMemberAdmin}
                                >
                                    zu admin machen
                                </li>
                            }
                        </Dummy>
                        : null
                }
            </ul>
        )
    }
}

export default withRouter(UserOptions);