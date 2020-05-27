
export let loggedIn = false;
export let username;
export let uid;
/*
    request an server, ob cookie von User gesetzt
 */
export function setLoggedIn(val){
    loggedIn = val;
}
/*
    TODO: error-handling
 */
export async function isLoggedIn(){
    try {
        const config = {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        };
        const response = await fetch('/user/self', config);

        if(response.status === 403)
            loggedIn = false;
        if (response.ok) {
            //return json
            let data = await response.json();

            loggedIn = true;
            uid = data.uid;
            username = data.username;

            return loggedIn;
        } else {
            return false;
        }
    } catch (error) {
        return false;
    }
}
/*
    login-request
 */
export async function login(username, password){
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
        //const json = await response.json()
        if (response.ok) {
            //return json
            let data = await response.json();
            if(data.success) {
                loggedIn = true;
                await isLoggedIn();
            }
            return data;
        } else {
            return null;
        }
    } catch (error) {
        return null;
    }
}
export async function register(username,password){
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
                loggedIn = true;
                await isLoggedIn();
            }
            return data;
        } else {
            return null;
        }
    } catch (error) {
        return null;
    }
}
export async function logout(){
    try {
        const config = {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        };
        const response = await fetch('/auth/logout', config);
        //const json = await response.json()
        if (response.ok) {
            //return json
            let data = await response.json();

            return data.success;
        } else {
            return false;
        }
    } catch (error) {
        return false;
    }
}