import React,{Component} from "react";

export default class ChatSearchBox extends Component{
    render() {
        return(
            <div className="chat-container-top border rounded mb-2">
                <div className="chat-select-form">
                    <input type="text" id="chat-search" className="chat-search" placeholder="Chat suchen" />
                    <button id="btn-newChat" className="btn-newChat" data-toggle="tooltip" title="neuer chat">
                        <i className="fas fa-plus fa-lg" />
                    </button>
                </div>
            </div>
        )
    }
}