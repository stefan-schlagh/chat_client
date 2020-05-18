import React,{Component} from "react";
import {username} from "../../Auth/Auth";
import $ from 'jquery';
import HeaderLeft from "./HeaderLeft";
import chatSocket from "../../chatData/chatSocket";
import {Link,withRouter} from "react-router-dom";

class Header extends Component{

    constructor(props) {
        super(props);
        this.state = {
            username: username,
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
    render() {

        const {pathname} = this.props.location;

        return (
            <div className="container-top">

                <HeaderLeft
                    newMessages={this.props.headerLeft.newMessages}
                />

                <div id="top-right" className="top-right" onClick={this.clickCheckBox}>

                    <div className="top-right-left">

                    </div>

                    <input type="checkbox"
                           id="btnControlTopRight"
                           checked={this.state.checkBoxClicked}
                           onChange={this.changeChecked}
                    />
                    <label className="button-top-right"
                           htmlFor="btnControlTopRight">

                        <div className="top-right-center">
                            <div className="d-only-when-small">
                                <i  id="user-info"
                                    className="fas fa-user fa-2x user-icon"
                                    data-toggle="tooltip"
                                    title="Benutzer-Info"
                                />
                            </div>
                            <div className="d-only-when-big top-2right">

                                <Link to={pathname + "/userInfo/" + chatSocket.userSelf.uid}>
                                    <h4 id="username"
                                        className="p-2 username"
                                        data-toggle="tooltip"
                                        title="Benutzer-Info"
                                    >
                                            {this.state.username}
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
                                       onClick={this.props.logout}
                                    />
                                </div>

                            </div>
                        </div>
                    </label>
                </div>
            </div>
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