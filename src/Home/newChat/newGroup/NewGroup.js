import React,{Component} from "react";
import SelectUsers from "./SelectUsers";

const tabs = {
    selectUsers: 0,
    enterUserInfo: 1
};

export default class NewGroup extends Component{

    constructor(props) {
        super(props);
        this.state = {
            currentTab: tabs.selectUsers
        }
    }

    render() {

        switch(this.state.currentTab){

            case tabs.selectUsers:
                return <SelectUsers />;

            case tabs.enterUserInfo:

                break;

            default:
                return null;
        }
    }
}