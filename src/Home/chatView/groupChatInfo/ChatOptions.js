import React,{Component} from "react";
import {Link,withRouter} from "react-router-dom";

class ChatOptions extends Component {

    isSelfAdmin = () => {
        return this.props.memberSelf.isAdmin;
    };

    render() {

        const {pathname} = this.props.location;

        return(
            <ul className="chatOptions">
                {this.isSelfAdmin() ?
                    <li key={0}>
                        <Link to={pathname + "/addUsers"}>
                            Benutzer hinzufügen
                        </Link>
                    </li>
                    : null}
            </ul>
        )
    }
}

export default withRouter(ChatOptions);