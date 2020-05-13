import io from 'socket.io-client';
import {uid, username} from "../Auth/Auth";
import User from "./User";
import BinSearchArray from "../util/BinSearch";
import {NormalChat} from "./Chat";
import Message from "./Message";
import EventHandler from "../util/Event";

class ChatSocket{

    _socket;
    _userSelf;
    _users = new BinSearchArray();
    _chats = {
        normal: new BinSearchArray(),
        group: new BinSearchArray()
    };
    _event = new EventHandler();
    _finishedLoading = false;
    _currentChat = {
        type: '',
        id: 0
    };

    init(){

        this.socket = io('http://172.16.1.149:3002');

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
            this.initChats(data);
        });
        // wenn messages geladen
        this.socket.on('messages', data => {
            /*
                gets chat of msg
                loads messages of this chat
             */
            const chat = this.getChat(data.chatType,data.chatId);
            if(chat !== undefined)
                chat.addLoadedMessages(data);
        });

        /*
            msg-handler
         */
        this.socket.on('chat message',data => {
            /*
                gets chat of msg
                adds this message to chat
            */
            const chat = this.getChat(data.type,data.id);
            if(chat !== null) {
                const isCurrentChat = this.isCurrentChat(chat.type, chat.id);
                chat.addMessage(data.uid, data.content, data.mid);
                /*
                    hasNewMsg gets updated
                    if current chat --> false
                 */
                chat.hasNewMsg = !isCurrentChat;
                /*
                    if chat is not currentChat, unreadMessages gets incremented
                 */
                chat.unreadMessages ++;
                /*
                    new message event is triggered
                 */
                this.event.trigger('new message', data.type, data.id);
            }
        });
        /*
            started typing
         */
        this.socket.on('started typing',data => {
            const chat = this.getChat(data.type,data.id);
            chat.event.trigger("started typing",data.uid);
        });
        /*
            stopped typing
         */
        this.socket.on('stopped typing',data => {
            const chat = this.getChat(data.type,data.id);
            chat.event.trigger("stopped typing",data.uid);
        });
        /*
            Bei disconnect wird Seite neu geladen
         */
        this.socket.on('disconnect',() => {
            setTimeout(function() {
                alert('Verbindung verloren! Seite wird neu geladen');
                // eslint-disable-next-line no-restricted-globals
                location.reload();
            },1000);
        });
        this.socket.on('users-noChat',data => {
           chatSocket.event.trigger('users-noChat',data);
        });
    }

    initChats(data){

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
                    chat.messages.add(message.mid,new Message(message.mid,message.content,message.uid,chat,new Date(message.date)));
                this.chats.normal.add(data[i].id,chat);
                /*
                    wenn user noch nicht vorhanden, wird er angelegt
                 */
                if(this.users.getIndex(data[i].members[0].uid) === -1){
                    const user = data[i].members[0];
                    //neuer user wird angelegt
                    const newUser = new User(user.uid,user.username,user.isOnline);
                    //id von normalchat wird hinzugefügt
                    newUser.normalChat = chat.id;
                    this.users.add(user.uid,newUser);
                }else{
                    //id von normalchat wird hinzugefügt
                    this.users.get(data[i].members[0].uid).normalChat = chat.id;
                }
            }
            else if(data[i].type === 'groupChat'){

            }
        }
        this.finishedLoading = true;
        this.event.trigger('chats loaded',this.getChatArraySortedByDate());
    }

    getChatArraySortedByDate(){

        const getMessageTime = chat => {
            const c = chat.lastMessage;
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
                const chat = arr[i].value;
                let lastMessage;
                if(chat.messages.length === 0){
                    lastMessage = null;
                }else{
                    const lm = chat.messages[chat.messages.length - 1].value;
                    lastMessage = {
                        date: lm.date
                    };
                }
                clone[i] = {
                    type: chat.type,
                    id: chat.id,
                    chatName: chat.chatName,
                    lastMessage: lastMessage
                };
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

        return mergeArr(ncSorted, gcSorted);
    }

    getChat(type,id){
        if(type === 'normalChat')
            return this.chats.normal.get(id);
        else
            return this.chats.group.get(id);
    }

    isCurrentChat(type,id){
        return this.currentChat.type === type && this.currentChat.id === id;
    };

    async userExists(uid){
        //TODO server request wenn user nicht exisitiert
        if(this.users.getIndex(uid) !== -1){
            return true;
        }else{
            return false;
        }
    }

    setCurrentChat(newChat){
        /*
            if chat is null, no chat will be selected:
                type: '', id: 0
         */
        if(newChat === null){
            this.currentChat = {
                type: '',
                id: 0
            };
        }else {
            /*
                nur wenn sich etwas geändert hat,
                wird currentChat aktualisiert
             */
            if (this.currentChat.type !== newChat.type ||
                this.currentChat.id !== newChat.id) {

                const chat = this.getChat(newChat.type,newChat.id);
                chat.hasNewMsg = false;
                /*
                    unreadMessages gets set to 0
                 */
                chat.unreadMessages = 0;
                this.currentChat = newChat;

                this.socket.emit('change chat', {
                    type: this.currentChat.type,
                    id: this.currentChat.id
                });

                this.event.trigger('currentChat changed', newChat);
            }
        }
    }
    /*
        returns number of new messages
     */
    getNumberNewMessages(){

        let newMessages = 0;

        for(let i=0;i<this.chats.normal.length;i++){
            if(this.chats.normal[i].value.hasNewMsg)
                newMessages ++;
        }

        for(let i=0;i<this.chats.group.length;i++){
            if(this.chats.group[i].value.hasNewMsg)
                newMessages ++;
        }
        return newMessages;
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

    get event() {
        return this._event;
    }

    set event(value) {
        this._event = value;
    }

    get finishedLoading() {
        return this._finishedLoading;
    }

    set finishedLoading(value) {
        this._finishedLoading = value;
    }

    get currentChat() {
        return this._currentChat;
    }

    set currentChat(value) {
        this._currentChat = value;
    }
}

let chatSocket = new ChatSocket();

export default chatSocket;
