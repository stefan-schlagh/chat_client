import React,{Component} from "react";

export default class MessageForm extends Component{

    constructor(props) {
        super(props);
        this.state = {
            message: ''
        }
    }

    onTyping = event => {
        this.setState({
           message: event.target.value
        });
    };

    onSubmit = event => {
        event.preventDefault();
    };

    render() {
        return(
            <form onSubmit={this.onSubmit}>
                <div className="msg-form">
                    <input autoComplete="off"
                           placeholder="Nachricht:"
                           onChange={this.onTyping}
                    />
                    <button type="submit">
                        <i className="far fa-paper-plane fa-2x" data-toggle="tooltip" title="send message" />
                    </button>
                </div>
            </form>
        )
    }
}