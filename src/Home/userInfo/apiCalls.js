import {makeRequest} from "../../global/requests";

export const fetchUserInfo = async (uid) => {
    const config = {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    };
    const response = await makeRequest('/user/' + uid, config);

    if(response.ok){
        return await response.json();
    }else{
        throw new Error("Error fetching UserInfo");
    }
}