import React from "react";
import LazyLoad from 'react-lazyload';
import {UsernameSpan} from "./Message";
import File from "./File";
import {Image} from "./Image";

export default function NormalMessage(props){

    const msg = props.msg;

    const {files,images} = extractImages(msg.content.files)

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
                {images.map((item,index) => (
                    <Image key={index} file={item}/>
                ))}
                {files.map((item,index) => (
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
function extractImages(allFiles){

    const files = []
    const images = []

    for(const file of allFiles){
        if(isImage(file.mimeType))
            images.push(file)
        else
            files.push(file)
    }

    return {
        files: files,
        images: images
    }
}
function isImage(type){
    return type === 'image/gif'
        || type === 'image/jpeg'
        || type === 'image/jpg'
        || type === 'image/png'
        || type === 'image/jpeg'
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