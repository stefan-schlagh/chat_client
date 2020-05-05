import io from 'socket.io-client';
import {uid, username} from "../Auth/Auth";
import User from "./User";
import BinSearchArray from "./BinSearch";
import {NormalChat} from "./Chat";
import Message from "./Message";

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
                    /*
                        neier chat wird erzeugt
                     */
                    const chat = new NormalChat(data[i].id,data[i].chatName,data[i].members[0].uid);
                    /*
                        erste Msg wird angehängt
                     */
                    const message = data[i].firstMessage;
                    /*
                        wenn msg vorhanden, wird diese zu chat hinzugefügt
                     */
                    if(!message.empty)
                        chat.messages.push(new Message(message.mid,message.content,message.uid,new Date(message.date)));
                    this.chats.normal.add(data[i].id,chat);
                    /*
                        wenn user noch nicht vorhanden, wird er angelegt
                     */
                    if(this.users.getIndex(data[i].members[0].uid) === -1){
                        const user = data[i].members[0];
                        this.users.add(user.uid,new User(user.uid,user.username,user.isOnline));
                    }
                }
                else if(data[i].type === 'groupChat'){

                }
            }
            this.getChatArraySortedByDate();
        });
    }

    getChatArraySortedByDate(){

        const getMessageTime = chat => {
            const c = chat.messages[chat.messages.length - 1];
            if(c !== null)
                return c.date.getTime();
            return new Date(0).getTime();
        };

        const getMaxDate = (chats,iFrom) => {
            let max = iFrom;
            for(let i = iFrom+1;i<chats.length;i++){
                if(getMessageTime(chats[max]) < getMessageTime(chats[i]))
                    max = i;
            }
            return max;
        };
        const swap = (items, firstIndex, secondIndex) => {
            let temp = items[firstIndex];
            items[firstIndex] = items[secondIndex];
            items[secondIndex] = temp;
        };
        /*
            Array wird geklont
         */
        const cloneArr = arr => {
            const clone = new Array(arr.length);
            for(let i=0;i<arr.length;i++){
                clone[i] = arr[i].value;
            }
            return clone;
        };
        /*
            es wird ein sortiertes Array zurückgegeben
         */
        const getSorted = chats => {
            //Array wird erzeugt
            const sorted = cloneArr(chats);
            /*
                es wird immer das höchste eingefügt, um Array zu sortieren
             */
            for(let i=0;i<sorted.length-1;i++){
                let max = getMaxDate(sorted,i);
                swap(sorted,i,max);
            }
            return sorted;
        };
        /*
            Arrays werden gemerged
         */
        const mergeArr = (arr1,arr2) => {

            const merged = new Array(arr1.length + arr2.length);
            let p1 = 0;
            let p2 = 0;
            for(let i=0;i<merged.length;i++){
                if(! (p2 < arr2.length)){
                    merged[i] = arr1[p1];
                    p1++;
                }else if (! (p1 < arr1.length)){
                    merged[i] = arr2[p2];
                    p2++;
                }else if(getMessageTime(arr1[p1]) > getMessageTime(arr2[p2])){
                    merged[i] = arr1[p1];
                    p1++;
                }else{
                    merged[i] = arr2[p2];
                    p2++;
                }
            }
            return merged;
        };
        const ncSorted = getSorted(this.chats.normal);
        const gcSorted = getSorted(this.chats.group);

        const merged = mergeArr(ncSorted,gcSorted);
        console.log(merged);
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
