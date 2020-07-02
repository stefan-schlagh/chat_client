import {UsernameSpan} from "../../Home/chatView/chatContainer/message/Message";
import {globalData} from "../../global/globalData";
import React from "react";
import chatSocket from "../chatSocket";

export function getStatusMessageString(msg){

    const middleStringD = {
        hatHast: 0,
        ist: 1
    };

    const statusMessagesD = [
        "den chat erstellt",
        "hinzugefügt",
        "entfernt",
        "dem chat beigetreten",
        "den chat verlassen",
        "zum Admin gemacht",
        "nicht mehr Admin"
    ];

    return getStatusMessageStringD();

    function getStatusMessageStringD() {

        const userTop = msg.userTop;
        const passiveUsers = msg.content.passiveUsers;

        switch (msg.content.type) {

            case globalData.statusMessageTypes.chatCreated:
                return renderStringD(
                    userTop,
                    middleStringD.hatHast,
                    passiveUsers,
                    globalData.statusMessageTypes.chatCreated
                );

            case globalData.statusMessageTypes.usersAdded:
                return renderStringD(
                    userTop,
                    middleStringD.hatHast,
                    passiveUsers,
                    globalData.statusMessageTypes.usersAdded
                );

            case globalData.statusMessageTypes.usersRemoved:
                return renderStringD(
                    userTop,
                    middleStringD.hatHast,
                    passiveUsers,
                    globalData.statusMessageTypes.usersRemoved
                );

            case globalData.statusMessageTypes.usersJoined:
                return renderStringD(
                    userTop,
                    middleStringD.ist,
                    [],
                    globalData.statusMessageTypes.usersJoined
                );

            case globalData.statusMessageTypes.usersLeft:
                return renderStringD(
                    userTop,
                    middleStringD.hatHast,
                    [],
                    globalData.statusMessageTypes.usersLeft
                );

            case globalData.statusMessageTypes.usersMadeAdmin:
                return renderStringD(
                    userTop,
                    middleStringD.hatHast,
                    passiveUsers,
                    globalData.statusMessageTypes.usersMadeAdmin
                );

            case globalData.statusMessageTypes.usersRemovedAdmin:
                return renderStringD(
                    userTop,
                    middleStringD.ist,
                    [],
                    globalData.statusMessageTypes.usersRemovedAdmin
                );

            default:
                break;
        }
    }

    function renderStringD(userTop,middle,passiveUsers,statusMessage){

        function getMiddleString(){

            switch (middle) {

                case middleStringD.hatHast:
                    return msg.bySelf ? " hast " : " hat ";

                case middleStringD.ist:
                    return ' ist';
            }
        }

        function getPassiveUsers(){

            if(passiveUsers.length < 1 ){
                return "";
            }else if(passiveUsers.length === 1){

                const user = chatSocket.users.get(passiveUsers[0]);

                if(user)
                    return(
                        <UsernameSpan user={user}/>
                    );
                else
                    return "1 Benutzer";

            }else{
                return passiveUsers.length + " Benutzer";
            }
        }

        return(
            <span>
                <UsernameSpan user={msg.userTop}/>
                {getMiddleString()}
                {getPassiveUsers()}
                {" " + statusMessagesD[statusMessage]}
            </span>
        )
    }

}
export const statusMessages =
    [
        "den chat erstellt",
        "hinzugefügt",
        "entfernt",
        "beigetreten",
        "den chat verlassen",
        "zum Admin gemacht",
        "Admin entzogen"
    ];