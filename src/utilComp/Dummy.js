import React,{Component} from "react";

export default class Dummy extends Component {

    componentDidMount() {
        if(typeof(this.props.didMount) === 'function')
            this.props.didMount();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(typeof(this.props.didUpdate) === 'function')
            this.props.didUpdate();
    }

    render() {
        if(this.props.children)
            return this.props.children;
        return null;
    }
}