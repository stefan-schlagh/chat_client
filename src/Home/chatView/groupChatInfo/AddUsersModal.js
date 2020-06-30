import React from "react";
import {Route, Switch, useRouteMatch,useHistory} from "react-router-dom";
import Modal, {ModalHeader, ModalMain} from "../../../utilComp/Modal";
import {makeRequest} from "../../../global/requests";
import SelectUsers from "../../selectUsers/SelectUsers";

export default function AddUsersModal(props){

    let { path } = useRouteMatch();
    let history = useHistory();

    const submitUsers = async (selectedUsers) => {

        const config = {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                users: selectedUsers
            })
        };

        const response =
            await makeRequest(
                '/group/' + props.gcid + '/members',
                config
            );
        /*
            if ok, modal is closed
         */
        if(response.ok)
            history.goBack();

    };

    const loadUsers = async (
        searchValue,
        numAlreadyLoaded
    ) => {

        const config = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                search: searchValue,
                limit: 10,
                start: numAlreadyLoaded
            })
        };
        /*
            response is returned
         */
        return await makeRequest(
            '/user/notInGroup/' + props.gcid,
            config
        );
    };

    return(
        <Switch>
            <Route path={`${path}/addUsers`}>
                <Modal>
                    <ModalHeader>
                        <h1>
                            Benutzer hinzufügen
                        </h1>
                    </ModalHeader>
                    <ModalMain>
                        <div className="addUsers">
                            <SelectUsers
                                onNext={submitUsers}
                                loadUsers={loadUsers}
                            />
                        </div>
                    </ModalMain>
                </Modal>
            </Route>
        </Switch>
    )
}