import React,{useState} from "react";
import {getFile} from "./File";

export function Image(props){

    const [loaded,setLoaded] = useState(false)
    const [loading,setLoading] = useState(false)
    const [url,setUrl] = useState(null)

    if(loaded && url !== null)
        return(
            <img src={url} alt={"by user"}/>
        )
    else {
        // if nor loading, load file
        if(!loading) {
            setLoading(true)
            getFile(props.file)
                .then(_url => {
                    setUrl(_url)
                    setLoaded(true)
                    setLoading(false)
                })
                .catch(err => {
                    console.error(err)
                })
        }
        return null
    }
}