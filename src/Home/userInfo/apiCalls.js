import {makeRequest} from "../../global/requests";

export async function requestUserInfo(uid){
    const config = {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    };
    return  await makeRequest('/user/' + uid, config);
}