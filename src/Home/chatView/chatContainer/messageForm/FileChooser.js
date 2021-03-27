import React,{Component} from "react";
import {makeRequest} from "../../../../global/requests";

import './fileList.scss'

export default class FileChooser extends Component {

    files;

    constructor(props) {
        super(props);
        this.assignFilesRef = this.assignFilesRef.bind(this);
    }

    assignFilesRef = target => {
        this.files = target
    }

    uploadFiles = async () => {
        const files =  this.files.files;
        const fileArray = []
        for(const file of files){
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
            }catch (err) {
                console.log(err)
            }
        }
        this.props.onFileUpload(fileArray)
    }

    render() {
        return(
            <i className="fas fa-paperclip fa-2x file-chooser"
               onClick={() => this.files.click()}>
                <input
                    type="file"
                    className="fileInput"
                    name="files"
                    multiple
                    ref={this.assignFilesRef}
                    onChange={this.uploadFiles}
                />
            </i>
        )
    }
}