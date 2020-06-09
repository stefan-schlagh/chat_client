import React,{Component} from "react";
import Header from "./Header/Header";
import {logout} from "../Auth/Auth";
import Responsive from "../responsive/Responsive";
import GridBigScreens from "./GridBigScreens";
import RouterSmallScreens from "./RouterSmallScreens";
import chatSocket from "../chatData/chatSocket";
import {initGlobal} from "../global/global";

initGlobal();

export default class Chat extends Component{

    constructor(props) {
        super(props);
        this.state = {
            /*
                the current chat of the user
             */
            currentChat: {
                type: '',
                id: 0
            },
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
                only relevant for mobile devices, is shown at btn back
                gets incremented if there is a message in a non-selected chat
             */
            newMessages: 0,
            /*
                is shown at the user-icon
             */
            notifications: 0
        };
        /*
            if chatsocket is undefined, it gets initialized
         */
        if(!chatSocket.initCalled) {
            chatSocket.init().then(r => {});
        }

    }

    componentDidMount() {
        //event-listener: gets triggered if current chat changes
        chatSocket.event.on('currentChat changed',this.currentChatChanged);
        //event-lister: gets triggered if there is a new message
        chatSocket.event.on('new message',this.newMsg);
    }

    currentChatChanged = currentChat => {
        /*
            current chat gets changed
         */
        if(currentChat === null) {
            this.setState({
                currentChat: {
                    type: '',
                    id: 0
                }
            });
        }else{
            this.setState({
                currentChat: {
                    type: currentChat.type,
                    id: currentChat.id
                },
                newMessages: chatSocket.getNumberNewMessages()
            });
        }
    };

    logout = () => {
        logout().then(() => {
            // eslint-disable-next-line no-restricted-globals
            location.reload();
        });
    };

    /*
        gets called if there is a new msg
     */
    newMsg = () => {
        /*
            newMsg gets set
         */
        this.setState(state => ({
            newMessages: chatSocket.getNumberNewMessages()
        }));
    };

    render() {

        const setState = this.setState.bind(this);

        return (
            <div className="h-100">
                <Header
                    logout={this.logout}
                    headerLeft={{
                        newMessages: this.state.newMessages
                    }}
                />

                <Responsive displayIn={["Mobile"]}>
                    <RouterSmallScreens
                        currentChat={this.state.currentChat}
                        setParentState={setState}
                    />
                </Responsive>

                <Responsive displayIn={["Laptop","Tablet"]}>

                    <GridBigScreens
                        newMessages={this.state.newMessages}
                        setParentState={setState}
                    />

                </Responsive>

            </div>
        );
    }
    componentWillUnmount() {
        /*
            event-listeners get removed
         */
        chatSocket.event.rm('currentChat changed',this.currentChatChanged);
        chatSocket.event.rm('new message',this.newMsg);
    }
}