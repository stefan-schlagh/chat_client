import BinSearchArray from "../util/BinSearch";
import Message from "./Message";
import EventHandler from "../util/Event";
import chatSocket from "./chatSocket";

class Chat {

    _isSelfPart;
    _type;
    _id;
    _chatName;
    _messages = new BinSearchArray();
    _event = new EventHandler();

    constructor(type, id,chatName) {
        this.type = type;
        this.id = id;
        this.chatName = chatName;
    }
    /*
        Nacrichten werden geladen
     */
    loadMessages(num){
        const getLastMsgId = () => {
            const msg = this.getLastMessage();
            if(msg !== null)
                return msg.mid;
            return -1;
        };
        /*
            event wird an server emitted,
            aber nur wenn gerade nicht dieses event in Bearbeitung
         */
        chatSocket.socket.emit('load messages', {
            chatType: this.type,
            chatId: this.id,
            lastMsgId: getLastMsgId(),
            num: num
        });
    }
    addLoadedMessages(data){
        /*
            es wird geschaut, ob schon oben angelangt
         */
        this.reachedTop = data.status === 'reached top';

        const lMessages = data.messages;
        for(let i=lMessages.length-1;i>=0;i--){
            const lm = lMessages[i];
            this.messages.add(lm.mid,new Message(lm.mid,lm.content,lm.uid,this,new Date(lm.date)));
        }
        /*
            msg loaded wird getriggert
         */
        this.event.trigger('messages loaded');
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
        neue Nachricht wird hinzugefügt
     */
    addMessage(uid,content,mid){
        this.messages.add(mid,new Message(mid,content,uid,this,new Date(Date.now())));
        this.event.trigger("new message",uid);
    }

    get isSelfPart() {
        return this._isSelfPart;
    }

    set isSelfPart(value) {
        this._isSelfPart = value;
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
}

export class NormalChat extends Chat{

    _otherUser;
    _isTyping = false;

    constructor(id,chatName,uid) {
        super('normalChat',id,chatName);
        this.otherUser = uid;

        this.event.on("started typing",uid => {
            if(uid === this.otherUser){
                this.isTyping = true;
                this.event.trigger("typeState changed");
            }
        });

        this.event.on("stopped typing",uid => {
            if(uid === this.otherUser){
                this.isTyping = false;
                this.event.trigger("typeState changed");
            }
        });
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

    _users;
    //Array mit uids von den usern, die gerade schreibem
    _usersTyping = [];

    constructor(id,chatName,uids) {
        super('groupChat',id,chatName);
        this.users = uids;
    }

    getUsersTyping(){

    }
    /*
        gibt den user zurück, der am neuestem schriebt
     */
    getLatestUserTyping(){

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