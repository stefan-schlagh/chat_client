import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    useLocation,
    Redirect
} from "react-router-dom";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import 'bootstrap/dist/css/bootstrap.css';
import {loggedIn} from "./Auth/Auth";

export default function App() {
  return (
      <Router>
        <div className="h-100">

          {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
            <div className="h-100">
                <Switch>
                    <Route path="/chat">
                        {console.log('yyy')}
                        {redirectToLogin('chat')}
                    </Route>
                    <Route exact path="/login">
                        {showLogin()}
                    </Route>
                    <Route exact path="/register">
                        <Register />
                    </Route>
                    <Route exact path="/">
                        {redirectToLogin('/')}
                    </Route>
                    <Route path="*">
                      <NoMatch />
                    </Route>
                </Switch>
            </div>
        </div>
      </Router>
  );
}

function Chat() {
  return <h2>Home</h2>;
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
function showLogin(){
    if(loggedIn)
        return (
            <Redirect
                to={{
                    pathname: "/chat"
                }}
            />
        );
    else
        return(
            <Login />
        );
}
function redirectToLogin(location){
    if(loggedIn) {
        if (location === 'chat') {
            console.log('chat');
            return (
                <Chat/>
            );
        }
        else
            return (
                <Redirect
                    to={{
                        pathname: "/chat"
                    }}
                />
            )
    }else {
        return(
            <Redirect
                to={{
                    pathname: "/login"
                }}
            />
        )
    }
}
/*function redirect(location,callback){
    isLoggedIn(loggedIn => {
        let redirected = false;
        let rc;
        /*
            wenn eingeloggt --> redirect auf Startseite

        if(loggedIn && (location === '/register' || location === '/login')){
            redirected = true;
            rc =  (
                <Redirect
                    to={{
                        pathname: "/"
                    }}
                />
            );
        }
        /*
            wenn nicht eingeloggt --> redirect auf login

        else if(!loggedIn && location === '/chat'){
            redirected = true;
            rc = (
                <Redirect
                    to={{
                        pathname: "/login"
                    }}
                />
            );
        }
        callback(redirected,rc);
    });
}*/