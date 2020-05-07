import React from "react";
import {
    Switch,
    Route,
    useRouteMatch,
    useParams
} from "react-router-dom";
import ChatList from "./allChats/ChatList";
import Dummy from "../utilComp/Dummy";
import {NormalChatView,GroupChatView,GroupChatInfoView} from "./chatView/NormalChatView";

export default function GridBigScreens(props){

    let { path, url } = useRouteMatch();
    let params = useParams();

    const showChatInfoTop = val => {
       props.setParentState(state => {
           if(state.showChatInfoTop !== val)
               return {
                   showChatInfoTop: val
               }
       });
    };

    return(
        <div className="row w-100 justify-content-end row-height">
            <div className="col-md-5 col-lg-4 col-xl-3 d-none d-md-block pr-3 col-overflow">

                <ChatList />
            </div>
            <div className="col-md-7 col-lg-8 col-xl-9 col-overflow">

                <Switch>
                    <Route exact path={path}>
                        <h1>noch kein chat ausgewählt</h1>
                        <Dummy
                            didMount={() => {showChatInfoTop(false)}}
                        />
                    </Route>
                    <Route path={`${path}/user/:uid`}>
                        <NormalChatView />
                        <Dummy
                            didMount={() => {showChatInfoTop(true)}}
                        />
                    </Route>
                    <Route exact path={`${path}/:gcid`}>
                        <GroupChatView/>
                        <Dummy
                            didMount={() => {showChatInfoTop(true)}}
                        />
                    </Route>
                    <Route exact path={`${path}/:gcid/info`}>
                        <GroupChatInfoView/>
                        <Dummy
                            didMount={() => {showChatInfoTop(true)}}
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
