import React from "react";
import {
    Switch,
    Route,
    useRouteMatch
} from "react-router-dom";
import ChatList from "./allChats/ChatList";
import Dummy from "../utilComp/Dummy";
import chatSocket from "../chatData/chatSocket";
import {NormalChatView,GroupChatView,GroupChatInfoView} from "./chatView/NormalChatView";
import {routes} from "./Home";
import TypeMsgContainer from "./chatView/TypeMsgContainer";
import ModalRouterSmallScreens from "./ModalRouterSmallScreens";

export default function RouterSmallScreens(props){

    let { path } = useRouteMatch();


    const chatListShown = () => {
        if(props.currentRoute !== routes.allChats) {
            props.setParentState({
                currentRoute: routes.allChats
            });
            chatSocket.setCurrentChat(null);
        }
    };

    const normalChatShown = () => {
        if(props.currentRoute !== routes.normalChat) {
            props.setParentState({
                currentRoute: routes.normalChat
            });
        }
    };

    const renderTypeMsgContainer = () => {
        if(props.currentChat.type !== '' && props.currentChat.id !== 0){
            return(
                <TypeMsgContainer
                    chatType={props.currentChat.type}
                    chatId={props.currentChat.id}
                />
            )
        }
        return null;
    };

    return(
        <div className="row-height position-relative">
            <Switch>
                <Route path={`${path}/user/:uid`} render={
                    routeProps => (
                        <ModalRouterSmallScreens>
                            <NormalChatView
                                uid={routeProps.match.params.uid}
                            />
                            {renderTypeMsgContainer()}
                            <Dummy
                            didUpdate={() => {
                                normalChatShown();
                            }}
                            />
                        </ModalRouterSmallScreens>
                    )
                }>

                </Route>
                <Route path={`${path}/group/:gcid`}>
                    <GroupChatView/>
                    {renderTypeMsgContainer()}
                    <Dummy
                        didMount={() => {
                            props.setParentState({
                                currentRoute: routes.groupChat
                            });
                        }}
                    />
                </Route>
                <Route path={`${path}/group/:gcid/info`}>
                    <GroupChatInfoView/>
                    <Dummy
                        didMount={() => {
                            props.setParentState({
                                currentRoute: routes.groupChatInfo
                            });
                        }}
                    />
                </Route>
                <Route path={path}>
                    <ModalRouterSmallScreens>
                        <ChatList
                            paddingTop="20px"
                            setHomeState={props.setParentState}
                        />
                        <Dummy
                            didMount={() => {
                                chatListShown();
                            }}
                            didUpdate={() => {
                                chatListShown();
                            }}
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