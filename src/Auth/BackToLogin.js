import React from "react";
import {Link} from "react-router-dom";

import "./BackToLogin.scss";

export default function BackToLogin(){
    return(
        <h5 className={"back-to-login"}>
            <Link to={"/login"}>
                <i className="fas fa-arrow-left"/>
                &nbsp;
                zurück zu login
            </Link>
        </h5>
    )
}