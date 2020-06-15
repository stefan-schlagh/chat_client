import {NormalChat} from "./Chat";
import chatSocket from "./chatSocket";
import User from "./User";
import Message from "./Message";
import {getDispatch} from 'reactn';

export default class TempChatLoader{

    _isShown = false;
    _chatNow;
    /*
        a new temporary chat gets created.
        parameters uid and username required
     */
    createNew(uid,username){
        this.chatNow = new NormalChat(0, username, uid);
    }
    /*
        is the current tempChat already the one with this uid?
     */
    doesExist(uid){
        if(this.chatNow === undefined)
            return false;
        return this.chatNow.otherUser === uid;
    }
    /*
        tempChat gets shown
     */
    show(){
        this.isShown = true;
        getDispatch().showTempChat(this.chatNow);
    }

    update(){
        getDispatch().updateTempChat(this.chatNow);
    }

    hide(){
        this.isShown = false;
        getDispatch().hideTempChat();
    }
    /*
        a new normalChat is created out of the current tempChat
     */
    async createNewNormalChat(message){

        /*
            the request gets sent to the server
         */
        const otherUid = this.chatNow.otherUser;
        const otherUsername = this.chatNow.chatName;

        const config = {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                uid: otherUid,
                username: otherUsername,
                message: message
            })
        };

        const response = await fetch('/user/chat', config);

        if(response.ok){

            const data = await response.json();

            if(chatSocket.users.getIndex(otherUid) === -1){
                chatSocket.users.add(otherUid,new User(otherUid,otherUsername));
            }
            const otherUser = chatSocket.users.get(otherUid);

            const newChat = new NormalChat(data.ncid,otherUsername,otherUid);
            /*
                chat gets added to user
             */
            otherUser.normalChat = newChat.id;
            /*
                chat is added in binsearchArray
             */
            chatSocket.chats.normal.add(data.ncid,newChat);
            /*
                message is added to chat
             */
            newChat.messages.add(data.mid,new Message(data.mid,message,chatSocket.userSelf.uid,newChat,new Date(Date.now())));

            //args: chat
            getDispatch().addChat(newChat);
            /*
                currentChat gets changed
             */
            getDispatch().selectChat(newChat);
            /*
                tempChat is hidden
             */
            this.hide();

            return true;
        }

        return false;

    }

    get isShown() {
        return this._isShown;
    }

    set isShown(value) {
        this._isShown = value;
    }

    get chatNow() {
        return this._chatNow;
    }

    set chatNow(value) {
        this._chatNow = value;
    }
}

