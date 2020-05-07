import React,{Component} from "react";
import MessageForm from "./MessageForm";

export default class ChatContainer extends Component{

    render() {
        return(
            <div className="chat-container">
                <div className="messages">

                </div>
                <MessageForm />
            </div>
        )
    }
}