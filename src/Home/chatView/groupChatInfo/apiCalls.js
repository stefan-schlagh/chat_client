import {makeRequest} from "../../../global/requests";

/*
    the specified members will be added to the chat
        gcid: groupChat -  id
        users: the users
            [
                {uid:(num),username:(str)}
                {uid:(num),username:(str)}
            ]
 */
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
/*
    all users who are not in the group
        gcid: groupChat -  id
        body: the body of the request
            {
                search: a search can be specified,
                limit: 10,
                start: the number of users who are already loaded
            }
 */
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
/*
    the user leaves the chat
        gcid: groupChat -  id
    throws error if the user is the only admin
 */
export const leaveChat = async(gcid) => {

    const config = {
        method: 'POST',
        headers: {
            'Accept': 'application/json'
        }
    };
    const response =
        await makeRequest(
            '/group/' + gcid + '/leave',
            config
        );
    if(response.ok) {

        const data = await response.json();

        if(data.error){
            throw new Error("Error leaving chat");
        }
    }else{
        throw new Error("Error leaving chat");
    }
}
/*
    the admin status of the user is removed
        gcid: groupChat -  id
    throws error if the user is the only admin
 */
export const removeSelfAdmin = async(gcid) => {

    const config = {
        method: 'POST',
        headers: {
            'Accept': 'application/json'
        }
    };

    const response =
        await makeRequest(
            '/group/' + gcid + '/removeAdmin',
            config
        );

    if(response.ok) {

        const data = await response.json();

        if(data.error){
            throw new Error("Error removing admin");
        }
    }else{
        throw new Error("Error removing admin");
    }
}