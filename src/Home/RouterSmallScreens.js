import React,{useGlobal} from "reactn";
import {
    Switch,
    Route,
    useRouteMatch
} from "react-router-dom";
import ChatList from "./allChats/ChatList";
import NormalChatView from "./chatView/NormalChatView";
import GroupChatView,{groupChatTabs} from "./chatView/GroupChatView";
import TypeMsgContainer from "./chatView/TypeMsgContainer";
import ModalRouterSmallScreens from "./ModalRouterSmallScreens";

export default function RouterSmallScreens(props){

    let { path } = useRouteMatch();
    const global = useGlobal();

    const renderTypeMsgContainer = () => {
        if(global.currentChat.type !== '' && global.currentChat.id !== 0){
            return(
                <TypeMsgContainer
                    chatType={global.currentChat.type}
                    chatId={global.currentChat.id}
                />
            )
        }
        return null;
    };

    return(
        <div className="main-container">
            <Switch>
                <Route path={`${path}/user/:uid`} render={
                    routeProps => (
                        <ModalRouterSmallScreens>
                            <NormalChatView
                                uid={routeProps.match.params.uid}
                            />
                            {renderTypeMsgContainer()}
                        </ModalRouterSmallScreens>
                    )
                }>
                </Route>
                <Route path={`${path}/group/:gcid`} render={
                    routeProps => (
                        <ModalRouterSmallScreens>
                            <GroupChatView
                                gcid={routeProps.match.params.gcid}
                                tab={groupChatTabs.chat}
                            />
                            {renderTypeMsgContainer()}
                        </ModalRouterSmallScreens>
                    )
                } />
                <Route path={`${path}/groupInfo/:gcid`} render={
                    routeProps => (
                        <ModalRouterSmallScreens>
                            <GroupChatView
                                gcid={routeProps.match.params.gcid}
                                tab={groupChatTabs.info}
                            />
                        </ModalRouterSmallScreens>
                    )
                } />
                <Route path={path}>
                    <ModalRouterSmallScreens>
                        <ChatList
                            paddingTop="20px"
                        />
                    </ModalRouterSmallScreens>
                </Route>
                <Route path = "*">
                    <h3>Not found!</h3>
                </Route>
            </Switch>
        </div>
    )

}