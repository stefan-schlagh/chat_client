import {NormalChat} from "./Chat";
import chatSocket from "./chatSocket";
import User from "./User";
import Message from "./Message";

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
        user gets requested
     */
    async requestUser(uid){

        return new Promise((resolve, reject) =>  {
            /*
                the userInfo gets requested
             */
            chatSocket.socket.emit('getUserInfo',uid,(res,error) => {
                /*
                    if success, the temporary chat gets created
                 */
                if(!error){
                    /*
                        if user does exist and user is not blocked, the temporary chat is created
                     */
                    if(res.userExists && !res.blocked) {

                        this.createNew(uid,res.username);

                        resolve({
                            userExists: true,
                            //does the user exist in client
                            isUserSaved: false,
                            //does a normalChat exist for this user
                            chatExists: false,
                            //is user self blocked by this user
                            isUserBlocked: false,
                            //does a temporary chat exist
                            tempChat: true
                        });
                    }else{
                        resolve({
                            userExists: res.userExists,
                            //does the user exist in client
                            isUserSaved: false,
                            //does a normalChat exist for this user
                            chatExists: false,
                            //is user self blocked by this user
                            isUserBlocked: res.blocked,
                            //does a temporary chat exist
                            tempChat: false
                        });
                    }
                /*
                    else false is returned
                 */
                }else{

                    resolve({
                        userExists: false,
                        //does the user exist in client
                        isUserSaved: false,
                        //does a normalChat exist for this user
                        chatExists: false,
                        //is user self blocked by this user
                        isUserBlocked: false,
                        //does a temporary chat exist
                        tempChat: false
                    });
                }
            });
        });
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
    }

    update(){
        chatSocket.event.trigger("tempChat updated");
    }

    hide(){
        this.isShown = false;
        chatSocket.event.trigger("tempChat hidden");
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
                chatSocket.event.trigger('new chat',newChat);
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

