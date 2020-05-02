import React,{Component} from "react";
import Header from "./Header/Header";
import {logout} from "../Auth/Auth";
import Modal from "../utilComp/Modal";
import Responsive from "../responsive/Responsive";
import GridBigScreens from "./GridBigScreens";

export default class Chat extends Component{
    constructor(props) {
        super(props);
        this.state = {
            currentChat: 'Socket.IO',
            showOptionsDialog: false,
            showChatInfo: false,
            modals: {
                settings: {
                    show: false
                },
                userInfo: {
                    show: false
                },
                newChat: {
                    show: false
                }
            },
            activeTab: 'chat',
            tabs: {
                chat: {
                    name: 'Socket.IO',
                    id: -1
                },
                chatInfo: {
                    name: '',
                    id: -1
                },
                allChats: {
                    name: '',
                    id: -1
                }
            }
        };
        console.log(this.state.tabs[this.state.activeTab].name);

    }
    logout = () => {
        logout().then(() => {
            // eslint-disable-next-line no-restricted-globals
            location.reload();
        });
    };
    render() {
        const setState = this.setState.bind(this);
        const showModals = () => {
            if(this.state.modals['settings'].show){
                return(
                    <Modal
                        hide={() => {
                            this.setState(state => ({
                                modals: {
                                    ...state.modals,
                                    settings: {
                                        show: false
                                    }
                                }
                            }));
                        }}
                    >
                        <h1>Settings</h1>
                    </Modal>
                )
            }
            if(this.state.modals['userInfo'].show){
                return(
                    <Modal
                        hide={() => {
                            this.setState(state => ({
                                modals: {
                                    ...state.modals,
                                    userInfo: {
                                        show: false
                                    }
                                }
                            }));
                        }}
                    >
                        <h1>Du</h1>
                    </Modal>
                )
            }
        };
        return (
            <div className="h-100">
                <Header
                    chatname={this.state.currentChat}
                    setParentState={setState}
                    logout={this.logout}
                    activeTab={this.state.activeTab}
                />
                <Responsive displayIn={["Laptop","Tablet"]}>
                    {showModals()}

                    <GridBigScreens />

                </Responsive>
                <Responsive displayIn={["Mobile"]}>

                </Responsive>

            </div>
        );
    }

}