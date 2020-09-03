import React,{Component} from "reactn";
import {
    Link,
    withRouter
} from "react-router-dom";
import validate from "validate.js";
import {ErrorMsg} from "./MsgBox";
import TogglePassword from "./TogglePassword";

class Login extends Component{

    constructor(props) {
        super(props);
        this.state = {
            uNameErr: '',
            username: '',
            pwErr: '',
            password: '',
            valid: false,
            redirect: false
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
            }
        };
        /*
            es wird validiert
         */
        const valResult = validate({
            username: this.state.username,
            password: this.state.password
        },valConstraints);

        if(typeof(valResult)!="undefined"){

            let uNameErr;
            let pwErr;

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

            this.setState({
                valid: false,
                uNameErr: uNameErr,
                pwErr: pwErr
            });
        }else {
            this.setState({
                valid: true,
                uNameErr: '',
                pwErr: ''
            });
           /*
                request to server
            */
           this.login(this.state.username,this.state.password).then(data => {
               if(!data.success){

                   if(data.username !== undefined)
                       this.setState({
                           valid: false,
                           uNameErr: data.username
                       });
                   if(data.password !== undefined)
                       this.setState({
                           valid: false,
                           pwErr: data.password
                       });
               }
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

    login = async (username,password) => {
        try {
            const config = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            };
            const response = await fetch('/auth/login', config);
            //const json = await response.json()
            if (response.ok) {
                //return json
                let data = await response.json();

                if(data.success) {
                    this.dispatch.setUserSelf(data.uid,username);

                    this.dispatch.setAuthTokens(data.tokens);

                    this.props.history.push('/chat');
                }
                return data;
            } else {
                return null;
            }
        } catch (error) {
            return null;
        }
    };

    render(){

        return(
            <div className="h-100" style={{display: "flex"}}>
                <div className="col-sm-12 my-auto">
                    <div className="container border rounded p-3" style={{maxWidth: "800px"}}>
                        <h1>Login</h1>
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
                                <TogglePassword
                                       name="password"
                                       className="form-control"
                                       placeholder="Passwort eingeben"
                                       onChange={this.changeHandler}
                                />
                            </div>
                            <div className="form-group">
                                haben Sie noch keinen Account? <Link to="/register">Jetzt registrieren</Link>
                            </div>
                            <input
                                type="submit"
                                className="btn btn-primary"
                                value="Login"
                            />
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Login);