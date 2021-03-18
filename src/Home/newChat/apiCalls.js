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
export async function fetchUsers(body){
    const config = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    };
    const response = await makeRequest('/user/', config);

    if(response.ok){
        return await response.json();
    }else{
        throw new Error("Error fetching users");
    }
}
export async function fetchPublicGroups(body){
    const config = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    };
    return  await makeRequest('/group/public/', config);
}