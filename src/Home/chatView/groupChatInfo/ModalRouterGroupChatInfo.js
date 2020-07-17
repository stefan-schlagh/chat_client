import React from "react";
import {Route, Switch, useRouteMatch} from "react-router-dom";
import Modal from "../../../utilComp/Modal";
import AddUsers from "./AddUsers";
import GroupChatInfo from "./GroupChatInfo";
import Responsive from "../../../responsive/Responsive";
import Dummy from "../../../utilComp/Dummy";

export default function ModalRouterGroupChatInfo(props){

    let { path } = useRouteMatch();

    const groupChatInfo = (
        <GroupChatInfo
            gcid={props.gcid}
            data={props.data}
        />
    );

    return(
        <Dummy>
            <Responsive displayIn={["Mobile"]}>
                <Switch>
                    <Route path={`${path}/addUsers`}>
                        <AddUsers
                            gcid={props.gcid}
                        />
                    </Route>
                    <Route path={"*"}>
                        {groupChatInfo}
                    </Route>
                </Switch>
            </Responsive>
            <Responsive displayIn={["Laptop","Tablet"]}>
                <Switch>
                    <Route path={`${path}/addUsers`}>
                        <Modal>
                                <AddUsers
                                    gcid={props.gcid}
                                />
                        </Modal>
                    </Route>
                </Switch>
                {groupChatInfo}
            </Responsive>
        </Dummy>
    )
}