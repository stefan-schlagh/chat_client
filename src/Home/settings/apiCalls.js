import {makeRequest} from "../../global/requests";

export const getUserSelf = async () => {

    const config = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        }
    };

    const response =
        await makeRequest(
            '/user/self',
            config
        );
    if(response.ok){
        return await response.json();
    }else{
        throw new Error("Error requesting user info!");
    }
}

export const setEmail = async (body) => {

    const config = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    };

    const response =  await makeRequest(
        '/user/setEmail',
        config
    );
    return response;
}