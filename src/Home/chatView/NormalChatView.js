import React,{useState,useEffect} from "react";
import {useParams} from "react-router-dom";
import chatSocket from "../../chatData/chatSocket";
import ChatViewLoader from "./ChatViewLoader";
import ChatContainer from "./ChatContainer";

export function NormalChatView (props){

    const {uid} = useParams();
    const[userId,setUserId] = useState(0);
    /*
        wenn sich uid geändert hat, wird state neu gesetzt
     */
    if(parseInt(uid) !== userId){
        setUserId(parseInt(uid));
    }

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

        const setCurrentChat = () => {
            /*
                currentChat bei chatSocket wird aktualisiert
            */
            chatSocket.setCurrentChat({
                type: 'normalChat',
                id: chatSocket.users.get(userId).normalChat
            });
        };

        if(chatSocket.finishedLoading){
            userExists();
            setCurrentChat();
        }else{
            chatSocket.event.on('chats loaded',() => {
                userExists();
                setCurrentChat();
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
                    <ChatContainer />
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

    return <div className="h-100">
                {renderLoader()}
                {renderChat()}
            </div>;
}

export function GroupChatView (props){

}

export function GroupChatInfoView (props){

}