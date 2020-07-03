import chatSocket from "../chatSocket";
import {globalData} from "../../global/globalData";
import {getStatusMessageString} from "./statusMessage";

export function isDifferentDay(date1,date2){
    return date1.getDay() !== date2.getDay()
        || date1.getMonth() !== date2.getMonth()
        || date1.getFullYear() !== date2.getFullYear();
}

export default class Message {

    _mid;
    _uid;
    _date;
    _chat;
    _type;
    _content;

    constructor(
        mid,
        uid,
        chat,
        date = new Date(Date.now()),
        type,
        content
    ) {
        this.mid = mid;
        this.uid = uid;
        this.date = date;
        //type: object of Chat
        this.chat = chat;
        this.type = type;
        this.content = content;
    }
    /*
        a object representing the message is returned
     */
    getMessageObject(userTopShown){

        const message = {
            mDateString: this.getMessageViewDateString(),
            dateString: this.getDateString(),
            date: this.date,
            bySelf: this.uid === chatSocket.userSelf.uid,
            type: this.type,
            content: this.content
        };
        /*
            if the user top should be shown, the property is added
         */
        if(userTopShown)
            message.userTop = this.getUserTop();

        return message;
    }
    /*
        a object for the userinfo at the top of the message is returned
     */
    getUserTop(){
        /*
            is the message written by the user self?
         */
        if(this.isBySelf())
            return {
                uid: this.uid,
                username: 'Du',
                color: chatSocket.userSelf.color
            };
        /*
            if the user is not self
         */
        const user = chatSocket.users.get(this.uid);
        return {
            uid: this.uid,
            username: user.username,
            color: user.color
        };
    }
    /*
        is the message by the client self?
     */
    isBySelf(){
        return this.uid === chatSocket.userSelf.uid;
    }

    getChatViewDateString(){
        /*
            Wenn weniger als 1 Tag her: Uhrzeit
         */
        if(this.isDateToday()){

            return 'heute ' + this.getTimeString();
        }
        /*
            Wenn gestern: gestern
         */
        else if(this.isDateYesterday()){

            return 'gestern';
        }
        /*
            sonst: Datum
         */
        else{
            return this.getDateString();
        }
    }

    getChatViewMsgString(){

        // eslint-disable-next-line default-case
        switch(this.type) {

            case globalData.messageTypes.normalMessage: {

                let msgString = this.content.text;
                /*
                    Wenn string länger als 18 Zeichen, wird verkürzt
                 */
                if(msgString.length > 18)
                msgString = msgString.substr(0, 18) + '...';
                /*
                    wenn selbst geschrieben, steht Du: davor
                 */
                if(this.uid === chatSocket.userSelf.uid)
                    return`Du: ${msgString}`;

                else if (this.chat.type === 'normalchat')
                    return this.content.text;

                else
                    return `${chatSocket.users.get(this.uid).username}: ${msgString}`;
            }
            case globalData.messageTypes.statusMessage: {

                return getStatusMessageString(
                    this.getMessageObject(true),
                    false
                );
            }
        }
    }

    getMessageViewDateString(){
        if(this.isDateToday()){

            return this.getTimeString();
        }
        else if(this.isDateYesterday()){

            return 'gestern ' + this.getTimeString();
        }else{

            return this.getDateString() + ' ' + this.getTimeString();
        }
    }

    isDateToday(){
        const dateNow = new Date(Date.now());
        return this.date.getDate() === dateNow.getDate() &&
            this.date.getMonth() === dateNow.getMonth() &&
            this.date.getFullYear() === dateNow.getFullYear();
    }

    isDateYesterday(){
        const dateNow = new Date(Date.now());
        return this.date.getDate() === dateNow.getDate() - 1 &&
            this.date.getMonth() === dateNow.getMonth() &&
            this.date.getFullYear() === dateNow.getFullYear();
    }

    getDateString(){
        const d = this.date.getDate();
        let ds;
        if(d<10)
            ds = '0'+d;
        else
            ds = d;
        const m = this.date.getMonth();
        let ms;
        if(m+1<10)
            ms = '0'+(m+1);
        else
            ms = m+1;
        const y = this.date.getFullYear();

        return `${ds}.${ms}.${y}`;
    }

    getTimeString(){
        const h = this.date.getHours();
        let hs;
        if(h<10)
            hs = '0'+h;
        else
            hs = h;
        const m = this.date.getMinutes();
        let ms;
        if(m<10)
            ms = '0'+m;
        else
            ms = m;

        return `${hs}:${ms}`;
    }
    /*
        es wird überprüft, ob date2 an einem anderen Tag war
     */
    isDifferentDay(date2){
        return this.date.getDay() !== date2.getDay()
            || this.date.getMonth() !== date2.getMonth()
            || this.date.getFullYear() !== date2.getFullYear();
    }

    get mid() {
        return this._mid;
    }

    set mid(value) {
        this._mid = value;
    }

    get uid() {
        return this._uid;
    }

    set uid(value) {
        this._uid = value;
    }

    get date() {
        return this._date;
    }

    set date(value) {
        this._date = value;
    }

    get chat() {
        return this._chat;
    }

    set chat(value) {
        this._chat = value;
    }

    get type() {
        return this._type;
    }

    set type(value) {
        this._type = value;
    }

    get content() {
        return this._content;
    }

    set content(value) {
        this._content = value;
    }
}