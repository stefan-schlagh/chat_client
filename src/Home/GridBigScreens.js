import React,{useEffect} from "react";
import {
    Switch,
    Route,
    useRouteMatch,
    useParams
} from "react-router-dom";
import ChatList from "./allChats/ChatList";
import Dummy from "../utilComp/Dummy";
import {NormalChatView,GroupChatView,GroupChatInfoView} from "./chatView/NormalChatView";
import {routes} from "./Home";

export default function GridBigScreens(props){

    let { path, url } = useRouteMatch();
    let params = useParams();

    const nothingShown = () => {
        if(props.currentRoute !== routes.allChats) {
            props.setParentState({
                currentRoute: routes.allChats
            });
        }
    };

    const normalChatShown = () => {
        if(props.currentRoute !== routes.normalChat) {
            props.setParentState({
                currentRoute: routes.normalChat
            });
        }
    };

    const groupChatShown = () => {
        if(props.currentRoute !== routes.groupChat) {
            props.setParentState({
                currentRoute: routes.groupChat
            });
        }
    };

    const groupChatInfoShown = () => {
        if(props.currentRoute !== routes.groupChatInfo) {
            props.setParentState({
                currentRoute: routes.groupChatInfo
            });
        }
    };

    useEffect(() => {
       /*
            newMessages is set to 0, because big screen
        */
        if(props.newMessages !== 0)
            props.setParentState({
                newMessages: 0
            });
    });

    return(
        <div className="row w-100 justify-content-end row-height">
            <div className="col-md-5 col-lg-4 col-xl-3 d-none d-md-block pr-3 col-overflow">

                <ChatList />
            </div>
            <div className="col-md-7 col-lg-8 col-xl-9 col-overflow"
                 style={{padding:'0'}}
            >

                <Switch>
                    <Route exact path={path}>
                        <h1>noch kein chat ausgewählt</h1>
                        <Dummy
                            didUpdate={() => {
                                nothingShown()
                            }}
                        />
                    </Route>
                    <Route path={`${path}/user/:uid`}>
                        <NormalChatView />
                        <Dummy
                            didUpdate={() => {
                                normalChatShown()
                            }}
                        />
                    </Route>
                    <Route exact path={`${path}/:gcid`}>
                        <GroupChatView/>
                        <Dummy
                            didUpdate={() => {
                                groupChatShown()
                            }}
                        />
                    </Route>
                    <Route exact path={`${path}/:gcid/info`}>
                        <GroupChatInfoView/>
                        <Dummy
                            didUpdate={() => {
                                groupChatInfoShown()
                            }}
                        />
                    </Route>
                    <Route path = "*">
                        <h3>Not found!</h3>
                    </Route>
                </Switch>
            </div>
        </div>
    )
}
