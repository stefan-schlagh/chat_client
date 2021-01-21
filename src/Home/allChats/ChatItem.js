import React,{Component} from "reactn";
import {Link} from "react-router-dom";
import chatSocket from "../../chatData/chatSocket";

export default class ChatItem extends Component{

    constructor(props) {
        super(props);
        this.state = {
            lastMsg: undefined,
            typeMsg: ''
        }
    }
    /*
        is this chat selected?
     */
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

        const renderUnreadMsg = () => {
            if(this.props.unreadMessages === 0)
                return null;
            else
                return(
                    <div className="newMsg-number">
                        {this.props.unreadMessages}
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
            if(this.props.latestMessage)
                return(
                    <span>
                        {this.props.latestMessage.msgString}
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
            if(this.props.latestMessage)
                return(
                    <div className="lastMsg-date">
                        {this.props.latestMessage.dateString}
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
            <li className={"chat-item" + (this.isSelected() ? "selected " : "")}>
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

    componentDidMount() {
        const chat = chatSocket.getChat(this.props.type,this.props.id);
        /*
            event listener werden angelegt
         */
        //if(chat)
        chat.event.on("typeState changed",this.typeStateChanged);
        /*else{
            console.log('error',chatSocket.chats.group,this.props.type,this.props.id)
        }*/
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        /*
            did component update?
         */
        if(prevProps.type !== this.props.type || prevProps.id !== this.props.id) {
            //Listeners get replaced
            const prevChat = chatSocket.getChat(prevProps.type,prevProps.id);
            prevChat.event.rm("typeState changed",this.typeStateChanged);

            const newChat = chatSocket.getChat(this.props.type,this.props.id);
            newChat.event.on("typeState changed",this.typeStateChanged);

            //typeMsg gets deleted
            this.setState({
                typeMsg: ''
            });
        }

    }
    componentWillUnmount() {
        const chat = chatSocket.getChat(this.props.type,this.props.id);
        /*
            event listener werden entfernt
         */
        chat.event.rm("typeState changed",this.typeStateChanged);
    }
}