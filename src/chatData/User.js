import Colors from "../util/Color";

export default class User{

    _uid;
    _username;
    _color;
    _online;
    //ids der chats des Users
    _normalChat = 0;
    _groupChats;

    constructor(uid,username,online) {
        this.uid = uid;
        this.username = username;
        this.color = Colors.random();
        this.online = online;
    }

    get uid() {
        return this._uid;
    }

    set uid(value) {
        this._uid = value;
    }

    get username() {
        return this._username;
    }

    set username(value) {
        this._username = value;
    }

    get color() {
        return this._color;
    }

    set color(value) {
        this._color = value;
    }

    get online() {
        return this._online;
    }

    set online(value) {
        this._online = value;
    }

    get normalChat() {
        return this._normalChat;
    }

    set normalChat(value) {
        this._normalChat = value;
    }

    get groupChats() {
        return this._groupChats;
    }

    set groupChats(value) {
        this._groupChats = value;
    }
}