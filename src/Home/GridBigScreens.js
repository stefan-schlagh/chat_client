import React,{useEffect} from "react";
import {
    Switch,
    Route,
    useRouteMatch,
    useParams
} from "react-router-dom";
import ChatList from "./allChats/ChatList";
import {NormalChatView,GroupChatView,GroupChatInfoView} from "./chatView/NormalChatView";
import ModalRouterBigScreens from "./ModalRouterBigScreens";

export default function GridBigScreens(props){

    let { path, url } = useRouteMatch();
    let params = useParams();


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
            <div className="col-md-5 col-lg-4 col-xl-3 d-none d-md-block pr-3 h-100">

                <ChatList
                    setHomeState={props.setParentState}
                />
            </div>
            <div className="col-md-7 col-lg-8 col-xl-9 col-overflow"
                 style={{padding:'0'}}
            >

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
                    <Route path={`${path}/group/:gcid`}>
                        <ModalRouterBigScreens>
                            <GroupChatView/>
                        </ModalRouterBigScreens>
                    </Route>
                    <Route path={`${path}/group/:gcid/info`}>
                        <ModalRouterBigScreens>
                            <GroupChatInfoView/>
                        </ModalRouterBigScreens>
                    </Route>
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
