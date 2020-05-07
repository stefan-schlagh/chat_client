import React from "react";

export default function ChatViewLoader (props){
    return(
        <div className="loader-init">
            <div className="col-sm-12 my-auto">
                <div className="init-container border rounded">
                    <div className="spinner-border text-secondary"
                         style={{
                             width: '15rem',
                             height: '15rem',
                             borderWidth: '0.5rem'
                         }}
                         role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                    <div className="loader-text">{props.msg}</div>
                </div>
            </div>
        </div>
    )
}