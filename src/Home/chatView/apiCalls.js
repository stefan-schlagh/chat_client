import {makeRequest} from "../../global/requests";

export async function loadGroupChat(gcid){
    const config = {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    };
    return await makeRequest('/group/' + gcid + '/', config);
}
export async function sendMessage(body){
    const config = {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    };
    return  await makeRequest('/message', config);
}
export async function joinGroupChat(gcid){
    const config = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    };
    return  await makeRequest('/group/' + gcid + '/join/',config);
}