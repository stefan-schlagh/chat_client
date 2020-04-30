import React,{Component} from "react";
import {username} from "../../Auth/Auth";
import $ from 'jquery';

export default class Header extends Component{
    constructor(props) {
        super(props);
        this.state = {
            username: username
        };
    }
    render() {
        return (
            <div className="container-top">
                <h3>Ich bin 1 header</h3>
                <div id="top-right" className="top-right">

                    <div className="top-right-left">

                    </div>

                    <input type="checkbox" id="btnControlTopRight"/>
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
    }

}