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

export const verifyEmail = async(verificationCode) => {
    const config = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        }
    };
    return await fetch('/user/verifyEmail/' + verificationCode, config);
};

export const requestPasswordResetLink = async (username,email) => {
    const config = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            email: email
        })
    };
    return await fetch('/pwReset/requestLink',config);
}

export const isVerificationCodeValid = async(verificationCode) => {
    const config = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        }
    };
    return await fetch('/pwReset/isValid/' + verificationCode, config);
};

export const setPassword = async (code,password) => {
    const config = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            code: code,
            password: password
        })
    };
    return await fetch('/pwReset/set',config);
}