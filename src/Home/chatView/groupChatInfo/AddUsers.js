import React from "react";
import {useHistory} from "react-router-dom";
import {makeRequest} from "../../../global/requests";
import SelectUsers from "../../selectUsers/SelectUsers";
import {ModalHeader, ModalMain} from "../../../utilComp/Modal";
import Dummy from "../../../utilComp/Dummy";

export default function AddUsers(props){

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
        <Dummy>
            <ModalHeader>
                <h2>
                    Benutzer hinzufügen
                </h2>
            </ModalHeader>
            <ModalMain>
                <SelectUsers
                    onNext={submitUsers}
                    loadUsers={loadUsers}
                />
            </ModalMain>
        </Dummy>
    )
}