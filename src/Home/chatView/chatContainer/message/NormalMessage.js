import React from "react";
import {UsernameSpan} from "./Message";
import File from "./File";

export default function NormalMessage(props){

    const msg = props.msg;

    return(
        <div className={
            (msg.bySelf ? "self " : "other ") +
            "msg-container"
        }>
            {msg.userTop ?
                <div className="w-100">
                    <strong className="header">
                        <UsernameSpan user={msg.userTop}/>
                    </strong>
                </div>
                : null}
            <div className="content">
                {msg.content.files.map((item,index) => (
                    <File key={index} file={item}/>
                ))}
                <MessageText
                    text={msg.content.text}
                />
            </div>
            <div className="date-outer">
                <div className="date">
                    {msg.mDateString}
                </div>
            </div>
        </div>
    )
}
function MessageText(props){

    const linkRegex = new RegExp(/(\b(?:https?:\/\/)?(?:(?:[a-z]+\.)+)[^\s,]+\b)/g)
    const httpRegex = new RegExp(/(https?:\/\/)/igm);

    function getHref(word){
        if(httpRegex.test(word))
            return word;
        else {
            return "https://" + word
        }
    }
    // split text
    const words = props.text.split(linkRegex)

    return (
        <p>
            {words.map((word) => {
                if(linkRegex.test(word))
                    return <a href={getHref(word)} target={"_blank"} rel={"noreferrer"}>{word}</a>
                else
                    return word
            })}
        </p>
    )
}