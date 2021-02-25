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
            emailChangeRequested: false,
            setEmailError: false,
            setEmailErrorMessage: ''
        }
    }

    changeEmail = value => {
        //did the mail address change?
        if(this.state.userDataSelf.email !== value)
            setEmail({
                email: value
            }).then(async response => {
                if(response.status === 200) {
                    const data = await response.json();
                    // check email taken
                    if(data.emailTaken){
                        this.setState({
                            emailChangeRequested: false,
                            setEmailError: true,
                            setEmailErrorMessage: 'E-Mail wird bereits verwendet!'
                        });
                    }else{
                        this.setState({
                            setEmailError: false,
                            emailChangeRequested: true
                        });
                    }
                }else {
                    this.setState({
                        setEmailError: true,
                        setEmailErrorMessage: 'Fehler beim Versenden der E-Mail!',
                        emailChangeRequested: false
                    })
                }
            }).catch(err => {
                this.setState({
                    setEmailError: true,
                    setEmailErrorMessage: 'Fehler beim Versenden der E-Mail!',
                    emailChangeRequested: false
                })
            });
    }

    render() {
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
                                onChange = {this.changeEmail}
                            >
                                {this.state.userDataSelf.email === '' ?
                                    "Noch keine E-Mail Addresse!"
                                    :
                                    this.state.userDataSelf.email
                                }
                            </EditableLabel>
                            {this.state.emailChangeRequested ?
                                <Dummy>
                                    &nbsp;
                                    <span className="emailChanged">E-Mail mit Verifizierungslink wurde versendet!</span>
                                </Dummy>
                                :
                                null
                            }
                            {this.state.setEmailError ?
                                <Dummy>
                                    &nbsp;
                                    <span className="set-email-error">
                                        {this.state.setEmailErrorMessage}
                                    </span>
                                </Dummy>
                                :
                                null
                            }
                            <div className={"settings-about"}>
                                <Link to={"/about"}>über diese Seite</Link>
                            </div>
                        </div>
                    : (!this.state.error ?
                        <span className="loading">
                            laden...
                        </span>
                    : <span className="error">
                                ein Fehler ist aufgetreten!
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