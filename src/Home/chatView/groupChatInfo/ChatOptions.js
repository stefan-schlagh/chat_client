import React from "react";
import {Link,useLocation} from "react-router-dom";
import Dummy from "../../../utilComp/Dummy";
import {leaveChat, removeSelfAdmin} from "./apiCalls";

export default function ChatOptions(props) {

    const {pathname} = useLocation();

    const isSelfAdmin = () => {
        return props.memberSelf.isAdmin;
    };

    return(
        <ul className="chatOptions">
            {isSelfAdmin() ?
                <Dummy>
                    <li key={0} className="addUsers">
                        <Link to={pathname + "/addUsers"}>
                            Benutzer hinzufügen
                        </Link>
                    </li>
                    <li
                        key={1}
                        className="removeSelfAdmin noLink"
                        onClick={() => {
                            removeSelfAdmin(props.gcid)
                                .then(() => {})
                                .catch(err => {console.log(err)})
                        }}
                    >
                        admin status entfernen
                    </li>
                </Dummy>
                : null}
            <li
                key={2}
                className="leaveChat noLink"
                onClick={() => {
                    leaveChat(props.gcid)
                        .then(() => {})
                        .catch(err => {console.log(err)})
                }}
            >
                Chat verlassen
            </li>
        </ul>
    )
}