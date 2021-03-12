import {addReducer} from 'reactn';
import {fetchData} from "./globalData";
import {resetChatSocket} from "../chatData/chatSocket";
import {reqUserSelf} from "./apiCalls";
import {subscribePush, unsubscribePush} from "./push";

export function authTokens(){

    addReducer('deleteAuthTokens',(global,dispatch) => {

        localStorage.removeItem("authTokens");
        /*
            TODO: without reload
         */
        unsubscribePush();
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
                // get permissions
                const permissions = JSON.parse(localStorage.getItem('permissions'));
                if(permissions !== null && permissions.notifications)
                    await subscribePush(existingTokens);
                else
                    unsubscribePush();

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

    addReducer('setAuthTokens',async (global,dispatch,tokens) => {

        localStorage.setItem("authTokens", JSON.stringify(tokens));

        await subscribePush(tokens);

        return({
            loaded: true,
            authTokens: tokens
        });
    });
}