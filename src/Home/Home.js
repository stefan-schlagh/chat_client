import React,{Component} from "react";
import Header from "./Header/Header";
import {logout} from "../Auth/Auth";
import Modal from "../utilComp/Modal";
import Responsive from "../responsive/Responsive";
import GridBigScreens from "./GridBigScreens";
import RouterSmallScreens from "./RouterSmallScreens";

export default class Chat extends Component{
    constructor(props) {
        super(props);
        this.state = {
            currentChat: 'Socket.IO',
            showChatInfoTop: false,
            modals: {
                anyShown: false,
                settings: {
                    show: false
                },
                userInfo: {
                    show: false
                },
                newChat: {
                    show: false
                }
            }
        };

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
                                    anyShown: false,
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
                                    anyShown: false,
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
                    headerLeft={{
                        showChatInfoTop: this.state.showChatInfoTop,
                        showBtnBack: true,
                        modalOpen: this.state.modals.anyShown,
                        chatName: this.state.currentChat,
                        chatId: -1
                    }}
                />

                <Responsive displayIn={["Mobile"]}>
                    <RouterSmallScreens
                        modals={this.state.modals}
                        setParentState={setState}
                    />
                </Responsive>

                <Responsive displayIn={["Laptop","Tablet"]}>
                    {showModals()}

                    <GridBigScreens
                        setParentState={setState}
                    />

                </Responsive>

            </div>
        );
    }

}