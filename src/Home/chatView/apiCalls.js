import {makeRequest} from "../../global/requests";
import {globalData} from "../../global/globalData";

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