import React from "react";
import {makeRequest} from "../../../../global/requests";

export default function File(props){

    const getFile = async () => {
        const response = await makeRequest('/message/file/' + props.file.fid + '/' + props.file.fileName, {
            method: 'GET'
        })
        // https://stackoverflow.com/a/42274086/12913973
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = props.file.fileName;
        document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
        a.click();
        a.remove();  //afterwards we remove the element again
    }

    return(
        <div className="file">
            <i className="far fa-lg fa-file"/>
            &nbsp;
            {props.file.fileName}
            &nbsp;
            <div
                className="download"
                onClick={getFile}
            >
                <i className="fas fa-arrow-down"/>
            </div>
        </div>
    )
}