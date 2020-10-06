import React from "react";
import {useHistory} from "react-router-dom";
import SelectUsers from "../../selectUsers/SelectUsers";
import {ModalHeader, ModalMain} from "../../../utilComp/Modal";
import Dummy from "../../../utilComp/Dummy";
import {addMembers, fetchUsersNotInGroup} from "./apiCalls";
/*
    props:
        gcid: id of the groupChat
 */
export default function AddUsers(props){

    let history = useHistory();

    const submitUsers = async (selectedUsers) => {
        /*
            addMembers call returns nothing
         */
        try{
            await addMembers(props.gcid,selectedUsers);
            /*
                if ok, modal is closed
             */
            history.goBack();
        }catch (e){
            //TODO: error message
        }
    };

    const loadUsers = async (
        searchValue,
        numAlreadyLoaded
    ) => {

        return await fetchUsersNotInGroup(
            props.gcid,{
                search: searchValue,
                limit: 10,
                start: numAlreadyLoaded
            }
        )
    };

    return(
        <Dummy>
            <ModalHeader>
                <h2>
                    Benutzer hinzufügen
                </h2>
            </ModalHeader>
            <ModalMain>
                <div className={"addMembers"}>
                    <SelectUsers
                        onNext={submitUsers}
                        loadUsers={loadUsers}
                    />
                </div>
            </ModalMain>
        </Dummy>
    )
}