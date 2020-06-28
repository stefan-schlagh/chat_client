import React,{Component} from "react";
import ReactDOM from 'react-dom';
import UserItem from "./UserItem";
import Dummy from "../../utilComp/Dummy";
import {makeRequest} from "../../global/requests";

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
                the value of the search input
             */
            searchValue: '',
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

    searchChanged = event => {
        this.setState({
            searchValue: event.target.value
        });
        this.refreshSearch();
    };
    /*
        more users are loaded
     */
    loadUsers = async () => {
        try {

            const response = await this.props.loadUsers(
                this.state.searchValue,
                this.numAlreadyLoaded
            );

            if (response.ok) {
                //return json
                let data = await response.json();

                if(data.length === 0 && this.numAlreadyLoaded === 0){
                    this.setState({
                        searchResult: []
                    });
                }else if(data.length === 0){
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
            <Dummy>
                <form className="form-group" style={{width: '90%',maxWidth: '650px'}}>
                    <input type="text"
                           className="form-control p-2 m-2"
                           placeholder="Benutzer suchen"
                           value={this.state.searchValue}
                           onChange={this.searchChanged}
                    />
                </form>
                <ul className="selectUsers"
                    ref={this.assignListRef}
                >
                    {this.state.searchResult.length > 0 ?

                        this.state.searchResult.map((item, index) => (
                            <UserItem
                                key={index}
                                index={index}
                                uid={item.uid}
                                username={item.username}
                                selectUser={this.selectUser}
                                deselectUser={this.deselectUser}
                                isSelected={this.props.isUserSelected(item.uid)}
                            />
                        ))

                        :

                        <div className="alert alert-warning" role="alert">
                            Nichts gefunden!
                        </div>

                    }
                </ul>
            </Dummy>
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