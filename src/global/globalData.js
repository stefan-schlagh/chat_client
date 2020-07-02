
export let globalData = {};

/*
    is called in isLoggedIn in App.js
 */
export async function fetchData(){

    const config = {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    };
    const response = await fetch('/data.json', config);

    if(response.ok){

        globalData = await response.json();
    }else{
        throw new Error();
    }
}