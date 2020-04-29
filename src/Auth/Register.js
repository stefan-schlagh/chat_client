import React,{Component} from "react";

class Register extends Component{
    constructor(props) {
        super(props);
        this.state = {
            uNameErr: '',
            username: '',
            pwErr: '',
            password: '',
            valid: false
        }
    }
    changeHandler = event => {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({[nam]: val});
    };
    submitHandler = event => {

    };
    render(){
        return(
            <div className="h-100" style={{display:"flex"}}>
                <div className="col-sm-12 my-auto">
                    <div className="container border rounded p-3" style={{maxWidth: "800px"}}>
                        <h1>Registrieren</h1>
                        <form id="register-form">
                            <div className="form-group">
                                <label htmlFor="username">Benutzername:</label>
                                <small id="msg-uname" className="alert alert-danger p-1 message"/>
                                <input type="text" id="username" className="form-control"
                                       placeholder="Benutzernamen eingeben" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Passwort:</label>
                                <small className="alert alert-danger p-1 message"/>
                                <div id="psw-group">
                                    <input type="password" id="password" className="form-control"
                                           placeholder="Passwort eingeben" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Passwort wiederholen:</label>
                                <small className="alert alert-danger p-1 message"/>
                                <div id="psw-group-repeat">
                                    <input type="password" id="password-repeat" className="form-control"
                                           placeholder="Passwort eingeben" />
                                </div>
                            </div>
                            <input type="submit" className="btn btn-primary" value="Registrieren" />
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default Register;