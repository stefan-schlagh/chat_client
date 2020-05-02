import React from "react";
import {
    Switch,
    Route,
    useRouteMatch
} from "react-router-dom";
import ChatList from "./allChats/ChatList";

export default function RouterSmallScreens(){

    let { path, url } = useRouteMatch();

    return(
        <Switch>
            <Route exact path={path}>
                <ChatList
                    paddingTop="20px"
                />
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
    )
}