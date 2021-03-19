import {UsernameSpan} from "../../Home/chatView/chatContainer/message/Message";
import {globalData} from "../../global/globalData";
import React from "react";
import chatSocket from "../chatSocket";

export const middleStringD = {
    hatHast: 0,
    ist: 1
};

export const statusMessagesD = [
    "den Chat erstellt",            //0
    "zum Chat hinzugefügt",         //1
    "aus dem Chat entfernt",        //2
    "dem Chat beigetreten",         //3
    "den Chat verlassen",           //4
    "zum Admin befördert",          //5
    "den Admin-Status entfernt",    //6
    "nicht mehr Admin",             //7
    "den Chatnamen geändert",       //8
    "die Chat-Beschreibung geändert",    //9
    "Sichtbarkeit des Chats geändert", //10
];

export function getStatusMessageString(msg,useReact){

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

            case globalData.statusMessageTypes.userResignedAdmin:
                return renderStringD(
                    userTop,
                    middleStringD.ist,
                    [],
                    globalData.statusMessageTypes.userResignedAdmin
                )

            case globalData.statusMessageTypes.chatNameChanged:
                return renderStringD(
                    userTop,
                    middleStringD.hatHast,
                    [],
                    globalData.statusMessageTypes.chatNameChanged
                )

            case globalData.statusMessageTypes.descriptionChanged:
                return renderStringD(
                    userTop,
                    middleStringD.hatHast,
                    [],
                    globalData.statusMessageTypes.descriptionChanged
                )

            case globalData.statusMessageTypes.isPublicChanged:
                return renderStringD(
                    userTop,
                    middleStringD.hatHast,
                    [],
                    globalData.statusMessageTypes.isPublicChanged
                )

            default:
                break;
        }
    }

    function renderStringD(userTop,middle,passiveUsers,statusMessage){

        function getMiddleString(){

            // eslint-disable-next-line default-case
            switch (middle) {

                case middleStringD.hatHast:
                    return msg.bySelf ? ' hast ' : ' hat ';

                case middleStringD.ist:
                    return msg.bySelf ? ' bist ' : ' ist ';
            }
        }

        function getPassiveUsers(){

            if(passiveUsers.length < 1 ){
                return "";
            }else if(passiveUsers.length === 1){

                if(uidSelfInPassiveUsers())
                    return "dich ";
                else {
                    const user = chatSocket.users.get(passiveUsers[0]);

                    if (user)
                        if (useReact)
                            return (
                                <UsernameSpan user={user}/>
                            );
                        else
                            return user.username;
                    else
                        return "1 Benutzer";
                }
            }else{
                if(passiveUsers.length === 2 && uidSelfInPassiveUsers())
                    return "dich und einen weiteren Benutzer";
                else if(uidSelfInPassiveUsers())
                    return "dich und " + (passiveUsers.length - 1) + " weitere Benutzer "
                else
                    return passiveUsers.length + " Benutzer";
            }
        }

        function uidSelfInPassiveUsers() {
            for(const passiveUser of passiveUsers){
                if(passiveUser === chatSocket.userSelf.uid)
                    return true;
            }
            return false;
        }

        function getTString(){
            return " " + statusMessagesD[statusMessage];
        }

        if(useReact)
            return(
                <span>
                    <UsernameSpan user={msg.userTop}/>
                    {getMiddleString()}
                    {getPassiveUsers()}
                    {getTString()}
                </span>
            );
        else
            return msg.userTop.username + getMiddleString() + getPassiveUsers() + getTString();
    }

}