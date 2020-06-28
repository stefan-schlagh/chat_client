import React,{Component} from "react";
import ReactDOM from 'react-dom';
import Dummy from "../../utilComp/Dummy";
import UserItem from "./UserItem";

import './selectChat.scss';

const errorCode={
    none: 0,
    error: 1
};
/*
    props:
        showSearchBar: boolean
            if false: searchValue comes as prop
        searchValue
        loadChats: function(searchValue,numAlreadyLoaded)
 */
export default class SelectChat extends Component{
    /*
        the number of results already loaded
     */
    _numAlreadyLoaded = 0;
    _reachedBottom;
    _listRef;
    _listNode;

    constructor(props) {
        super(props);
        this.state = {
            error: errorCode.none,
            showOptions: false,
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
            showLoaderBottom: false
        };
    }
    /*
        gets called when the search of the user changed. the new result gets requested
     */
    searchChanged = (searchValue) => {

        this.setState({
            searchValue: searchValue
        });
        /*
            new search result gets requested
         */
        this.numAlreadyLoaded = 0;
        this.reachedBottom = false;

        this.refreshSearch()
    };
    /*
        search gets refreshed
     */
    refreshSearch = () => {
        this.numAlreadyLoaded = 0;
        this.loadChats().then(r => {});
    };
    /*
        more chats are loaded
     */
    loadChats = async () => {
        try {

            const response = await this.props.loadChats(
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
                        this.loadChats();
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

    componentDidMount() {
        this.listNode = ReactDOM.findDOMNode(this.listRef);
        this.refreshSearch();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.listNode = ReactDOM.findDOMNode(this.listRef);
        /*
            is searchBar is not shown,
                it is checked if searchValue has changed
         */
        if(!this.props.showSearchBar){
            if(this.props.searchValue !== prevProps.searchValue){
                this.refreshSearch();
            }
        }
    }

    render() {

        if(this.state.error === errorCode.error){
            return(
                <div className="alert alert-danger" role="alert">
                    Ein Fehler ist aufgetreten!
                </div>
            )
        }
        if(this.state.searchResult.length > 0) {
            return (
                <Dummy>
                    {/*
                        if showSearchBar is true, it gets shown
                         */
                        this.props.showSearchBar ?
                            <div className="user-top">
                                <div className="searchUser">
                                    <input type="text"
                                           name="newChat-searchUser"
                                           className="form-control"
                                           placeholder="Benutzer suchen"
                                           onChange={this.searchChanged}
                                    />
                                </div>
                            </div>
                            : null
                    }
                    <ul
                        className="selectChat"
                        ref={this.assignListRef}>
                        {this.state.searchResult.map((item, index) => (
                            <UserItem
                                key={index}
                                uid={item.uid}
                                username={item.username}
                                hide={this.props.hide}
                            />
                        ))}
                    </ul>
                </Dummy>
            );
        }else{
            return(
                <ul className="result-list">
                    <div className="alert alert-warning" role="alert">
                        Nichts gefunden!
                    </div>
                </ul>
            )
        }
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