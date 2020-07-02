import React,{Component} from "react";
import {Link,withRouter} from "react-router-dom";
import Dummy from "../../../utilComp/Dummy";
import {makeRequest} from "../../../global/requests";

class ChatOptions extends Component {

    isSelfAdmin = () => {
        return this.props.memberSelf.isAdmin;
    };

    leaveChat = async () => {

        const config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json'
            }
        };

        const response =
            await makeRequest(
                '/group/' + this.props.gcid + '/leave',
                config
            );

        if(response.ok) {

            const data = await response.json();

            if(data.error){
                console.log(data.error);
            }
        }
    };

    removeSelfAdmin = async () => {

        const config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json'
            }
        };

        const response =
            await makeRequest(
                '/group/' + this.props.gcid + '/removeAdmin',
                config
            );

        if(response.ok) {

            const data = await response.json();

            if(data.error){
                console.log(data.error);
            }
        }
    };

    render() {

        const {pathname} = this.props.location;

        return(
            <ul className="chatOptions">
                {this.isSelfAdmin() ?
                    <Dummy>
                        <li key={0}>
                            <Link to={pathname + "/addUsers"}>
                                Benutzer hinzufügen
                            </Link>
                        </li>
                        <li
                            key={1}
                            className="noLink"
                            onClick={this.removeSelfAdmin}
                        >
                            admin status entfernen
                        </li>
                    </Dummy>
                    : null}
                <li
                    key={2}
                    className="noLink"
                    onClick={this.leaveChat}
                >
                    Chat verlassen
                </li>
            </ul>
        )
    }
}

export default withRouter(ChatOptions);