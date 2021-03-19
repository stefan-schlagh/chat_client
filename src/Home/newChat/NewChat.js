import React,{Component} from "react";
import ChooseUser from "./chooseUser/ChooseUser";
import ChooseGroup from "./chooseGroup/ChooseGroup";
import NewGroup from "./newGroup/NewGroup";
import Dummy from "../../utilComp/Dummy";
import {ModalHeader,ModalMain} from "../../utilComp/Modal";

import './newChat.scss';

export const tabs = {
    chooseUser: 0,
    newGroup: 1,
    chooseGroup: 2
};

export default class NewChat extends Component{

    constructor(props) {
        super(props);
        this.state = {
            currentTab: tabs.chooseUser
        }
    }

    setCurrentTab = newTab => {
        this.setState({
            currentTab: newTab
        });
    };

    render() {

        const router = () => {

            switch (this.state.currentTab) {

                case tabs.chooseUser:{
                    return(
                        <ChooseUser
                            setCurrentTab={this.setCurrentTab}
                            hide={this.props.hide}
                        />
                    );

                }

                case tabs.newGroup:{
                    return(
                        <NewGroup />
                    );
                }

                case tabs.chooseGroup:{
                    return(
                        <ChooseGroup/>
                    );
                }


                default: {
                    return(
                        <ChooseUser
                            setCurrentTab={this.setCurrentTab}
                            hide={this.props.hide}
                        />
                    );
                }
            }
        };

        const getHeader = () => {

            switch(this.state.currentTab){

                case tabs.chooseUser:
                    return 'Neuer Chat';

                case tabs.newGroup:
                    return 'Neue Gruppe';

                case tabs.chooseGroup:
                    return 'Gruppe auswählen';

                default:
                    return 'Neuer Chat';

            }
        };

        return(
            <Dummy>
                <ModalHeader>
                    <h1>{getHeader()}</h1>
                </ModalHeader>
                <ModalMain>
                    <div className="newChat">
                        {router()}
                    </div>
                </ModalMain>
            </Dummy>
        )
    }
}