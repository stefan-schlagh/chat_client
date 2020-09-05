import React,{Component} from "react";
import {ModalHeader, ModalMain} from "../../utilComp/Modal";
import Dummy from "../../utilComp/Dummy";
import {Link} from "react-router-dom";

import "./Settings.scss";

export default class Settings extends Component{
    render() {
        return(
            <Dummy>
                <ModalHeader>
                    <h1>Einstellungen</h1>
                </ModalHeader>
                <ModalMain>
                    <div className={"settings"}>
                        to be implemented
                        <div className={"about"}>
                            <Link to={"/about"}>über diese Seite</Link>
                        </div>
                    </div>
                </ModalMain>
            </Dummy>
        )
    }
}