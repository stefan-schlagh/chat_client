import {makeRequest} from "../../global/requests";

export async function requestUsersNoChat(body){
    const config = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    };
    /*
        response is returned
     */
    return await makeRequest('/user/noChat', config);
}
export async function createGroupChat(body){
    const config = {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    };
    return await makeRequest('/group/', config);
}
export async function requestUsers(body){
    const config = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    };
    /*
        response is returned
     */
    return await makeRequest('/user/', config);
}