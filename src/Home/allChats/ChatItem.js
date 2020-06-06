import React,{Component} from "reactn";
import {Link} from "react-router-dom";
import chatSocket from "../../chatData/chatSocket";

export default class ChatItem extends Component{

    constructor(props) {
        super(props);
        this.state = {
            unreadMessages: 0,
            lastMsg: undefined,
            typeMsg: ''
        }
    }

    isSelected = () => {
        return this.props.id === this.global.currentChat.id && this.props.type === this.global.currentChat.type;
    };
    /*
        wenn ein user anfängt, oder aufhört zu schreiben, wird diese Methode aufgerufen,
        um die typeMsg zu aktualisieren
     */
    typeStateChanged = () => {

        const chat = chatSocket.getChat(this.props.type,this.props.id);
        let typeMsg = '';
        /*
            wenn latestuserTyping = null, schreibt gerade keiner
         */
        const userTyping = chat.getLatestUserTyping();
        if(userTyping !== null){
            typeMsg = userTyping.username + " schreibt...";
        }
        //state wird aktualisiert
        this.setState({
            typeMsg: typeMsg
        });
    };

    render() {

        const chat = chatSocket.getChat(this.props.type,this.props.id);

        const lastMsg = chat.getFirstMessage();

        const renderUnreadMsg = () => {
            if(this.state.unreadMessages === 0)
                return null;
            else
                return(
                    <div className="newMsg-number">
                        {/*TODO unreadMessages do not get incremented the first time
                        */}
                        {this.state.unreadMessages}
                    </div>
                );
        };
        /*
            in der unteren Hälfte wird angezeigt wer schreibt
            schreibt keiner, wird letzte Nachricht angezeigt
         */
        const renderLowerHalf = () => {
            if(this.state.typeMsg === '')
                return (
                    <div className="w-100 lastMsg">
                        {renderMsg()}
                        {renderDate()}
                    </div>
                );
            else{
                return (
                    <div className="w-100 typeMsg">
                        {this.state.typeMsg}
                    </div>
                );
            }
        };

        const renderMsg = () => {
            if(lastMsg)
                return(
                    <span>
                        {lastMsg.getChatViewMsgString()}
                    </span>
                );
            else
                return(
                    <span>
                        Noch keine Nachrichten vorhanden
                    </span>
                );
        };

        const renderDate = () => {
            if(lastMsg)
                return(
                    <div className="lastMsg-date">
                        {lastMsg.getChatViewDateString()}
                    </div>
                );
            else
                return null;
        };

        const getLink = () => {
            if(this.props.type === 'normalChat'){
                return '/chat/user/' + chatSocket.getChat('normalChat',this.props.id).otherUser;
            }else if(this.props.type === 'groupChat'){
                return '/chat/group/' + this.props.id;
            }else if(this.props.type === 'tempChat'){
                return '/chat/user/' + chatSocket.temporaryChat.chatNow.otherUser;
            }
        };

        return(
            <li key={this.props._key_}
                className={(this.isSelected() ? "selected " : "")}
            >
                <Link to={getLink()}>
                    <div className="w-100">
                        <strong>
                            {this.props.name}
                        </strong>
                        {renderUnreadMsg()}
                    </div>
                    {renderLowerHalf()}
                </Link>
            </li>
        )
    }

    newMessage = () => {
        /*
            wenn chat nicht selected, wird newMessages inkrmentiert
         */
        if(!this.isSelected()) {
            this.setState(state => ({
                unreadMessages: state.unreadMessages + 1
            }));
        }
        /*
            chat wird nach oben gereiht
         */
        this.props.toTop(this.props._key_);
    };

    componentDidMount() {
        const chat = chatSocket.getChat(this.props.type,this.props.id);
        this.setState({
            unreadMessages: chat.unreadMessages
        });
        /*
            event listener werden angelegt
         */
        chat.event.on("new message",this.newMessage);
        chat.event.on("typeState changed",this.typeStateChanged);
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        /*
            wenn component selected, wird newMessages counter zurückgesetzt
         */
        if(this.isSelected() && this.state.unreadMessages !== 0)
            this.setState({
                unreadMessages: 0
            });
        /*
            did component update?
         */
        if(prevProps.type !== this.props.type || prevProps.id !== this.props.id) {
            //Listeners get replaced
            const prevChat = chatSocket.getChat(prevProps.type,prevProps.id);
            prevChat.event.rm("new message",this.newMessage);
            prevChat.event.rm("typeState changed",this.typeStateChanged);

            const newChat = chatSocket.getChat(this.props.type,this.props.id);
            newChat.event.on("new message",this.newMessage);
            newChat.event.on("typeState changed",this.typeStateChanged);

            //typeMsg gets deleted
            this.setState({
                typeMsg: '',
                unreadMessages: newChat.unreadMessages
            });
        }

    }
    componentWillUnmount() {
        const chat = chatSocket.getChat(this.props.type,this.props.id);
        /*
            event listener werden entfernt
         */
        chat.event.rm("new message",this.newMessage);
        chat.event.rm("typeState changed",this.typeStateChanged);
    }
}