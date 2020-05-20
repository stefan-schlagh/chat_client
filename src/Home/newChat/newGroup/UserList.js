import React,{Component} from "react";
import ReactDOM from 'react-dom';
import UserItem from "./UserItem";

const errorCode={
    none: 0,
    error: 1
};

export default class extends Component {

    /*
        the number of results already loaded
     */
    _numAlreadyLoaded = 0;
    _reachedBottom = false;
    _listRef;
    _listNode;

    constructor(props) {
        super(props);
        this.state = {
            /*
                the last search result received from the server
             */
            searchResult: [],
            /*
                should loader at the bottom be shown?
             */
            showLoaderBottom: false,
            error: errorCode.none
        }
    }
    /*
        search gets refreshed
     */
    refreshSearch = () => {
        this.numAlreadyLoaded = 0;
        this.loadUsers().then(r => {});
    };
    /*
        more users are loaded
     */
    loadUsers = async () => {
        try {
            const config = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    search: this.props.searchValue,
                    limit: 10,
                    start: this.numAlreadyLoaded
                })
            };
            const response = await fetch('/getAllUsers', config);

            if (response.ok) {
                //return json
                let data = await response.json();

                if(data.length === 0){
                    this.reachedBottom = true;
                } else {

                    let scrollToBottomBuffer = this.getScrollToBottom();

                    if(this.numAlreadyLoaded === 0)
                        this.setState({
                            searchResult: data
                        });
                    else
                        this.setState(state => ({
                            searchResult: state.searchResult.concat(data)
                        }));
                    this.numAlreadyLoaded += data.length;
                    /*
                        if scrollToBottom is 0, the next result is requested
                     */
                    if(scrollToBottomBuffer === 0){
                        this.loadUsers(this.props.searchValue);
                    }
                }
                this.setState({
                    error: errorCode.none
                });
            } else {
                this.setState({
                    error: errorCode.error
                });
            }
        } catch (error) {
            this.setState({
                error: errorCode.error
            });
        }
    };
    /*
        is called when an user is selected
     */
    selectUser = index => {
        const user = this.state.searchResult[index];
        this.props.selectUser(user.uid,user.username);
    };

    deselectUser = index => {
        const user = this.state.searchResult[index];
        this.props.deselectUser(user.uid);
    };

    assignListRef = target => {
        this.listRef = target;
    };

    setScrollToBottom = val => {
        this.listNode.scrollTop = this.listNode.scrollHeight - this.listNode.offsetHeight - val;
    };

    getScrollToBottom  = () => {
        if(this.listNode !== null)
            return this.listNode.scrollHeight - this.listNode.offsetHeight - this.listNode.scrollTop;
        return 0;
    };

    render() {
        return(
            <ul className="list-group"
                ref={this.assignListRef}
            >
                {this.state.searchResult.map((item,index) => (
                    <UserItem
                        key={index}
                        index={index}
                        uid={item.uid}
                        username={item.username}
                        selectUser={this.selectUser}
                        deselectUser={this.deselectUser}
                        isSelected={this.props.isUserSelected(item.uid)}
                    />
                ))}
            </ul>
        )
    }

    componentDidMount() {
        this.listNode = ReactDOM.findDOMNode(this.listRef);
        this.refreshSearch();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.listNode = ReactDOM.findDOMNode(this.listRef);
        if(this.props.searchValue !== prevProps.searchValue)
            this.refreshSearch();
    }

    componentWillUnmount() {

    }

    get numAlreadyLoaded() {
        return this._numAlreadyLoaded;
    }

    set numAlreadyLoaded(value) {
        this._numAlreadyLoaded = value;
    }

    get reachedBottom() {
        return this._reachedBottom;
    }

    set reachedBottom(value) {
        this._reachedBottom = value;
    }

    get listRef() {
        return this._listRef;
    }

    set listRef(value) {
        this._listRef = value;
    }

    get listNode() {
        return this._listNode;
    }

    set listNode(value) {
        this._listNode = value;
    }
}