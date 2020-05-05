import React,{Component} from "react";
import {Link} from "react-router-dom";

export default class ChatItem extends Component{

    render() {
        return(
            <li key={this.props._key_}
                className="list-group-item p-1"
            >
                <Link to={"/chat"}>
                    <div className="w-100">
                        <strong>
                            {this.props.name}
                        </strong>
                        <div className="newMsg-number">0</div>
                    </div>
                    <div className="w-100 lastMsg">
                        <span>{this.props.lastMessage.content}</span>
                        <div className="lastMsg-date">{this.props.lastMessage.date.getHours()}</div>
                    </div>
                </Link>
            </li>
        )
    }
    /*
        TODO: format date
     */
}