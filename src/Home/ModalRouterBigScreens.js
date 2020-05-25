import React from "react";
import {
    Switch,
    Route,
    useRouteMatch
} from "react-router-dom";
import Modal from "../utilComp/Modal";
import NewChat from "./newChat/NewChat";
import Dummy from "../utilComp/Dummy";
import UserInfo from "./userInfo/UserInfo";
import UserItem from "./newChat/chooseUser/UserItem";
/*
    modals are always at the end of the url
 */
export default function ModalRouterBigScreens(props){

    let { path } = useRouteMatch();

    return(
        <Switch>
            <Route path={`${path}/newChat`}>
                {props.children}
                <Modal>
                    <NewChat />
                </Modal>
            </Route>
            <Route path={`${path}/userInfo/:uidInfo`} render={
                routeProps => (
                    <Dummy>
                        {props.children}
                        <Modal>
                            <UserInfo uid={routeProps.match.params.uidInfo} />
                        </Modal>
                    </Dummy>
                )
            } />
            <Route path={`${path}/settings`}>
                {props.children}
                <Modal>
                    <h3>settings</h3>
                </Modal>
            </Route>
            <Route path="*">
                {props.children}
            </Route>
        </Switch>
    )
}