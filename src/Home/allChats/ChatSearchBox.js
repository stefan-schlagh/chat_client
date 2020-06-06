import React,{Component} from "react";
import {Link,withRouter} from "react-router-dom";

import "./chatSearchBox.scss";

class ChatSearchBox extends Component{

    searchChanged = event => {
        this.props.onSearch(event.target.value);
    };

    render() {

        const {pathname} = this.props.location;

        return(
            <div className="chatSearchBox">
                <div className="chat-select-form">
                    <input
                        type="text"
                        name="chat-search"
                        className="chat-search"
                        placeholder="Chat suchen"
                        onChange={this.searchChanged}
                    />
                    <Link to={pathname + "/newChat"}>
                        <button id="btn-newChat"
                                className="btn-newChat"
                        >
                            <i className="fas fa-plus fa-lg" />
                        </button>
                    </Link>
                </div>
            </div>
        )
    }
}
export default withRouter(ChatSearchBox);