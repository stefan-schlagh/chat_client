import React from "react";
import {
    Switch,
    Route,
    useRouteMatch
} from "react-router-dom";
import ChatList from "./allChats/ChatList";
import NormalChatView from "./chatView/NormalChatView";
import GroupChatView,{groupChatTabs} from "./chatView/GroupChatView";
import ModalRouterBigScreens from "./ModalRouterBigScreens";

export default function GridBigScreens(props){

    const { path } = useRouteMatch();

    return(
        <div className="main-container">
            <div className="mc-left">

                <ChatList />
            </div>
            <div className="mc-right">

                <Switch>
                    <Route path={`${path}/user/:uid`} render={
                        routeProps => (
                            <ModalRouterBigScreens>
                                <NormalChatView
                                    uid={routeProps.match.params.uid}
                                />
                            </ModalRouterBigScreens>
                        )
                    } />
                    <Route path={`${path}/group/:gcid`} render={
                        routeProps => (
                            <ModalRouterBigScreens>
                                <GroupChatView
                                    gcid={routeProps.match.params.gcid}
                                    tab={groupChatTabs.chat}
                                />
                            </ModalRouterBigScreens>
                        )
                    } />
                    <Route path={`${path}/groupInfo/:gcid`} render={
                        routeProps => (
                            <ModalRouterBigScreens>
                                <GroupChatView
                                    gcid={routeProps.match.params.gcid}
                                    tab={groupChatTabs.info}
                                />
                            </ModalRouterBigScreens>
                        )
                    } />
                    <Route path={path}>
                        <ModalRouterBigScreens>
                            <h1>noch kein chat ausgewählt</h1>
                        </ModalRouterBigScreens>
                    </Route>
                </Switch>
            </div>
        </div>
    )
}
