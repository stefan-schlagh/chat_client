import React,{Component} from "react";
import Header from "./Header/Header";
import Responsive from "../responsive/Responsive";
import GridBigScreens from "./GridBigScreens";
import RouterSmallScreens from "./RouterSmallScreens";
import chatSocket from "../chatData/chatSocket";

export default class Chat extends Component{

    constructor(props) {
        super(props);
        this.state = {
            /*
                which modal is currently open
                    0: none
             */
            modal: 0,
            /*
                info about the currently open modal
             */
            modalInfo: null,
            /*
                is shown at the user-icon
             */
            notifications: 0
        };
        /*
            if chatsocket is undefined, it gets initialized
         */
        if (!chatSocket.initCalled) {
            chatSocket.init().then(r => {
            });
        }

    }

    render() {

        return (
            <div className="h-100">

                <Header/>

                <Responsive displayIn={["Mobile"]}>

                    <RouterSmallScreens />
                </Responsive>

                <Responsive displayIn={["Laptop","Tablet"]}>

                    <GridBigScreens/>
                </Responsive>

            </div>
        );
    }
}