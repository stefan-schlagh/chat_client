import React,{Component} from "react";

export default class Dummy extends Component {
    componentDidMount() {
        this.props.didMount();
    }

    render() {
        return null;
    }
}