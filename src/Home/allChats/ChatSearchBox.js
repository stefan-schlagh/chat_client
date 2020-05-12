import React,{Component} from "react";
import {modals} from "../Home";

export default class ChatSearchBox extends Component{

    searchChanged = event => {
        this.props.onSearch(event.target.value);
    };

    newChatClicked = event => {
        this.props.setHomeState({
            modal: modals.newChat
        });
    };

    render() {
        return(
            <div className="chat-container-top border rounded mb-2">
                <div className="chat-select-form">
                    <input
                        type="text"
                        name="chat-search"
                        className="chat-search"
                        placeholder="Chat suchen"
                        onChange={this.searchChanged}
                    />
                    <button id="btn-newChat"
                            className="btn-newChat"
                            onClick={this.newChatClicked}
                    >
                        <i className="fas fa-plus fa-lg" />
                    </button>
                </div>
            </div>
        )
    }
}