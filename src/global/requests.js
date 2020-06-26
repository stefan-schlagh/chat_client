import {getGlobal,getDispatch} from 'reactn';

export async function makeRequest(target,config,tokensP){
    /*
        if parameter tokens is defined, this is taken
        else the one from global
     */
    const tokens = tokensP ? tokensP : getGlobal().authTokens;

    const configI = {
        ...config,
        method: config.method,
        headers: {
            ...config.headers,
            /*
                jwt
             */
            'Authorization': tokens
        }
    };

    const response = await fetch(target,configI);
    /*
        http-status 401: jwt timeout
     */
    if(response.status === 401){
        /*
            autToken is deleted
         */
        getDispatch().deleteAuthTokens();
        /*
            error is thrown
         */
        throw new Error('jwt expired');
    }
    return response;
}