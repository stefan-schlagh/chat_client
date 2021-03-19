import {addReducer} from "reactn";
import chatSocket from "../chatData/chatSocket";
import {infoHeaderCenter} from "../Home/Header/HeaderLeft";

export function initChatReducers(){

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
                    messages: global.currentChat.messages.concat(message),
                    newMessages: global.currentChat.newMessages + 1
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
                /*
                    if the unread messages of the chat have been 0 until now, newMessages is incremented
                 */
                let newMessages = global.newMessages;
                if(chatObject.unreadMessages === 0){
                    newMessages++;
                }

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
                    chats: chatsClone,
                    newMessages: newMessages
                };
            }
        }
    });
    /*
        gets called when chat should be updated
            toTop: should chat be appended at top?
     */
    addReducer('updateChat',(global,dispatch,chat) => {
        const index = findIndex(global,chat);
        /*
            if the index is -1, the chat does not exist
         */
        if(index !== -1) {
            /*
                chat is not selected
                    latestMessageObject is updated
                    newMessage counter gets incremented
             */
            const chatsClone = global.chats.splice(0);
            /*
                item is deleted from array
             */
            chatsClone.splice(index, 1);
            /*
                get chat object
             */
            const chatObject = chat.getChatObject();
            /*
                item is added to start of the array
             */
            chatsClone.unshift(chatObject);

            if (chatSocket.isCurrentChat(chat.type, chat.id))
                return {
                    infoHeaderCenter: infoHeaderCenter.groupChat,
                    ihcData: {
                        name: chat.chatName,
                        gcid: chat.id
                    },
                    chats: chatsClone
                };
            else
                return {
                    chats: chatsClone
                };
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
                if there where unread messages, newMessages counter is decremented by 1
             */
            let newMessages = global.newMessages;
            if(item.unreadMessages > 0){
                newMessages--;
            }
            /*
                unreadMessages is set to 0
             */
            item.unreadMessages = 0;
            chat.unreadMessages = 0;
            chatsClone[index] = item;
            /*
                change is emitted to server
             */
            chatSocket.socket.emit('change chat', {
                type: chat.type,
                id: chat.id
            });

            return {
                currentChat: {
                    type: chat.type,
                    id: chat.id,
                    chatName: chat.chatName,
                    messages: chat.getMessages(),
                    newMessages: 0,
                    isStillMember: chat.type !== "groupChat" || chat.isStillMember,
                    blockedBySelf: chat.isBlockedBySelf(),
                    blockedByOther: chat.isBlockedByOther()
                },
                chats: chatsClone,
                tempChat: null,
                newMessages: newMessages
            }
        }
    });
    /*
        is called when no chat should be selected
     */
    addReducer('selectNoChat',(global,dispatch) => {
        /*
            change is emitted to server
         */
        chatSocket.socket.emit('change chat', null);

        return {
            currentChat: {
                type: '',
                id: 0,
                chatName: '',
                messages: [],
                newMessages: 0,
                isStillMember: true,
                blockedBySelf: false,
                blockedByOther: false
            },
        }
    });
    /*
        loaded messages are added
     */
    addReducer('addLoadedMessages',(global,dispatch,messages) => {

        return {
            currentChat: {
                ...global.currentChat,
                messages: messages ?
                    messages.concat(global.currentChat.messages)
                    : global.currentChat.messages
            }
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

        if(chatsClone.length === 0)
            return {
                chats: [chatObject]
            };

        let added = false;
        for (let i = 0; i < chatsClone.length; i++) {
            if (isDateBefore(chatsClone[i], chatObject)) {
                chatsClone.splice(i, 0, chatObject);
                added = true;
                break;
            }
        }
        if(!added)
            chatsClone.push(chatObject);

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
    addReducer('showTempChat',(global,dispatch) => {

        const chat = chatSocket.temporaryChat.chatNow;
        /*
            change is emitted to server
         */
        chatSocket.socket.emit('change chat', null);

        return {
            tempChat: chat.getChatObject(),
            currentChat: {
                type: 'tempChat',
                id: 0,
                chatName: '',
                messages: [],
                isStillMember: true,
                // TODO get blockInfo
                blockedBySelf: false,
                blockedByOther: false
            }
        }
    });
    /*
        tempChat is updated
     */
    addReducer('updateTempChat',(global,dispatch,chat) => ({
        tempChat: chat.getChatObject(),
        currentChat: {
            type: 'tempChat',
            id: 0,
            chatName: '',
            messages: [],
            isStillMember: true,
            blockedBySelf: false,
            blockedByOther: false
        }
    }));
    /*
        tempChat is hidden
     */
    addReducer('hideTempChat',(global,dispatch) => ({
        tempChat: null
    }));
}