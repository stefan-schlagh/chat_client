import BinSearchArray from "./BinSearch";

class Chat {

    _isSelfPart;
    _type;
    _id;
    _chatName;
    _messages = new BinSearchArray();

    constructor(type, id,chatName) {
        this.type = type;
        this.id = id;
        this.chatName = chatName;
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
}

export class NormalChat extends Chat{

    _otherUser;

    constructor(id,chatName,uid) {
        super('normalChat',id,chatName);
        this.otherUser = uid;
    }

    get otherUser() {
        return this._otherUser;
    }

    set otherUser(value) {
        this._otherUser = value;
    }
}
export class GroupChat extends Chat{

    _users;

    constructor(id,chatName,uids) {
        super('groupChat',id,chatName);
        this.users = uids;
    }

    get users() {
        return this._users;
    }

    set users(value) {
        this._users = value;
    }
}