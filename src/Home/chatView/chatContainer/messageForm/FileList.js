import React,{Component} from "react";

export class FileList extends Component {

    deleteFile = file => {
        this.props.deleteFile(file)
    }

    render() {
        return(
            <div className={"file-list"}>
                {this.props.files.map((item) => (
                    <div className="file">
                        <i className="far fa-file"/>
                        &nbsp;{item.fileName}
                        <span className="close"
                              onClick={() => this.deleteFile(item)}>
                            x
                        </span>
                    </div>
                ))}
            </div>
        )
    }
}