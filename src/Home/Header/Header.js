import React,{Component} from "react";
import {username} from "../../Auth/Auth";
import $ from 'jquery';
import Responsive from "../../responsive/Responsive";

export default class Header extends Component{

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
        /*this.userInfoTimeout = setTimeout(() => {
            /*this.setState(state => ({
                checkBoxClicked: false
            }));
        },20);*/
        if (this.state.checkBoxClicked)
            this.changeChecked(event);
    };
    changeChecked = event => {
        this.setState(state => ({
            checkBoxClicked: !state.checkBoxClicked
        }));
    };
    render() {
        return (
            <div className="container-top">
                <Responsive displayIn={["Mobile"]}>
                    <div className="float-left top-left">
                        <i id="btnBackToChatList" className="fas fa-arrow-left fa-2x d-block d-md-none" />
                    </div>
                </Responsive>
                <div id="chat-info" className="chat-info float-left top-center pt-2">
                    <h3 id="chat-info-name">Socket.IO</h3>
                    <i className="fas fa-info-circle fa-2x" data-toggle="tooltip" title="chat info" />
                </div>
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
                                />
                            </div>
                            <div className="d-only-when-big top-2right">

                                <h4 id="username"
                                    className="p-2 username"
                                    data-toggle="tooltip"
                                    title="dein Benutzername">
                                        {this.state.username}
                                </h4>
                                <div className="float-right">
                                    <i className="fas fa-user-cog fa-2x"
                                       data-toggle="tooltip"
                                       title="Einstellungen"
                                    />
                                    &nbsp;
                                    <i id="user-logout"
                                       className="fas fa-sign-out-alt fa-2x logout"
                                       data-toggle="tooltip"
                                       title="logout"
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