import React from "react";
import {makeRequest} from "../../../../global/requests";

export default function File(props){

    const downloadFile = async () => {
        const url = await getFile(props.file)
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
                onClick={downloadFile}
            >
                <i className="fas fa-arrow-down"/>
            </div>
        </div>
    )
}
export async function getFile(file) {
    const response = await makeRequest('/message/file/' + file.fid + '/' + file.fileName, {
        method: 'GET'
    })
    const blob = await response.blob()
    return window.URL.createObjectURL(blob)
}