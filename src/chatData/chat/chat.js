import BinSearchArray from "../../util/BinSearch";
import Message from "../message/message";
import EventHandler from "../../util/Event";
import {getDispatch} from 'reactn';

export class Chat {

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
        the first message of the object is initialized
     */
    initFirstMessage(messageData){

        if(!messageData.empty)
            this.messages.add(
                messageData.mid,
                new Message(
                    messageData.mid,
                    messageData.uid,
                    this,
                    new Date(messageData.date),
                    messageData.type,
                    messageData.content
                )
            );
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

                    const messageData = lMessages[i];
                    /*
                        message is created
                     */
                    const message =
                        new Message(
                            messageData.mid,
                            messageData.uid,
                            this,
                            new Date(messageData.date),
                            messageData.type,
                            messageData.content
                        );
                    /*
                        message is added to chat
                     */
                    this.messages.add(
                        messageData.mid,
                        message
                    );
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
    addMessage(uid,mid,type,content){
        const message =
            new Message(
                mid,
                uid,
                this,
                new Date(Date.now()),
                type,
                content
            );
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
