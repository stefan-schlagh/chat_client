import React,{Component} from "reactn";
import $ from 'jquery';
import HeaderLeft from "./HeaderLeft";
import chatSocket from "../../chatData/chatSocket";
import {Link,withRouter} from "react-router-dom";

import './header.scss';
import {AuthContext} from "../../Auth/AuthContext";

class Header extends Component{

    deleteAuthTokens;

    constructor(props) {
        super(props);
        this.state = {
            checkBoxClicked: false
        };
    }
    clickCheckBox = event => {
        if(this.state.checkBoxClicked)
            event.stopPropagation();
        else {
            setTimeout(() => {
                this.setState(state => ({
                    checkBoxClicked: true
                }));
            }, 20);
        }
    };
    clickDocument = event => {
        if (this.state.checkBoxClicked)
            this.changeChecked(event);
    };
    changeChecked = event => {
        this.setState(state => ({
            checkBoxClicked: !state.checkBoxClicked
        }));
    };

    logout = () => {

        const config = {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        };
        fetch('/auth/logout', config)
            .then(() => {
                if(this.deleteAuthTokens)
                    this.deleteAuthTokens();
            })
            .catch();

    };

    render() {

        const {pathname} = this.props.location;

        return (
            <AuthContext.Consumer>
                {({authTokens, setAuthTokens,deleteAuthTokens}) => {

                    this.deleteAuthTokens = deleteAuthTokens;

                    return(
                        <div className="c-header">

                            <HeaderLeft />

                            <div id="top-right" className="right" onClick={this.clickCheckBox}>

                                <div className="right-l" />

                                <input type="checkbox"
                                       id="btnControlTopRight"
                                       className="btnControl"
                                       checked={this.state.checkBoxClicked}
                                       onChange={this.changeChecked}
                                />
                                <label htmlFor="btnControlTopRight">

                                    <div className="right-c">
                                        <div className="d-only-when-small">
                                            <i  id="user-info"
                                                className="fas fa-user fa-2x user-icon"
                                                data-toggle="tooltip"
                                                title="Benutzer-Info"
                                            />
                                        </div>
                                        <div className="d-only-when-big top-2right">

                                            <Link to={pathname + "/userInfo/" + this.global.userSelf.uid}>
                                                <h4 id="username"
                                                    className="p-2 username"
                                                    data-toggle="tooltip"
                                                    title="Benutzer-Info"
                                                >
                                                        {this.global.userSelf.username}
                                                </h4>
                                            </Link>
                                            <div className="float-right">
                                                <Link to={pathname + "/settings"}>
                                                    <i className="fas fa-user-cog fa-2x"
                                                       data-toggle="tooltip"
                                                       title="Einstellungen"
                                                    />
                                                </Link>
                                                &nbsp;
                                                <i id="user-logout"
                                                   className="fas fa-sign-out-alt fa-2x logout"
                                                   data-toggle="tooltip"
                                                   title="logout"
                                                   onClick={this.logout}
                                                />
                                            </div>

                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>
                    )
                }}
            </AuthContext.Consumer>
        );
    }
    componentDidMount() {
        $('[data-toggle="tooltip"]').tooltip();
        document.addEventListener('click',this.clickDocument,false);
    }
    componentWillUnmount() {
        document.removeEventListener('click',this.clickDocument,false);
    }

}
export default withRouter(Header);