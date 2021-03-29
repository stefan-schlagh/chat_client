import React from "react";
import { useAlert } from "react-alert";
import {makeRequest} from "../../../../global/requests";

import './fileList.scss'

export default function FileChooser(props) {

    let filesRef = null;
    const alert = useAlert();

    const uploadFiles = async () => {
        const files =  filesRef.files;
        if(props.files.length + files.length <= 10) {
            const fileArray = []
            for (const file of files) {
                if(file.length < 15000000)
                    try {
                        const response = await makeRequest('/message/file/' + file.name, {
                            body: file,
                            method: 'PUT',// or 'PUT',
                            headers: {
                                'Content-type': file.type // likely there for common types
                            }
                        })
                        if (response.ok) {
                            const data = await response.json()
                            fileArray.push({
                                fid: data.fid,
                                mimeType: file.type,
                                fileName: file.name
                            })
                        }
                    } catch (err) {
                        console.log(err)
                    }
                else
                    alert.error("Datei zu groß!");
            }
            props.onFileUpload(fileArray)
        }else
            alert.error("Zu viele Dateien!");
    }
    return(
        <i className="fas fa-paperclip fa-2x file-chooser"
           onClick={() => filesRef.click()}>
            <input
                type="file"
                className="fileInput"
                name="files"
                multiple
                ref={_filesRef => filesRef = _filesRef}
                onChange={uploadFiles}
            />
        </i>
    )
}