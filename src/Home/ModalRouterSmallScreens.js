import React from "react";
import {
    Switch,
    Route,
    useRouteMatch
} from "react-router-dom";
import NewChat from "./newChat/NewChat";
import UserInfo from "./userInfo/UserInfo";
import Settings from "./settings/Settings";
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
            <Route path={`${path}/userInfo/:uidInfo`} render={
                routeProps => (
                    <UserInfo uid={routeProps.match.params.uidInfo} />
                )
            } />
            <Route path={`${path}/settings`}>
                <Settings/>
            </Route>
            <Route path="*">
                {props.children}
            </Route>
        </Switch>
    )
}