import chatSocket from "../chatSocket";
import {Chat} from "./chat";

export class NormalChat extends Chat{

    _otherUser;
    _isTyping = false;
    // block info
    _blockedBySelf;
    _blockedByOther;

    constructor(id,chatName,uid,unreadMessages = 0,blockedBySelf,blockedByOther) {
        super('normalChat',id,chatName);
        this.otherUser = uid;
        this.unreadMessages = unreadMessages;
        this.blockedBySelf = blockedBySelf;
        this.blockedByOther = blockedByOther;
    }

    getUsersTyping(){
        if(this.isTyping) {
            const user = chatSocket.users.get(this.otherUser);
            return [
                {
                    uid: user.uid,
                    username: user.username
                }
            ];
        }
        return [];
    }
    /*
        gibt den user zurück, der erst die kürzeste Zeit schreibt
     */
    getLatestUserTyping(){
        if(this.isTyping) {
            const user = chatSocket.users.get(this.otherUser);
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
        if(uid === this.otherUser){
            this.isTyping = true;
            this.event.trigger("typeState changed");
        }
    }
    /*
        is called when a user stopped typing
     */
    stoppedTyping(uid){
        if(uid === this.otherUser){
            this.isTyping = false;
            this.event.trigger("typeState changed");
        }
    }

    get otherUser() {
        return this._otherUser;
    }

    set otherUser(value) {
        this._otherUser = value;
    }

    get isTyping() {
        return this._isTyping;
    }

    set isTyping(value) {
        this._isTyping = value;
    }

    get blockedBySelf() {
        return this._blockedBySelf;
    }

    set blockedBySelf(value) {
        this._blockedBySelf = value;
    }

    get blockedByOther() {
        return this._blockedByOther;
    }

    set blockedByOther(value) {
        this._blockedByOther = value;
    }
}