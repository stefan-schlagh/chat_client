import React,{Component} from "reactn";
import validate from "validate.js";
import {isVerificationCodeValid, setPassword} from "./apiCalls";
import {ErrorMsg, SuccessMsg} from "./MsgBox";
import TogglePassword from "./TogglePassword";
import BackToLogin from "./BackToLogin";

export default class ResetPassword extends Component {

    constructor(props) {
        super(props);
        this.state = {
            linkValid: true,
            error: false,
            errorMessage: '',
            password: '',
            passwordRepeat: '',
            passwordResetSuccess: false
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
        const valConstraints = {
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
            password: this.state.password,
            passwordRepeat: this.state.passwordRepeat
        },valConstraints);

        if(typeof(valResult) != "undefined") {

            let errorMessage;

            if (typeof (valResult.password) != "undefined")
                errorMessage = valResult.password[0];
            else if (typeof (valResult.passwordRepeat) != "undefined")
                errorMessage = "Passwörter stimmen nicht überein!"
            errorMessage = errorMessage.replace("Username ","").replace("Password ","");

            this.setState({
                error: true,
                errorMessage: errorMessage
            });
        }else {

            const {password} = this.state;

            setPassword(this.props.verificationCode, password)
                .then(response => {
                    if (response.status === 200)
                        this.setState({
                            error: false,
                            passwordResetSuccess: true
                        });
                    else if(response.status === 403)
                        this.setState({
                            error: true,
                            errorMessage: 'Fehler: Dieser Link ist ungültig!'
                        })
                    else
                        this.setState({
                            error: true,
                            errorMessage: 'ein Fehler ist aufgetreten'
                        });
                })
                .catch(err => {
                    this.setState({
                        error: true,
                        errorMessage: 'ein Fehler ist aufgetreten'
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
        if(this.state.passwordResetSuccess)
            return (
                <SuccessMsg>
                    Passwort erfolgreich zurückgesetzt!
                </SuccessMsg>
            )
    }
    componentDidMount = () => {
        isVerificationCodeValid(this.props.verificationCode)
            .then(response => {
                if(response.status !== 200)
                    this.setState({
                        linkValid: false
                    })
            })
            .catch(err => {
                this.setState({
                    linkValid: false
                })
            });
    }
    render() {
        if(this.state.linkValid)
            return (
                <div className="h-100" style={{display: "flex"}}>
                    <div className="col-sm-12 my-auto">
                        <div className="container border rounded p-3" style={{maxWidth: "800px"}}>
                            <BackToLogin/>
                            <h1>neues Passwort eingeben</h1>
                            {this.errorMessage()}
                            <form onSubmit={this.submitHandler}>
                                <div className="form-group">
                                    <label htmlFor="password">Passwort:</label>
                                    <TogglePassword
                                        name="password"
                                        className="form-control"
                                        placeholder="Passwort eingeben"
                                        onChange={this.changeHandler}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="passwordRepeat">Passwort wiederholen:</label>
                                    <TogglePassword
                                        name="passwordRepeat"
                                        className="form-control"
                                        placeholder="Passwort eingeben"
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
        else
            return (
                <ErrorMsg>
                    Ungültiger Link!
                </ErrorMsg>
            )
    }
}