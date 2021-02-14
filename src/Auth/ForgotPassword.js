import React,{Component} from "reactn";
import {requestPasswordResetLink} from "./apiCalls";
import {ErrorMsg, SuccessMsg} from "./MsgBox";
import validate from "validate.js";
import BackToLogin from "./BackToLogin";

export default class ForgotPassword extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: false,
            errorMessage: '',
            username: '',
            email: '',
            sentMail: false
        };
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
                    tooShort: 'Benutzername zu kurz'
                }
            },
            email: {
                presence: true,
                length: {
                    minimum: 8,
                    tooShort: 'E-Mail zu kurz'
                }
            }
        };
        /*
            validate
         */
        const valResult = validate({
            username: this.state.username,
            email: this.state.email
        },valConstraints);

        if(typeof(valResult) != "undefined") {

            let errorMessage;

            if (typeof (valResult.username) != "undefined")
                errorMessage = valResult.username[0];
            else if (typeof (valResult.email) != "undefined")
                errorMessage = valResult.email[0];

            this.setState({
                error: true,
                errorMessage: errorMessage
            });
        }else {

            const {username, email} = this.state;

            requestPasswordResetLink(username, email)
                .then(response => {
                    if (response.status === 200)
                        this.setState({
                            error: false,
                            sentMail: true
                        });
                    else
                        this.setState({
                            error: true,
                            errorMessage: 'Fehler: Dieser Benutzer scheint nicht zu existieren'
                        })
                })
                .catch(err => {
                    this.setState({
                        error: true,
                        errorMessage: 'Fehler!'
                    });
                });
        }
    }
    errorMessage = () => {
        if(this.state.error)
            return (
                <ErrorMsg>
                    {this.state.errorMessage}
                </ErrorMsg>
            )
    };
    successMessage = () => {
        if(this.state.sentMail)
            return (
                <SuccessMsg>
                    E-Mail zum zurücksetzen des Passwortes wurde versendet!
                </SuccessMsg>
            )
    }
    render() {
        return (
            <div className="h-100" style={{display: "flex"}}>
                <div className="col-sm-12 my-auto">
                    <div className="container border rounded p-3" style={{maxWidth: "800px"}}>
                        <BackToLogin/>
                        <h1>Passwort zurücksetzen</h1>
                        {this.errorMessage()}
                        <form onSubmit={this.submitHandler}>
                            <div className="form-group">
                                <label htmlFor="username">Benutzername:</label>
                                <input type="text"
                                       name="username"
                                       className="form-control"
                                       placeholder="Benutzernamen eingeben"
                                       onChange={this.changeHandler}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">E-Mail Addresse:</label>
                                <input type="email"
                                       name="email"
                                       className="form-control"
                                       placeholder="E-Mail Addresse eingeben"
                                       onChange={this.changeHandler}
                                />
                            </div>
                            {this.successMessage()}
                            <input
                                type="submit"
                                className="btn btn-primary"
                                value="Passwort zurücksetzen"
                            />
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}