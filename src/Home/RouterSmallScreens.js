import React from "react";
import {
    Switch,
    Route,
    useRouteMatch
} from "react-router-dom";
import ChatList from "./allChats/ChatList";
import Dummy from "../utilComp/Dummy";

export default function RouterSmallScreens(props){

    let { path, url } = useRouteMatch();

    if (props.modals.anyShown) {

        if (props.modals['settings'].show) {
            return (
                <h1>Settings</h1>

            )
        }
        if (this.state.modals['userInfo'].show) {
            return (
                <h1>Du</h1>
            )
        }
    }

    const showChatInfoTop = val => {
        props.setParentState(state => {
            if(state.showChatInfoTop !== val)
                return {
                    showChatInfoTop: val
                }
        });
    };


    return(
        <Switch>
            <Route exact path={path}>
                <ChatList
                    paddingTop="20px"
                />
                <Dummy
                    didMount={() => {showChatInfoTop(false)}}
                />
            </Route>
            <Route path={`${path}/user/:uid`}>
                <h3>Normalchat</h3>
                <Dummy
                    didMount={() => {showChatInfoTop(true)}}
                />
            </Route>
            <Route exact path={`${path}/:gcid`}>
                <h3>Groupchat</h3>
                <Dummy
                    didMount={() => {showChatInfoTop(true)}}
                />
            </Route>
            <Route exact path={`${path}/:gcid/info`}>
                <h3>info</h3>
                <Dummy
                    didMount={() => {showChatInfoTop(true)}}
                />
            </Route>
            <Route path = "*">
                <h3>Not found!</h3>
            </Route>
        </Switch>
    )

}