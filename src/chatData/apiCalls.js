import {makeRequest} from "../global/requests";

export async function selectChats(){

    const config = {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    };
    /*
        chats are requested
     */
    return await makeRequest('/chats', config);
}
export async function createNormalChat(body){

    const config = {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    };
    return  await makeRequest('/user/chat', config);
}
export async function selectUser(uid){

    const config = {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    };
    return await makeRequest('/user/' + uid, config);
}
export async function loadMessages(body){

    const config = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    };
    return  await makeRequest('/message/load', config);
}