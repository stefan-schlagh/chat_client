import io from 'socket.io-client';
import {uid, username} from "../Auth/Auth";
import User from "./User";
import BinSearchArray from "../util/BinSearch";
import {GroupChat, NormalChat} from "./Chat";
import Message from "./Message";
import EventHandler from "../util/Event";
import TempChatLoader from "./tempChatLoader";

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
    /*
        normalchat not saved in the database
     */
    _temporaryChat = new TempChatLoader();

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
            chat.startedTyping(data.uid);
        });
        /*
            stopped typing
         */
        this.socket.on('stopped typing',data => {
            const chat = this.getChat(data.type,data.id);
            chat.stoppedTyping(data.uid);
        });
        /*
            the result of the search in new chat
         */
        this.socket.on('users-noChat',data => {
            chatSocket.event.trigger('users-noChat',data);
        });
        /*
            the user has been added to a new chat
         */
        this.socket.on("new chat",data => {
            this.addNewChat(data);
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
    }

    initChats(data){

        for(let i=0;i<data.length;i++){

            if(data[i].type === 'normalChat'){

                this.addNewNormalChat(data[i]);
            }
            else if(data[i].type === 'groupChat'){

                this.addNewGroupChat(data[i]);
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
        /*
            type can be:
                normalChat
                tempChat
                groupChat
         */
        if(type === 'normalChat')
            return this.chats.normal.get(id);
        else if(type === 'tempChat') {
            return this.temporaryChat.chatNow;
        }
        else if(type === 'groupChat')
            return this.chats.group.get(id);
    }

    isCurrentChat(type,id){
        return this.currentChat.type === type && this.currentChat.id === id;
    };

    async userExists(uid){

        /*
            does the user exist & does normal chat exist
         */
        if(this.users.getIndex(uid) !== -1){
            /*
                does a normalChat exist at the user
             */
            if(this.users.get(uid).normalChat !== 0) {
                return {
                    userExists: true,
                    //does the user exist in client
                    isUserSaved: true,
                    //does a normalChat exist for this user
                    chatExists: true,
                    //is user self blocked by this user
                    isUserBlocked: false,
                    //does a temporary chat exist
                    tempChat: false
                };
            }else{
                /*
                    chat does not exist in server
                    it gets created
                 */
                const user = this.users.get(uid);
                this.temporaryChat.createNew(uid,user.username);

                return {
                    userExists: true,
                    //does the user exist in client
                    isUserSaved: true,
                    //does a normalChat exist for this user
                    chatExists: false,
                    //is user self blocked by this user
                    isUserBlocked: false,
                    //does a temporary chat exist
                    tempChat: false
                };
            }
        /*
            does there exist a temporary chat with this user
        */
        }else if(this.temporaryChat.doesExist(uid)){
            /*
                user and chat does not exist in server
             */
            return {
                userExists: true,
                //does the user exist in client
                isUserSaved: false,
                //does a normalChat exist for this user
                chatExists: false,
                //is user self blocked by this user
                isUserBlocked: false,
                //does a temporary chat exist
                tempChat: true
            };
        }else{
            /*
                request user from server
             */
            return  await this.temporaryChat.requestUser(uid);
        }
    }

    setCurrentChat(newChat){
        /*
            if chat is null, no chat will be selected:
                type: '', id: 0

            changes only if something has changed --> otherwise endless loop
         */
        if(newChat === null){
            /*
                check if something has been changed
             */
            if (this.currentChat.type !== '' ||
                this.currentChat.id !== 0) {

                this.currentChat = {
                    type: '',
                    id: 0
                };
                this.event.trigger('currentChat changed', null);
            }

        } else if(newChat.type === 'tempChat' && this.currentChat.type !== 'tempChat'){
            this.currentChat = {
                type: 'tempChat',
                id: 0
            };

            this.socket.emit('change chat', null);

            this.event.trigger('currentChat changed', newChat);
        }
        else{
            if(newChat.type !== '' && newChat.id !== 0) {
                /*
                   if something changed, currentChat gets updated
                 */
                if (this.currentChat.type !== newChat.type ||
                    this.currentChat.id !== newChat.id) {

                    const chat = this.getChat(newChat.type, newChat.id);
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

                    //console.log(this.currentChat);

                    this.event.trigger('currentChat changed', newChat);
                }
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
    /*
        a new chat gets added
     */
    addNewChat(data){

        let newChat;

        if(data.type === 'normalChat'){
            /*
                new normalChat gets created
             */
            newChat = this.addNewNormalChat(data);

        }else if(data.type === 'groupChat'){

        }
        newChat.unreadMessages = 1;
        /*
            event gets triggered
         */
        chatSocket.event.trigger('new chat',newChat);
    }
    /*
        a new normalChat gets added
     */
    addNewNormalChat(data){
        /*
            check if the other user does already exist
                if not --> gets created
         */
        let otherUser;
        if(this.users.getIndex(data.members[0].uid) === -1){
            otherUser = new User(data.members[0].uid,data.members[0].username,data.members[0].online);
            this.users.add(otherUser.uid,otherUser);
        }else{
            otherUser = this.users.get(data.members[0].uid);
        }
        /*
            new chat gets created
         */
        const newChat = new NormalChat(data.id,data.chatName,otherUser.uid);
        /*
            normalChat is set at other user
         */
        otherUser.normalChat = newChat.id;
        /*
            first message is initialized
         */
        const message = data.firstMessage;
        /*
            if message exists it gets added to the chat
         */
        if(!message.empty)
            newChat.messages.add(message.mid,new Message(message.mid,message.content,message.uid,newChat,new Date(message.date)));
        /*
            new chat gets added to binSearchArray
         */
        this.chats.normal.add(data.id,newChat);

        return newChat;
    }
    /*
        a new groupChat gets added
     */
    addNewGroupChat(data){
        /*
            check which do not exist already --> get added
         */
        const members = [];

        for(let i=0;i<data.members.length;i++) {

            const member = data.members[i];
            /*
                does the user already exist?
             */
            let user;
            if (this.users.getIndex(member.uid) === -1) {
                user = new User(member.uid, member.username, member.online);
                this.users.add(user.uid, user);
            } else {
                user = this.users.get(member.uid);
            }
            /*
                member gets added
             */
            members.push(user.uid);
            /*
                chat is added at user
             */
            user.addGroupChat(data.id);
        }
        /*
            new chat gets created
         */
        const newChat = new GroupChat(data.id,data.chatName,members);
        /*
            first message is initialized
         */
        const message = data.firstMessage;
        /*
            if message exists it gets added to the chat
         */
        if(!message.empty)
            newChat.messages.add(message.mid,new Message(message.mid,message.content,message.uid,newChat,new Date(message.date)));
        /*
            new chat gets added to binSearchArray
         */
        this.chats.group.add(data.id,newChat);

        return newChat;
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

    get temporaryChat() {
        return this._temporaryChat;
    }

    set temporaryChat(value) {
        this._temporaryChat = value;
    }
}

let chatSocket = new ChatSocket();

export default chatSocket;
