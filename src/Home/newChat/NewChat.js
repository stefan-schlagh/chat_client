import React,{Component} from "react";
import ChooseUser from "./chooseUser/ChooseUser";

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
                        />
                    );

                }

                case tabs.newGroup:{
                    return(
                        <div>
                            <h4>newGroup</h4>
                        </div>
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
                        />
                    );
                }
            }
        };

        return(
            <div>
                <div className="modal-header-b">
                    <h1>Neuer Chat</h1>
                </div>
                {router()}
            </div>
        )
    }
}