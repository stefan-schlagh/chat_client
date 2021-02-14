import React,{Component} from "reactn";
import {verifyEmail} from "./apiCalls";
import "./VerifyEmail.scss";

export default class VerifyEmail extends Component{

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            error: false,
            success: false
        }
    }

    render(){
        if(this.state.loading){
            return null;
        } else if(this.state.error){
            return(
                <div className="h-100 verifyEmail error">
                    <h3>
                        Fehler!
                    </h3>
                </div>
            )
        } else if(!this.state.success){
            return(
                <div className="h-100 verifyEmail">
                    <h3>
                        Ungültiger Verifizierungscode!
                    </h3>
                </div>
            )
        } else{
            return(
                <div className="h-100 verifyEmail">
                    <h3>
                    E-Mail Addresse erfolgreich verifiziert!
                    </h3>
                </div>
            )
        }
    }

    componentDidMount = () => {
        verifyEmail(this.props.verificationCode)
            .then(response => {
                this.setState({
                    loading: false,
                    success: response.status === 200
                });
            })
            .catch(err => {
                this.setState({
                    loading: false,
                    error: true
                });
            });
    }
}