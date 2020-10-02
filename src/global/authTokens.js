import {addReducer} from 'reactn';
import {fetchData} from "./globalData";
import {resetChatSocket} from "../chatData/chatSocket";
import {reqUserSelf} from "./apiCalls";

export function authTokens(){

    addReducer('deleteAuthTokens',(global,dispatch) => {

        localStorage.removeItem("authTokens");
        /*
            TODO: without reload
         */
        // eslint-disable-next-line no-restricted-globals
        location.reload();
        dispatch.deleteUserSelf();
        dispatch.resetGlobal();
        resetChatSocket();

        return {
            loaded: true,
            authTokens: undefined
        };
    });

    addReducer('initAuthTokens',async(global,dispatch,existingTokens) => {

        try {
            /*
                util data is fetched from the server
             */
            await fetchData();

            const response = await reqUserSelf(existingTokens);
            /*
                not authenticated
                    --> token is deleted
                    --> login page
             */
            if (response.status === 403) {
                localStorage.removeItem("authTokens");
                return {
                    loaded: true,
                    authTokens: undefined
                };
            }
            /*
                userSelf is updated
             */
            else {
                const data = await response.json();

                const {uid, username} = data;
                dispatch.setUserSelf(uid, username);

                return ({
                    loaded: true,
                    authTokens: existingTokens
                });
            }
        } catch (error) {
            console.error(error);
            return({
                loaded: false
            })
        }
    });

    addReducer('setAuthTokens',(global,dispatch,tokens) => {

        localStorage.setItem("authTokens", JSON.stringify(tokens));

        return({
            loaded: true,
            authTokens: tokens
        });
    });
}