import React,{Component} from "react";
import {ModalHeader, ModalMain} from "../../utilComp/Modal";
import Dummy from "../../utilComp/Dummy";
import {Link} from "react-router-dom";

import "./Settings.scss";
import {getUserSelf, setEmail} from "./apiCalls";
import EditableLabel from "../../util/EditableLabel";

export default class Settings extends Component{

    constructor(props) {
        super(props);
        this.state  = {
            userDataSelf: null,
            loaded: false,
            error: false,
            isEditing: false,
            emailChangeRequested: false
        }
    }

    changeEmail = value => {
        setEmail({
            email: value
        }).then(response => {
            if(response.status === 200) {
                this.setState({
                    emailChangeRequested: true
                })
            }
        }).catch(err => {
            console.log(err);
        });
    }

    render() {
        console.log('render');
        if(this.state.loaded)
            console.log(this.state.userDataSelf.email);
        return(
            <Dummy>
                <ModalHeader>
                    <h1>Einstellungen</h1>
                </ModalHeader>
                <ModalMain>
                    {this.state.loaded ?
                        <div className={"settings"}>
                            <span className="settings-header">
                                E-Mail Addresse: <br/>
                            </span>
                            <EditableLabel
                                className = "email"
                                value = {this.state.userDataSelf.email}
                                onChange = {value => {
                                    this.changeEmail(value);
                                }}
                            >
                                {this.state.userDataSelf.email === '' ?
                                    <Dummy>
                                        Noch keine E-Mail Addresse!
                                    </Dummy>
                                    :
                                    <Dummy>
                                        {this.state.userDataSelf.email}
                                    </Dummy>
                                }
                            </EditableLabel>
                            {this.state.emailChangeRequested ?
                                <Dummy>
                                    &nbsp;
                                    <span className="emailChanged">Mail mit Verifizierungslink wurde versendet!</span>
                                </Dummy>
                                :
                                null
                            }
                            <div className={"settings-about"}>
                                <Link to={"/about"}>über diese Seite</Link>
                            </div>
                        </div>
                    : (!this.state.error ?
                        <span>
                            loading...
                        </span>
                    : <span>
                            error
                    </span>)}
                </ModalMain>
            </Dummy>
        )
    }

    async componentDidMount() {
        try {
            const userDataSelf = await getUserSelf();
            this.setState({
                loaded: true,
                userDataSelf: userDataSelf
            })
        }catch (e) {
            this.setState({error: true})
        }
    }
}