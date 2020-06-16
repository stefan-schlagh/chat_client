import BinSearchArray from "../util/BinSearch";
import Message from "./Message";
import EventHandler from "../util/Event";
import chatSocket from "./chatSocket";
import {getDispatch} from 'reactn';

class Chat {

    _type;
    _id;
    _chatName;
    _messages = new BinSearchArray();
    _event = new EventHandler();
    _unreadMessages = 0;
    /*
        are all messages already loaded?
     */
    _reachedTopMessages = false;

    constructor(type, id,chatName) {
        this.type = type;
        this.id = id;
        this.chatName = chatName;
    }
    /*
        messages are loaded
     */
    async loadMessages(num){
        /*
            messages are only loaded, if top not already reached
         */
        if(!this.reachedTopMessages) {

            const getLastMsgId = () => {
                const msg = this.getLastMessage();
                if (msg !== null)
                    return msg.mid;
                return -1;
            };
            /*
                messages are loaded from server
             */
            const config = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chatType: this.type,
                    chatId: this.id,
                    lastMsgId: getLastMsgId(),
                    num: num
                })
            };
            const response = await fetch('/message/load', config);

            if (response.ok) {

                const data = await response.json();
                /*
                    is top already reached?
                 */
                this.reachedTopMessages = data.status === 'reached top';

                const lMessages = data.messages;
                /*
                    the array that will be returned
                 */
                const messages = new Array(lMessages.length);
                const userTopShown = this.showUserInfoMessage();

                for (let i = lMessages.length - 1; i >= 0; i--) {

                    const lm = lMessages[i];
                    const message = new Message(lm.mid, lm.content, lm.uid, this, new Date(lm.date));
                    this.messages.add(lm.mid, message);
                    messages[i] = message.getMessageObject(userTopShown);
                }
                return messages;
            }
            throw new Error();
        }
    }
    /*
        gibt die Nachricht, die am längsten zurück liegt, zurück
     */
    getLastMessage(){
        if (this.messages.length !== 0)
            return this.messages[0].value;
        return null;
    }
    /*
        gibt die neueste Nachricht im chat zurück
     */
    getFirstMessage(){
        if (this.messages.length !== 0)
            return this.messages[this.messages.length - 1].value;
        return null;
    }
    /*
        returns all messages in an array
            userTopShown    should the user at the top be shown?
     */
    getMessages(){

        const userTopShown = this.showUserInfoMessage();
        const rMessages = new Array(this.messages.length);

        for(let i=0;i<this.messages.length;i++){

            const message = this.messages[i].value;
            rMessages[i] = message.getMessageObject(userTopShown);
        }

        return rMessages;
    }
    /*
        neue Nachricht wird hinzugefügt
     */
    addMessage(uid,content,mid){
        const message =
            new Message(mid,content,uid,this,new Date(Date.now()));
        this.messages.add(mid,message);
        getDispatch().newMsg(
            this,
            this.unreadMessages,
            message.getMessageObject(
                this.showUserInfoMessage()
            ));
    }
    /*
        should the userInfo at the messages be shown (--> only in groupChats)
     */
    showUserInfoMessage(){
        return(this.type === 'groupChat')
    }
    /*
        an object of this chat is returned
     */
    getChatObject(){
        return {
            type: this.type,
            id: this.id,
            chatName: this.chatName,
            latestMessage: this.getLatestMessageObject(),
            unreadMessages: this.unreadMessages
        };
    }
    /*
        an object with the latest message is returned
     */
    getLatestMessageObject(){
        /*
            are there messages?
        */
        if(this.messages.length === 0){
            return null;
        }else{
            const lm = this.getFirstMessage();
            return {
                msgString: lm.getChatViewMsgString(),
                dateString: lm.getChatViewDateString(),
                date: lm.date
            };
        }
    }

    get type() {
        return this._type;
    }

    set type(value) {
        this._type = value;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get messages() {
        return this._messages;
    }

    set messages(value) {
        this._messages = value;
    }

    get chatName() {
        return this._chatName;
    }

    set chatName(value) {
        this._chatName = value;
    }

    get event() {
        return this._event;
    }

    set event(value) {
        this._event = value;
    }

    get unreadMessages() {
        return this._unreadMessages;
    }

    set unreadMessages(value) {
        this._unreadMessages = value;
    }

    get reachedTopMessages() {
        return this._reachedTopMessages;
    }

    set reachedTopMessages(value) {
        this._reachedTopMessages = value;
    }
}

export class NormalChat extends Chat{

    _otherUser;
    _isTyping = false;

    constructor(id,chatName,uid,unreadMessages = 0) {
        super('normalChat',id,chatName);
        this.otherUser = uid;
        this.unreadMessages = unreadMessages;
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
}
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