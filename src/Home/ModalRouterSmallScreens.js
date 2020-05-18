import React from "react";
import {
    Switch,
    Route,
    useRouteMatch
} from "react-router-dom";
import NewChat from "./newChat/NewChat";
/*
    modals are always at the end of the url
 */
export default function ModalRouterSmallScreens(props){

    let { path } = useRouteMatch();

    return(
        <Switch>
            <Route path={`${path}/newChat`}>
                <NewChat />
            </Route>
            <Route path={`${path}/userInfo/:uidM`}>
                <h3>userInfo</h3>
            </Route>
            <Route path={`${path}/settings`}>
                <h3>settings</h3>
            </Route>
            <Route path="*">
                {props.children}
            </Route>
        </Switch>
    )
}