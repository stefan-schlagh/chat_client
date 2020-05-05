import io from 'socket.io-client';
import {uid, username} from "../Auth/Auth";
import User from "./User";
import BinSearchArray from "./BinSearch";
import {NormalChat} from "./Chat";

class ChatSocket{

    _socket;
    _userSelf;
    _users = new BinSearchArray();
    _chats = {
        normal: new BinSearchArray(),
        group: new BinSearchArray()
    };

    init(){

        this.socket = io('http://localhost:3002');

        this.userInfo = {
            uid: uid,
            username: username
        };
        /*
            eigenes user-Objekt wird erzeugt
         */
        this.userSelf = new User(uid,username);
        /*
            userInfo wird an client gesendet
         */
        this.socket.emit('userInfo', this.userInfo);

        this.socket.on('all chats', data => {

            console.log(data);

            for(let i=0;i<data.length;i++){

                if(data[i].type === 'normalChat'){
                    this.chats.normal.add(data[i].id,new NormalChat(data[i].id,data[i].chatName,data[i].members[0].uid));
                    //TODO if user noch nicht defined
                    if(this.users.getIndex(data[i].members[0].uid) === -1){
                        this.users.add(data[i].members[0].uid,new User(data[i].members[0].uid,data[i].members[0].username));
                    }
                }
                else if(data[i].type === 'groupChat'){

                }
            }
        });
    }

    get socket() {
        return this._socket;
    }

    set socket(value) {
        this._socket = value;
    }

    get userSelf() {
        return this._userSelf;
    }

    set userSelf(value) {
        this._userSelf = value;
    }

    get users() {
        return this._users;
    }

    set users(value) {
        this._users = value;
    }

    get chats() {
        return this._chats;
    }

    set chats(value) {
        this._chats = value;
    }
}

let chatSocket = new ChatSocket();

export default chatSocket;
