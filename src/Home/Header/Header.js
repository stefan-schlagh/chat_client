import React,{Component} from "reactn";
import HeaderLeft from "./HeaderLeft";
import {Link,withRouter} from "react-router-dom";
import Tooltip from "rc-tooltip";

import 'rc-tooltip/assets/bootstrap_white.css';

import './header.scss';

class Header extends Component{

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
        /*
            authTokens are deleted
         */
        this.dispatch.deleteAuthTokens();
    };

    render() {

        const {pathname} = this.props.location;

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
                                    <BottomToolTip text="Benutzer-Info">
                                        <h4 id="username"
                                            className="p-2 username"
                                        >
                                                {this.global.userSelf.username}
                                        </h4>
                                    </BottomToolTip>
                                </Link>
                                <div className="float-right">
                                    <Link to={pathname + "/settings"}>
                                        <BottomToolTip text="Einstellungen">
                                            <i className="fas fa-user-cog fa-2x"/>
                                        </BottomToolTip>
                                    </Link>
                                    &nbsp;
                                    <BottomToolTip text="logout">
                                        <i id="user-logout"
                                           className="fas fa-sign-out-alt fa-2x logout"
                                           onClick={this.logout}
                                        />
                                    </BottomToolTip>
                                </div>

                            </div>
                        </div>
                    </label>
                </div>
            </div>
        )
    }
    componentDidMount() {
        document.addEventListener('click',this.clickDocument,false);
    }
    componentWillUnmount() {
        document.removeEventListener('click',this.clickDocument,false);
    }
}

function BottomToolTip(props){
    return(
        <Tooltip placement="bottom"
                 trigger={['hover']}
                 overlay={
                     <span>{props.text}</span>
                 }>
            {props.children}
        </Tooltip>
    )
}
export default withRouter(Header);