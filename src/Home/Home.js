import React,{Component} from "react";
import Header from "./Header/Header";
import {logout} from "../Auth/Auth";
import Modal from "../utilComp/Modal";
import Responsive from "../responsive/Responsive";
import GridBigScreens from "./GridBigScreens";
import RouterSmallScreens from "./RouterSmallScreens";
import chatSocket from "../chatData/chatSocket";
import NewChat from "./newChat/NewChat";

/*
    possible routes in /chat
 */
export const routes = {
    allChats: 0,
    normalChat: 1,
    groupChat: 2,
    groupChatInfo: 3
};
/*
    modals
 */
export const modals = {
    none: 0,
    settings: 1,
    userInfo: 2,
    newChat: 3
};

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
                current route where the user is inside /chat
             */
            currentRoute: routes.allChats,
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
        if(!chatSocket.socket) {
            chatSocket.init();
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

    closeModal = () => {
        this.setState({
            modal: modals.none
        })
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
        const showModals = () => {
            if(this.state.modal === modals.settings){
                return(
                    <Modal
                        hide={() => {
                            this.setState(state => ({
                                modal: modals.none
                            }));
                        }}
                    >
                        <h1>Settings</h1>
                    </Modal>
                )
            }
            if(this.state.modal === modals.userInfo){
                return(
                    <Modal
                        hide={() => {
                            this.setState(state => ({
                                modal: modals.none
                            }));
                        }}
                    >
                        <h1>Du</h1>
                    </Modal>
                )
            }
            if(this.state.modal === modals.newChat){
                return(
                    <Modal
                        hide={() => {
                            this.setState(state => ({
                                modal: modals.none
                            }));
                        }}
                    >
                        <NewChat
                            hide={() => {
                                this.setState(state => ({
                                    modal: modals.none
                                }));
                            }}
                        />
                    </Modal>
                )
            }
        };
        return (
            <div className="h-100">
                <Header
                    currentChat={this.state.currentChat}
                    setParentState={setState}
                    logout={this.logout}
                    headerLeft={{
                        currentRoute: this.state.currentRoute,
                        newMessages: this.state.newMessages,
                        modalOpen: this.state.modal !== modals.none
                    }}
                    closeModal={this.closeModal}
                />

                <Responsive displayIn={["Mobile"]}>
                    <RouterSmallScreens
                        modal={this.state.modal}
                        currentRoute={this.state.currentRoute}
                        currentChat={this.state.currentChat}
                        setParentState={setState}
                    />
                </Responsive>

                <Responsive displayIn={["Laptop","Tablet"]}>
                    {showModals()}

                    <GridBigScreens
                        currentRoute={this.state.currentRoute}
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