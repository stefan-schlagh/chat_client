import {addReducer, setGlobal} from 'reactn';
import {infoHeaderCenter} from "../Home/Header/HeaderLeft";
import {initChats} from "./initChats";
import {initChatReducers} from "./chats";
import {authTokens} from "./authTokens";

export function initGlobal(){

    setGlobal({
        /*
            is the page ready to be shown?
         */
        loaded: false,
        /*
            the authentication token
         */
        authTokens: undefined,
        /*
            info about the user self
         */
        userSelf: {},
        /*
            what info should be shown at the left center of the header?
         */
        infoHeaderCenter: infoHeaderCenter.none,
        ihcData: null,
        /*
            the chat that is currently selected
         */
        currentChat: {
            type: '',
            id: 0,
            // the name of the chat
            chatName: '',
            /*
                unread messages inside the currentChat
             */
            newMessages: 0,
            /*
                the messages in the currentChat, displayed in chatContainer
             */
            messages: [],
            isStillMember: true,
            blockedBySelf: false,
            blockedByOther: false
        },
        /*
            the shown tempChat
         */
        tempChat: null,
        /*
            all chats of the user are stored here
         */
        chats: [],
        /*
            number of chats with new messages
         */
        newMessages: 0
        /*
            TODO: notifications
         */
    });

    initChats();

    /*
        the userSelf gets set
     */
    addReducer('setUserSelf',(global,dispatch,uid,username) => {

        return {
            userSelf: {
                uid: uid,
                username: username
            }
        }
    });
    /*
        userSelf is deleted
     */
    addReducer('deleteUserSelf',(global,dispatch) => {

       return {
           userSelf: {}
       }
    });
    /*
        // eslint-disable-next-line no-unused-vars
        global gets reseted
     */
    addReducer('resetGlobal',(global,dispatch) => ({
        infoHeaderCenter: infoHeaderCenter.none,
        ihcData: null,
        currentChat: {
            type: '',
            id: 0,
            chatName: '',
            newMessages: 0,
            messages: [],
            isStillMember: true,
            blockedBySelf: false,
            blockedByOther: false
        },
        tempChat: null,
        chats: [],
        newMessages: 0
    }));
    /*
        chat reducers are initialized
     */
    initChatReducers();
    /*
        authTokens reducers are initialized
     */
    authTokens();
}