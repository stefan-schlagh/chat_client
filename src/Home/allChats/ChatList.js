import React,{Component} from "react";
import ChatSearchBox from "./ChatSearchBox";

export default class ChatList extends Component{
    render() {

        const paddingTop = this.props.paddingTop || '1rem';
        return(
            <div style={{
                paddingTop: paddingTop
            }}>
                <ChatSearchBox />
            </div>
        )
    }
}