import React,{Component} from "react";
import Header from "./Header/Header";

export default class Chat extends Component{
    constructor(props) {
        super(props);

    }
    render() {
        return (
            <div className="h-100">
                <Header />
                <div>
                    <h1>Home</h1>
                </div>
            </div>
        );
    }

}