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
        chatSocket.event.trigger("tempChat shown");
        getDispatch().showTempChat(this.chatNow);
    }

    update(){
        chatSocket.event.trigger("tempChat updated");
        getDispatch().updateTempChat(this.chatNow);
    }

    hide(){
        this.isShown = false;
        chatSocket.event.trigger("tempChat hidden");
        getDispatch().hideTempChat();
    }
    /*
        a new normalChat is created out of the current tempChat
     */
    async createNewNormalChat(message){

        return new Promise((resolve,reject) => {
            /*
                the request gets sent to the server
             */
            const otherUid = this.chatNow.otherUser;
            const otherUsername = this.chatNow.chatName;

            chatSocket.socket.emit('new normalChat',{
                uid: otherUid,
                username: otherUsername,
                message: message
            },res => {
                /*
                    the user and the chat get created client-side
                 */
                if(chatSocket.users.getIndex(otherUid) === -1){
                    chatSocket.users.add(otherUid,new User(otherUid,otherUsername,res.online));
                }
                const otherUser = chatSocket.users.get(otherUid);
                otherUser.online = res.online;

                const newChat = new NormalChat(res.ncid,otherUsername,otherUid);
                /*
                    chat gets added to user
                 */
                otherUser.normalChat = newChat.id;
                /*
                    chat is added in binsearchArray
                 */
                chatSocket.chats.normal.add(res.ncid,newChat);
                /*
                    message is added to chat
                 */
                newChat.messages.add(res.mid,new Message(res.mid,message,chatSocket.userSelf.uid,newChat,new Date(Date.now())));

                //args: chat
                getDispatch().addChat(newChat);

                /*
                    currentChat gets changed
                 */
                chatSocket.setCurrentChat(newChat);
                this.hide();

                resolve(true);
            });
        });
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

