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
import {routes,modals} from "./Home";
import TypeMsgContainer from "./chatView/TypeMsgContainer";

export default function RouterSmallScreens(props){

    let { path, url } = useRouteMatch();

    /*
        is a 'modal' open?
        if --> render them instead of switch
     */
    if (props.modal !== modals.none) {

        if (props.modal === modals.settings) {
            return (
                <h1>Settings</h1>

            )
        }
        if (props.modal === modals.userInfo) {
            return (
                <h1>Du</h1>
            )
        }
    }

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
                <Route exact path={path}>
                    <ChatList
                        paddingTop="20px"
                    />
                    <Dummy
                        didUpdate={() => {
                            chatListShown();
                        }}
                    />
                </Route>
                <Route path={`${path}/user/:uid`}>
                    <NormalChatView/>
                    {renderTypeMsgContainer()}
                    <Dummy
                        didUpdate={() => {
                            normalChatShown();
                        }}
                    />
                </Route>
                <Route exact path={`${path}/:gcid`}>
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
                <Route exact path={`${path}/:gcid/info`}>
                    <GroupChatInfoView/>
                    <Dummy
                        didMount={() => {
                            props.setParentState({
                                currentRoute: routes.groupChatInfo
                            });
                        }}
                    />
                </Route>
                <Route path = "*">
                    <h3>Not found!</h3>
                </Route>
            </Switch>
        </div>
    )

}