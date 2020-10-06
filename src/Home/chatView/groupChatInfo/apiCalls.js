import {makeRequest} from "../../../global/requests";

export const addMembers = async(gcid,users) => {

    const config = {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            users: users
        })
    };

    const response =
        await makeRequest(
            '/group/' + gcid + '/members',
            config
        );
    if(response.ok){
        return await response.json();
    }else{
        throw new Error("Error adding members");
    }
}
export const fetchUsersNotInGroup = async(gcid,body) => {

    const config = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    };
    const response = await makeRequest(
        '/user/notInGroup/' + gcid,
        config
    );
    if(response.ok){
        return await response.json();
    }else{
        throw new Error("Error fetching users");
    }
}