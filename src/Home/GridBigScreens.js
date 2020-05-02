import React from "react";
import {
    Switch,
    Route,
    useRouteMatch
} from "react-router-dom";
import { withRouter } from "react-router";

export default function GridBigScreens(){

    let { path, url } = useRouteMatch();

    return(
        <div>
            <div className="chats">

            </div>

            <Switch>
                <Route exact path={path}>
                    <h1>noch kein chat ausgewählt</h1>
                </Route>
                <Route path={`${path}/user/:uid`}>
                    <h3>Normalchat</h3>
                </Route>
                <Route exact path={`${path}/:gcid`}>
                    <h3>Groupchat</h3>
                </Route>
                <Route exact path={`${path}/:gcid/info`}>
                    <h3>info</h3>
                </Route>
                <Route path = "*">
                    <h3>Not found!</h3>
                </Route>
            </Switch>
        </div>
    )
}
