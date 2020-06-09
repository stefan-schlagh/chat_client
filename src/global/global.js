import {addReducer, setGlobal} from 'reactn';
import {infoHeaderCenter} from "../Home/Header/HeaderLeft";

export function initGlobal(){

    setGlobal({
        /*
            what info should be shown at the left center of the header?
         */
        infoHeaderCenter: infoHeaderCenter.none,
        ihcData: null,
        /*
            the chat that is currently selected
         */
        currentChat: {
            type: '',
            id: 0,
            /*
                the messages in the currentChat, displayed in chatContainer
             */
            messages: []
        },
        /*
            the shown tempChat
         */
        tempChat: null,
        /*
            all chats of the user are stored here
         */
        chats: []
    });
    /*
        is the chat the current chat?
     */
    function isSelected(global,chat){

        const currentChat = global.currentChat;
        return currentChat.type === chat.type
            && currentChat.id === chat.id;
    }
    /*
        index of the chat is searched
     */
    function findIndex(global,chat){

        return global.chats.findIndex(
            element => (
                element.id === chat.id
                && element.type === chat.type)
        );
    }
    /*
        is called when there is a new message
     */
    addReducer('newMsg',(global,dispatch,chat,unreadMessages,message) => {

        const index = findIndex(global,chat);
        /*
            if the index is -1, the chat does not exist
         */
        if(index !== -1){
            /*
                is the chat selected?
             */
            if(isSelected(global,chat)) {
                /*
                    chat is selected
                        latestMessageObject is updated
                        newMessage counter is set to 0
                 */
                const chatsClone = global.chats.splice(0);
                const chatObject = chatsClone[index];
                chatObject.latestMessage = chat.getLatestMessageObject();
                chatObject.unreadMessages = 0;
                /*
                    item is deleted from array
                 */
                chatsClone.splice(index,1);
                /*
                    item is added to start of the array
                 */
                chatsClone.unshift(chatObject);
                /*
                    message is added to messages in currentChat
                 */
                const currentChat = {
                    ...global.currentChat,
                    messages: global.currentChat.messages.concat(message)
                };
                return {
                    chats: chatsClone,
                    currentChat: currentChat
                };
            }else{
                /*
                    chat is not selected
                        latestMessageObject is updated
                        newMessage counter gets incremented
                 */
                const chatsClone = global.chats.splice(0);
                const chatObject = chatsClone[index];
                chatObject.latestMessage = chat.getLatestMessageObject();
                chatObject.unreadMessages = unreadMessages + 1;
                /*
                    item is deleted from array
                 */
                chatsClone.splice(index,1);
                /*
                    item is added to start of the array
                 */
                chatsClone.unshift(chatObject);

                return {
                    chats: chatsClone
                };
            }
        }
    });
    /*
        gets called out of changeCurrentChat in chatSocket
     */
    addReducer('selectChat',(global,dispatch,chat) => {

        const index = findIndex(global,chat);
        /*
            if the index is -1, the chat does not exist
         */
        if(index !== -1) {
            /*
                chats is cloned
             */
            const chatsClone = global.chats.splice(0);
            const item = chatsClone[index];
            /*
                unreadMessages is set to 0
             */
            item.unreadMessages = 0;
            chatsClone[index] = item;

            return {
                currentChat: {
                    type: chat.type,
                    id: chat.id,
                    messages: []
                },
                chats: chatsClone,
                tempChat: null
            }
        }
    });
    /*
        is called when no chat should be selected
     */
    addReducer('selectNoChat',(global,dispatch) => {

    });
    /*
        loaded messages are added
     */
    addReducer('addLoadedMessages',(global,dispatch,messages) => {

        return {
            messages: messages ?
                messages.concat(global.currentChat.messages)
                : global.currentChat.messages
        };
    });
    /*
        new chat is added
     */
    addReducer('addChat',(global,dispatch,chat) => {

        function isDateBefore(chat1,chat2){
            /*
                do latestMessages exist?
             */
            if(!chat1.latestMessage)
                return true;
            else if(!chat2.latestMessage)
                return false;
            else
                return chat1.latestMessage.date.getTime() < chat2.latestMessage.date.getTime();
        }
        /*
            place the chat at the right position
            chats is cloned
         */
        const chatsClone = global.chats.splice(0);
        const chatObject = chat.getChatObject();

        for(let i=0;i<chatsClone.length;i++){
            if(isDateBefore(chatsClone[i],chatObject)){
                chatsClone.splice(i,0,chatObject);
                break;
            }
        }

        return {
            chats: chatsClone
        }

    });
    /*
        chat is removed
     */
    addReducer('removeChat',(global,dispatch,chat) => {

        const index = findIndex(global,chat);
        /*
            chats is cloned
         */
        const chatsClone = this.state.chats.splice(0);
        /*
            item is deleted from array
         */
        chatsClone.splice(index,1);

        return {
            chats: chatsClone
        }
    });
    /*
        tempChat is shown
     */
    addReducer('showTempChat',(global,dispatch,chat) => ({
        tempChat: chat.getChatObject(),
        currentChat: {
            type: 'tempChat',
            id: 0,
            messages: []
        }
    }));
    /*
        tempChat is updated
     */
    addReducer('updateTempChat',(global,dispatch,chat) => ({
        tempChat: chat.getChatObject(),
        currentChat: {
            type: 'tempChat',
            id: 0,
            messages: []
        }
    }));
    /*
        tempChat is hidden
     */
    addReducer('hideTempChat',(global,dispatch) => ({
        tempChat: null
    }));
}