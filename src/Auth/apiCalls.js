import {getDispatch} from "reactn";

export const login = async (username,password) => {
    try {
        const config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        };
        const response = await fetch('/auth/login', config);

        if (response.ok) {
            //return json
            let data = await response.json();

            if(data.success) {
                getDispatch().setUserSelf(data.uid, username);

                getDispatch().setAuthTokens(data.tokens);
            }
            return data;
        } else {
            return null;
        }
    } catch (error) {
        return null;
    }
};

export const register = async(username,password) => {
    try {
        const config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        };
        const response = await fetch('/auth/register', config);
        //const json = await response.json()
        if (response.ok) {
            //return json
            let data = await response.json();

            if(data.success) {
                getDispatch().setUserSelf(data.uid,username);

                getDispatch().setAuthTokens(data.tokens);
            }
            return data;
        }else
            return null;
    } catch (error) {
        return null;
    }
};