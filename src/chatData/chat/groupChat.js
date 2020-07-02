import chatSocket from "../chatSocket";
import {Chat} from "./chat";

export class GroupChat extends Chat{
    //array with uids
    _users = [];
    //Array mit uids von den usern, die gerade schreibem
    _usersTyping = [];

    constructor(id,chatName,uids,unreadMessages = 0) {
        super('groupChat',id,chatName);
        this.users = uids;
        this.unreadMessages = unreadMessages;
    }

    getUsersTyping(){
        if(this.usersTyping.length > 0) {

            let rc = [];
            for(let i=0;i<this.usersTyping.length;i++){
                const user = chatSocket.users.get(this.usersTyping[i]);
                rc.push({
                    uid: user.uid,
                    username: user.username
                });
            }
            return rc;
        }
        return [];
    }
    /*
        gibt den user zurück, der am neuestem schriebt
     */
    getLatestUserTyping(){
        if(this.usersTyping.length > 0) {
            const user = chatSocket.users.get(this.usersTyping[this.usersTyping.length - 1]);
            return {
                uid: user.uid,
                username: user.username
            };
        }
        return null;
    }
    /*
        is called when a user started typing
     */
    startedTyping(uid){
        if(this.isMember(uid)){
            if(!this.isTyping(uid)){
                /*
                    the user is added to the currently typing users
                 */
                this.usersTyping.push(uid);
                this.event.trigger("typeState changed");
            }
        }
    }
    /*
        is called when a user stopped typing
     */
    stoppedTyping(uid){
        if(this.isMember(uid)){
            if(this.isTyping(uid)){
                /*
                    user is removed from the array of currently typing users
                 */
                this.usersTyping.splice(this.getIndexOfTyping(uid),1);
                this.event.trigger("typeState changed");
            }
        }
    }
    /*
        returns true if the uid is member of the chat and not self
     */
    isMember(uid){
        if(uid === chatSocket.userSelf.uid)
            return false;
        return this.users.find(e => e === uid);
    }
    /*
        returns true if the user is currently typing
     */
    isTyping(uid){
        return this.usersTyping.find(e => e === uid);
    }
    /*
        returns the index of a currently typing user
     */
    getIndexOfTyping(uid){
        return this.usersTyping.findIndex(e => e === uid);
    }

    get users() {
        return this._users;
    }

    set users(value) {
        this._users = value;
    }

    get usersTyping() {
        return this._usersTyping;
    }

    set usersTyping(value) {
        this._usersTyping = value;
    }
}