import chatSocket from "../chatData/chatSocket";
import {setGlobal} from "reactn";

export function initChats(){

    function chatsLoaded(chats){
        setGlobal({
            chats: chats
        });
    }
    /*
       chats get initialized
       is loading of chats already finished?
           --> chatArray gets requested immediately
    */
    if(chatSocket.finishedLoading){
        chatsLoaded(chatSocket.getChatArraySortedByDate());
        /*
            otherwise --> event handler that gets triggered when loading finished
         */
    }else{
        chatSocket.event.on('chats loaded',chatsLoaded);
    }
}