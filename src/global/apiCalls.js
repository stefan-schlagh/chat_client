import {makeRequest} from "./requests";

export async function reqUserSelf(tokens){
    const config = {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    };
    return await makeRequest(
        '/user/self',
        config,
        tokens
    );
}