import chatSocket from "../chatData/chatSocket";
import {setGlobal} from "reactn";

export function initChats(){

    loadChats();

    async function loadChats() {
        const config = {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        };
        const response = await fetch('/chats', config);

        if(response.status === 200){
            chatSocket.initChats(await response.json());
        }else if(response.status === 403){
            setTimeout(loadChats,1000);
        }
    }

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