import React,{useState,useEffect} from "react";
import {useParams} from "react-router-dom";
import chatSocket from "../../chatData/chatSocket";
import ChatViewLoader from "./ChatViewLoader";

export function NormalChatView (props){

    const {uid} = useParams();
    const[userId,setUserId] = useState(parseInt(uid));
    const[loaded,setLoaded] = useState(false);

    //console.log(chatSocket.users.getIndex(userId));
    //const e = chatSocket.users.getIndex(userId) !== -1;
    const[exists,setExists] = useState(false);

    useEffect(() => {

        const userExists = () => {
            chatSocket.userExists(userId).then(ex_ => {
                setExists(ex_);
                setLoaded(true);
            });
        };

        if(chatSocket.finishedLoading){
            userExists();
        }else{
            chatSocket.event.on('chats loaded',() => {
                userExists();
            });
        }
    });

    const renderLoader = () => {
        if(!loaded){
            return(
                <ChatViewLoader
                    msg="Chat wird geladen"
                />
            )
        }
    };

    const renderChat = () => {
        /*
            chat wird nur gerendert, wenn geladen
         */
        if(loaded){
            if(exists){
                return(
                    <div>
                        <h2>Chat</h2>
                        {chatSocket.users.get(userId).username}
                    </div>
                )
            }
            else{
                return(
                    <div>
                        <h2>Dieser User existiert nicht</h2>
                    </div>
                )
            }
        }
    };

    return <div>
                {renderLoader()}
                {renderChat()}
            </div>;
}

export function GroupChatView (props){

}

export function GroupChatInfoView (props){

}