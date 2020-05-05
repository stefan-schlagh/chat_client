import Colors from "../util/Color";

export default class User{

    _uid;
    _username;
    _color;
    _online;

    constructor(uid,username) {
        this.uid = uid;
        this.username = username;
        this.color = Colors.random();
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
}