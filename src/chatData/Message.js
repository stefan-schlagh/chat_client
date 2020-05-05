export default class Message {

    _mid;
    _content;
    _uid;
    _date;

    constructor(mid,content,uid,date = new Date(Date.now())) {
        this.mid = mid;
        this.content = content;
        this.uid = uid;
        this.date = date;
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
}