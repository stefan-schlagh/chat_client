export const login = async (username,password) => {
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
    return  await fetch('/auth/login', config);
};

export const register = async(username,password) => {
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
    return await fetch('/auth/register', config);
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