import Colors from "../util/Color";
import BinSearchArray from "../util/BinSearch";
import chatSocket from "./chatSocket";

export const UserErrorCode = {
    none: 0,
    nan: 1,
    tempChat: 2,
    userNotExisting: 3,
    blocked: 4,
    isSelf: 5,
    error: 6
};

export async function getUserNormalChat(uid){
    /*
        does the user exist & does normal chat exist
     */
    if(chatSocket.users.getIndex(uid) !== -1){
        /*
            does a normalChat exist at the user
         */
        if(chatSocket.users.get(uid).normalChat !== 0) {

            return UserErrorCode.none;
        }else{
            /*
                chat does not exist in server
                it gets created
             */
            const user = chatSocket.users.get(uid);
            chatSocket.temporaryChat.createNew(uid,user.username);

            return UserErrorCode.tempChat;
        }
        /*
            does there exist a temporary chat with this user
        */
    }else if(chatSocket.temporaryChat.doesExist(uid)){
        /*
            user and chat does not exist in server
         */
        return UserErrorCode.tempChat;

    }else{
        /*
            request user from server
         */
        try {
            const config = {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            };
            const response = await fetch('/user/' + uid, config);
            /*
                if ok, modal is closed
             */
            if(response.ok) {

                const data = await response.json();

                if(data.userExists && !data.blocked) {

                    chatSocket.temporaryChat.createNew(uid,data.username);
                    return UserErrorCode.tempChat;

                }else{

                    if(!data.userExists)

                        return UserErrorCode.userNotExisting;

                    else

                        return UserErrorCode.blocked;
                }

            }else
                return UserErrorCode.error;

        }catch(error){
            return UserErrorCode.error;
        }
    }
}

export default class User{

    _uid;
    _username;
    _color;
    _online;
    //ids der chats des Users
    _normalChat = 0;
    //ids of the groupchats
    _groupChats = new BinSearchArray();

    constructor(uid,username,online) {
        this.uid = uid;
        this.username = username;
        this.color = Colors.random();
        this.online = online;
    }
    /*
        groupChat is added
     */
    addGroupChat(gcid){
        this.groupChats.add(gcid,gcid);
    }

    removeGroupChat(gcid){
        this.groupChats.remove(gcid);
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