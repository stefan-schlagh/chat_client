import React,{Component,useState,useEffect} from "react";
import {useParams} from "react-router-dom";
import chatSocket from "../../chatData/chatSocket";
import ChatViewLoader from "./ChatViewLoader";
import ChatContainer from "./ChatContainer";
import TempChatContainer from "./TempChatContainer";

const errorCode = {
    none: 0,
    tempChat: 1,
    userNotExisting: 2,
    blocked: 3
};

export function NormalChatView (props){

    const uid = props.uid;
    //const {uid} = useParams();
    const[userId,setUserId] = useState(0);
    const[loaded,setLoaded] = useState(false);
    /*
        wenn sich uid geändert hat, wird state neu gesetzt
     */
    if(parseInt(uid) !== userId){
        setUserId(parseInt(uid));
        setLoaded(false);
    }

    //console.log(chatSocket.users.getIndex(userId));
    //const e = chatSocket.users.getIndex(userId) !== -1;
    const[exists,setExists] = useState(errorCode.none);

    useEffect(() => {

        const userExists = () => {
            chatSocket.userExists(userId)
                .then(res => {
                    /*
                        if there was an error, the error code gets set
                     */
                    if(!res.userExists){
                        setExists(errorCode.userNotExisting)
                    }else if(res.isUserBlocked){
                        setExists(errorCode.blocked)
                    }else{
                        /*
                            no error
                                checks if existing or tempChat
                         */
                        if(res.chatExists) {
                            setExists(errorCode.none);
                            setCurrentChat(false);
                        }else {
                            setExists(errorCode.tempChat);
                            setCurrentChat(true);
                        }
                    }
                    setLoaded(true);
            });
        };

        const setCurrentChat = tempChat => {
            /*
                is the chat a tempchat?
             */
            if(tempChat){
                chatSocket.setCurrentChat({
                    type: 'tempChat',
                    id: 0
                });
            }
            /*
                currentChat in chatSocket gets updated
                if the chat does not exist, id is -1
            */
            else if(chatSocket.users.getIndex(userId) === -1){
                /*
                    current chat gets set to null -> no chat selected
                 */
                chatSocket.setCurrentChat(null);
            }else {
                chatSocket.setCurrentChat({
                    type: 'normalChat',
                    id: chatSocket.users.get(userId).normalChat
                });
            }
        };

        if(chatSocket.finishedLoading){
            userExists();
            //setCurrentChat();
        }else{
            chatSocket.event.on('chats loaded',() => {
                userExists();
                //setCurrentChat();
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
            es wird überprüft, ob uid number ist
            --> wenn nicht, ungültige Addresse
         */
        if(isNaN(uid)){
            return(
                <div>
                    <h2>ungültige Addresse</h2>
                </div>
            );
        }
        /*
            chat wird nur gerendert, wenn geladen
         */
        if(loaded){

            if(exists === errorCode.none){

                return(
                    <ChatContainer
                        uid={userId}
                        chatType={chatSocket.currentChat.type}
                        chatId={chatSocket.currentChat.id}
                    />
                )
            }else if(exists === errorCode.tempChat){
                return(
                    <TempChatContainer />
                )
            }else if(exists === errorCode.blocked){
                return(
                    <div>
                        <h2>Dieser User hat dich blockiert</h2>
                    </div>
                )
            }else{
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