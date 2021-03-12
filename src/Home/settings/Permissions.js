import React,{Component} from "reactn";
import {subscribePush, unsubscribePush} from "../../global/push";

export default class Permissions extends Component {

    subscribed;

    constructor(props) {
        super(props);

        const permissionsString = localStorage.getItem('permissions');
        let permissions;
        if(permissionsString === null){
            permissions = {
                notifications: false
            }
            localStorage.setItem('permissions',JSON.stringify(permissions));
        }else{
            permissions = JSON.parse(permissionsString);
        }

        this.state = {
            permissions: permissions
        }
        this.subscribed =  permissions.notifications;
    }

    setNotifications = () => {
        this.setState(state => {
            let res = {
                permissions: {
                    ...state.permissions,
                    notifications: !state.permissions.notifications
                }
            }
            // subscribe / unsubscribe push
            if(res.permissions.notifications) {
                Notification.requestPermission().then(permiss => {
                    if(permiss !== 'granted')
                        this.setState(state => {
                            let res = {
                                permissions: {
                                    ...state.permissions,
                                    notifications: false
                                }
                            }
                            this.setPermissions(res.permissions);
                            return res;
                        })
                })
                if(!this.subscribed) {
                    subscribePush(this.global.authTokens).then(() => {});
                    this.subscribed = true;
                }
            }else {
                this.subscribed = false;
                unsubscribePush()
            }
            this.setPermissions(res.permissions);
            return res;
        })
    }

    setPermissions = (permissions) => {
        localStorage.setItem('permissions',JSON.stringify(permissions));
    }

    render() {
        return(
            <div>
                <h4>Berechtigungen</h4>

                <span>Benachrichtigungen</span>
                &nbsp;
                <label className="switch">
                    <input
                        type="checkbox"
                        checked={this.state.permissions.notifications}
                        onChange={this.setNotifications}
                    />
                    <span className="slider round"/>
                </label>
            </div>
        )
    }
}