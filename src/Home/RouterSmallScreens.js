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
    const [global,setGlobal] = useGlobal();

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
            <Switch>
                <Route path={`${path}/user/:uid`} render={
                    routeProps => (
                        <ModalRouterSmallScreens>
                            <div className="main-container">
                                <NormalChatView
                                    uid={routeProps.match.params.uid}
                                />
                            </div>
                            {renderTypeMsgContainer()}
                        </ModalRouterSmallScreens>
                    )
                }>
                </Route>
                <Route path={`${path}/group/:gcid`} render={
                    routeProps => (
                        <ModalRouterSmallScreens>
                            <div className="main-container">
                                <GroupChatView
                                    gcid={routeProps.match.params.gcid}
                                    tab={groupChatTabs.chat}
                                />
                            </div>
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
                        <div className="chat-list-outer-small">
                            <ChatList/>
                        </div>
                    </ModalRouterSmallScreens>
                </Route>
                <Route path = "*">
                    <h3>Not found!</h3>
                </Route>
            </Switch>
    )

}