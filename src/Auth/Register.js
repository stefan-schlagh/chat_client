import React,{Component} from "react";
import validate from "validate.js";
import {ErrorMsg} from "./MsgBox";
import {register, setLoggedIn} from "./Auth";
import {Redirect} from "react-router";
import $ from 'jquery';
import {extendJQuery} from './authUI';

class Register extends Component{
    constructor(props) {
        super(props);
        this.state = {
            uNameErr: '',
            username: '',
            pwErr: '',
            password: '',
            pwRepeatErr: '',
            pwRepeat: '',
            valid: false,
            redirect: false
        };
        extendJQuery();
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
                    tooShort: 'has to be at least 3 characters long',
                    maximum: 30,
                    tooLong: 'can only be 30 characters long'
                },
                format: {
                    pattern: new RegExp(/^\w\w*$/),
                    message: 'not valid'
                }
            },
            password: {
                presence: true,
                length: {
                    minimum: 8,
                    tooShort: 'has to be at least 8 characters long',
                    maximum: 30,
                    tooLong: 'can only be 30 characters long'
                }
            },
            passwordRepeat: {
                presence: true,
                equality: "password",
                length: {
                    minimum: 8,
                    tooShort: 'has to be at least 8 characters long',
                    maximum: 30,
                    tooLong: 'can only be 30 characters long'
                }
            }
        };
        /*
            es wird validiert
         */
        const valResult = validate({
            username: this.state.username,
            password: this.state.password,
            passwordRepeat: this.state.pwRepeat
        },valConstraints);

        if(typeof(valResult)!="undefined"){

            let uNameErr;
            let pwErr;
            let pwRepeatErr;

            if(typeof(valResult.username)!="undefined") {
                uNameErr = valResult.username[0];
            }else{
                uNameErr = '';
            }

            if(typeof(valResult.password)!="undefined") {
                pwErr = valResult.password[0];
            }else{
                pwErr = '';
            }

            if(typeof(valResult.passwordRepeat)!="undefined") {
                pwRepeatErr = valResult.passwordRepeat[0];
            }else{
                pwRepeatErr = '';
            }

            this.setState({
                valid: false,
                uNameErr: uNameErr,
                pwErr: pwErr,
                pwRepeatErr: pwRepeatErr
            });

        }else {
            this.setState({
                valid: true,
                uNameErr: '',
                pwErr: '',
                pwRepeatErr: ''
            });
            /*
                request to server
             */
            register(this.state.username,this.state.password).then(data => {
                if(data.success){
                    this.setState({
                        valid: true,
                        redirect: true
                    });
                }else {
                    if (data.username !== undefined)
                        this.setState({
                            valid: false,
                            uNameErr: data.username
                        });
                }
                console.log(data);
            });
        }
    };
    uNameErr = () => {
        if(this.state.uNameErr !== '')
            return (
                <ErrorMsg>
                    {this.state.uNameErr}
                </ErrorMsg>
            )
    };
    pwErr = () => {
        if(this.state.pwErr !== '')
            return(
                <ErrorMsg>
                    {this.state.pwErr}
                </ErrorMsg>
            )
    };
    pwRepeatErr = () => {
        if(this.state.pwRepeatErr !== '')
            return(
                <ErrorMsg>
                    {this.state.pwRepeatErr}
                </ErrorMsg>
            )
    };
    render(){
        /*
            wenn registriert --> redirect
         */
        if(this.state.redirect){
            //TODO redirect should work
            setLoggedIn(true);
            console.log('redirect');
            // eslint-disable-next-line no-restricted-globals
            location.reload();
            //this.props.history.push("/chat");
            return(
                <div>
                    <div>redirect</div>
                    <Redirect to="/chat" />
                </div>
            )
        }else {
            return (
                <div className="h-100" style={{display: "flex"}}>
                    <div className="col-sm-12 my-auto">
                        <div className="container border rounded p-3" style={{maxWidth: "800px"}}>
                            <h1>Registrieren</h1>
                            <form onSubmit={this.submitHandler}>
                                <div className="form-group">
                                    <label htmlFor="username">Benutzername:</label>
                                    {this.uNameErr()}
                                    <input type="text"
                                           name="username"
                                           className="form-control"
                                           placeholder="Benutzernamen eingeben"
                                           onChange={this.changeHandler}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password">Passwort:</label>
                                    {this.pwErr()}
                                    <div id="psw-group">
                                        <input type="password"
                                               name="password"
                                               className="form-control"
                                               placeholder="Passwort eingeben"
                                               onChange={this.changeHandler}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password">Passwort wiederholen:</label>
                                    {this.pwRepeatErr()}
                                    <div id="psw-group-repeat">
                                        <input type="password"
                                               name="pwRepeat"
                                               className="form-control"
                                               placeholder="Passwort eingeben"
                                               onChange={this.changeHandler}
                                        />
                                    </div>
                                </div>
                                <input type="submit" className="btn btn-primary" value="Registrieren"/>
                            </form>
                        </div>
                    </div>
                </div>
            )
        }
    }
    componentDidMount() {
        $('#psw-group-repeat, #psw-group').pwToggle();
    }
}

export default Register;