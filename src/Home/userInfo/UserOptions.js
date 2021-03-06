import React,{Component} from 'react';
import {blockUser,unblockUser} from "./userInfoApiCalls";

export default class UserOptions extends Component {

    blockUser = () => {
        blockUser(this.props.uid)
            .then(response => {
                if(response.ok)
                    this.props.onBlockedBySelfChanged(true);
            })
            .catch(() => {});
    }

    unblockUser = () => {
        unblockUser(this.props.uid)
            .then(response => {
                if(response.ok)
                    this.props.onBlockedBySelfChanged(false);
            })
            .catch(() => {});
    }

    render() {
        return(
            <ul className={"userOptions"}>
                {!this.props.userInfo.blockedBySelf ?
                    <li
                        className={"noLink"}
                        onClick={this.blockUser}
                    >
                        blockieren
                    </li>
                    :
                    <li
                        className={"noLink"}
                        onClick={this.unblockUser}
                    >
                        nicht mehr blockieren
                    </li>
                }
            </ul>
        )
    }
}