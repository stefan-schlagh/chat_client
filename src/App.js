import React, {useState,useDispatch,useEffect} from "reactn";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    useLocation
} from "react-router-dom";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import PrivateRoute from "./Auth/PrivateRoute";
import {AuthContext} from "./Auth/AuthContext";
import {resetChatSocket} from "./chatData/chatSocket";
import Chat from "./Home/Home";
import {fetchData} from "./global/globalData";
import 'popper.js';

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

import {initGlobal} from "./global/global";

initGlobal();

function updateUserSelf(data,dispatch){
    try {
        const {uid, username} = data;
        dispatch.setUserSelf(uid, username);
    }catch (e) {

    }
}

async function isLoggedIn(){
    try {
        await fetchData();

        const config = {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        };
        const response = await fetch('/user/self', config);

        if(response.status === 403)
            return false;
        return true;

    } catch (error) {
        return false;
    }
}

export default function App() {

    const dispatch = useDispatch();

    const initTokens = (tokens) => {

        isLoggedIn()
            .then(res => {
                if(res) {
                    updateUserSelf(tokens,dispatch);
                    setAuthTokens(tokens);
                }else{
                    localStorage.removeItem("tokens");
                    setAuthTokens(undefined);
                }
            });
    };

    const tokens = {
        loading: true
    };
    const [authTokens, setAuthTokens] = useState(tokens);

    useEffect(() => {
        const existingTokens = JSON.parse(localStorage.getItem("tokens"));
        initTokens(existingTokens);
    },[]);

    const setTokens = (data) => {
        localStorage.setItem("tokens", JSON.stringify(data));
        setAuthTokens(data);

        updateUserSelf(data,dispatch);
    };

    const deleteTokens = () => {
        localStorage.removeItem("tokens");
        setAuthTokens(undefined);
        /*
            TODO: without reload
         */
        // eslint-disable-next-line no-restricted-globals
        location.reload();
        dispatch.deleteUserSelf();
        dispatch.resetGlobal();
        resetChatSocket();
    };

    return (
        <AuthContext.Provider
            value={{
                authTokens,
                setAuthTokens: setTokens,
                deleteAuthTokens: deleteTokens
            }}>
            <Router>
                <Switch>
                    <PrivateRoute path="/chat" component={Chat}/>
                    <Route exact path="/login" component={Login}/>
                    <Route exact path="/register" component={Register}/>
                    <Route path={"/about"}>
                        <h1>about</h1>
                    </Route>
                    <PrivateRoute exact path="/" component={Chat}/>
                    <Route path="*">
                        <NoMatch/>
                    </Route>
                </Switch>
            </Router>
        </AuthContext.Provider>
    );
}

function NoMatch() {
  let location = useLocation();

  return (
      <div>
        <h3>
          No match for <code>{location.pathname}</code>
        </h3>
      </div>
  );
}
