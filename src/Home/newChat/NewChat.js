import React,{Component} from "react";
import ChooseUser from "./chooseUser/ChooseUser";
import NewGroup from "./newGroup/NewGroup";
import Dummy from "../../utilComp/Dummy";

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
                        <div>
                            <h4>chooseGroup</h4>
                        </div>
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
                <div className="modal-header-b">
                    <h1>{getHeader()}</h1>
                </div>
                {router()}
            </Dummy>
        )
    }
}