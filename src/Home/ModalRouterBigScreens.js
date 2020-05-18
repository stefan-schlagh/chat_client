import React from "react";
import {
    Switch,
    Route,
    useRouteMatch
} from "react-router-dom";
import Modal from "../utilComp/Modal";
import NewChat from "./newChat/NewChat";
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
            <Route path={`${path}/userInfo/:uidM`}>
                {props.children}
                <Modal>
                    <h3>userInfo</h3>
                </Modal>
            </Route>
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