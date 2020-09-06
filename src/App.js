import React, {useDispatch,useEffect} from "reactn";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
    useLocation
} from "react-router-dom";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import PrivateRoute from "./utilComp/PrivateRoute";
import Chat from "./Home/Home";
import About from "./About/About";

import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

import {initGlobal} from "./global/global";

initGlobal();

export default function App() {

    const dispatch = useDispatch();

    useEffect(() => {
        const existingTokens = JSON.parse(localStorage.getItem("authTokens"));
        dispatch.initAuthTokens(existingTokens);
    },[]);

    return (
        <Router>
            <Switch>
                <PrivateRoute path="/chat" component={Chat}/>
                <Route exact path="/login" component={Login}/>
                <Route exact path="/register" component={Register}/>
                <Route path={"/about"}>
                    <About/>
                </Route>
                <Route exact path="/">
                    <Redirect to={"/chat"}/>
                </Route>
                <Route path="*">
                    <NoMatch/>
                </Route>
            </Switch>
        </Router>
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
