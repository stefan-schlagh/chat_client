import React,{Component} from "reactn";
import validate from "validate.js";
import {ErrorMsg, SuccessMsg} from "./MsgBox";
import {withRouter} from "react-router-dom";
import TogglePassword from "./TogglePassword";
import {register} from "./apiCalls";
import BackToLogin from "./BackToLogin";
import Dummy from "../utilComp/Dummy";

class Register extends Component{

    constructor(props) {
        super(props);
        this.state = {
            error: false,
            errorMessage: '',
            username: '',
            email: '',
            password: '',
            passwordRepeat: '',
            redirect: false,
            emailSet: false,
            accountCreated: false
        }
    }
    changeHandler = event => {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({[nam]: val});
    };
    submitHandler = event => {
        event.preventDefault();
        /*
            constraints für validation
         */
        const  valConstraints = {
            username: {
                presence: true,
                length: {
                    minimum: 3,
                    tooShort: 'Benutzername zu kurz',
                    maximum: 30,
                    tooLong: 'Benutzername zu lang'
                },
                format: {
                    pattern: new RegExp(/^\w[\w ]*$$/),
                    message: 'ungültiges Format'
                }
            },
            password: {
                presence: true,
                length: {
                    minimum: 8,
                    tooShort: 'Passwort muss mindestens 8 Zeichen lang sein',
                    maximum: 50,
                    tooLong: 'Passwort darf höchstens 50 Zeichen lang sein'
                }
            },
            passwordRepeat: {
                presence: true,
                equality: "password",
                length: {
                    minimum: 8,
                    tooShort: 'Passwort muss mindestens 8 Zeichen lang sein',
                    maximum: 50,
                    tooLong: 'Passwort darf höchstens 50 Zeichen lang sein'
                }
            }
        };
        /*
            validate
         */
        const valResult = validate({
            username: this.state.username,
            password: this.state.password,
            passwordRepeat: this.state.passwordRepeat
        },valConstraints);

        if(typeof(valResult) != "undefined"){

            let errorMessage;

            if(typeof(valResult.username) != "undefined") {
                errorMessage = valResult.username[0];
            }else if(typeof(valResult.password) != "undefined") {
                errorMessage = valResult.password[0];
            }else if(typeof(valResult.passwordRepeat)!="undefined") {
                errorMessage = "Passwörter stimmen nicht überein!"
            }
            errorMessage = errorMessage.replace("Username ","").replace("Password ","");

            this.setState({
                error: true,
                errorMessage: errorMessage
            });

        }else {
            this.setState({
                error: false,
                errorMessage: ''
            });
            /*
                request to server
             */
            register(this.state.username,this.state.password,this.state.email)
                .then(async response => {
                    if(response.status === 200){

                        const data = await response.json();
                        // if username taken --> show error message
                        if(data.usernameTaken){
                            this.setState({
                                error: true,
                                errorMessage: 'Benutzername bereits vergeben'
                            });
                        }else{
                            await this.dispatch.setUserSelf(data.uid,this.state.username);
                            // set auth tokens
                            await this.dispatch.setAuthTokens(data.tokens);
                            // account created
                            this.setState({
                                accountCreated: true,
                                emailSet: this.state.email !== ''
                            })
                        }
                    }else {
                        this.setState({
                            error: true,
                            errorMessage: 'ein Fehler ist aufgetreten'
                        });
                    }
                })
                .catch(err => {
                    this.setState({
                        error: true,
                        errorMessage: 'ein Fehler ist aufgetreten'
                    });
                });
        }
    };
    goToChatHome = () => {
        // go to chat home
        this.props.history.push('/chat');
    }
    errorMessage = () => {
        if(this.state.error)
            return (
                <ErrorMsg>
                    {this.state.errorMessage}
                </ErrorMsg>
            )
    };

    render(){

        return (
            <div className="h-100" style={{display: "flex"}}>
                <div className="col-sm-12 my-auto">
                    <div className="container border rounded p-3" style={{maxWidth: "800px"}}>
                        <BackToLogin/>
                        {!this.state.accountCreated ?
                            <Dummy>
                                <h1>Registrieren</h1>
                                {this.errorMessage()}
                                <form onSubmit={this.submitHandler}>
                                    <div className="form-group">
                                        <label htmlFor="username">Benutzername: *</label>
                                        <input type="text"
                                               name="username"
                                               className="form-control"
                                               placeholder="Benutzernamen eingeben"
                                               onChange={this.changeHandler}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email">E-Mail Addresse: (nicht verpflichtend)</label>
                                        <input type="email"
                                               name="email"
                                               className="form-control"
                                               placeholder="E-Mail Addresse eingeben"
                                               onChange={this.changeHandler}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="password">Passwort: *</label>
                                        <TogglePassword
                                               name="password"
                                               className="form-control"
                                               placeholder="Passwort eingeben"
                                               onChange={this.changeHandler}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="passwordRepeat">Passwort wiederholen: *</label>
                                        <TogglePassword
                                            name="passwordRepeat"
                                            className="form-control"
                                            placeholder="Passwort eingeben"
                                            onChange={this.changeHandler}
                                        />
                                    </div>
                                    <input type="submit" className="btn btn-primary" value="Registrieren"/>
                                </form>
                            </Dummy>
                            :
                            <Dummy>
                                <SuccessMsg>
                                    Benutzer {this.state.username} wurde erfolgreich angelegt
                                    {this.state.emailSet ?
                                        <Dummy>
                                            <br/>
                                            E-Mail mit Verifizierungslink wurde versendet!
                                        </Dummy>
                                        : null
                                    }
                                </SuccessMsg>
                                <button
                                    className="btn btn-primary"
                                    onClick={this.goToChatHome}
                                >
                                    weiter
                                </button>
                            </Dummy>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Register);