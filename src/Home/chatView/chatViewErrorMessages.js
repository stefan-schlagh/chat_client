import React from "react";

export function AddressNotValid() {
    return(
        <div>
            <h2>ungültige Addresse</h2>
        </div>
    );
}
export function CannotWriteYourself(){
    return(
        <div>
            <h2>Du kannst dir selbst nicht schreiben</h2>
        </div>
    );
}
export function BlockedByThisUser(){
    return(
        <div>
            <h2>Dieser User hat dich blockiert</h2>
        </div>
    );
}
export function UserNotExisting(){
    return(
        <div>
            <h2>Dieser User existiert nicht</h2>
        </div>
    );
}
export function NoMemberInPublicChat(){
    return (
        <div>
            <h2>Du bist nicht Mitglied in diesem chat jetzt beitreten</h2>
        </div>
    );
}
export function NoAuthorization(){
    return (
        <div>
            <h2>Du bist nicht dazu berechtigt diesen chat anzusehen</h2>
        </div>
    );
}
export function ChatNotExisting(){
    return (
        <div>
            <h2>Dieser Chat existiert nicht</h2>
        </div>
    );
}