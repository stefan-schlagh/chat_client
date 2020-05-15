import chatSocket from "./chatSocket";

export default class Message {

    _mid;
    _content;
    _uid;
    _date;
    _chat;

    constructor(mid,content,uid,chat,date = new Date(Date.now())) {
        this.mid = mid;
        this.content = content;
        this.uid = uid;
        this.date = date;
        //type: object of Chat
        this.chat = chat;
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
        let msgString = this.content;
        /*
            Wenn string länger als 18 Zeichen, wird verkürzt
         */
        if(msgString.length>18)
            msgString = msgString.substr(0,18) + '...';
        /*
            wenn selbst geschrieben, steht Du: davor
         */
        if(this.uid === chatSocket.userSelf.uid)
            return `Du: ${msgString}`;

        else if(this.chat.type === 'normalchat')
            return this.content;

        else
            return `${chatSocket.users.get(this.uid).username}: ${msgString}`;

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

    get content() {
        return this._content;
    }

    set content(value) {
        this._content = value;
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
}