import React,{Component} from "react";
import ReactDOM from 'react-dom';
import {tabs} from "../NewChat";
import UserItem from "./UserItem";
import Dummy from "../../../utilComp/Dummy";

const errorCode={
    none: 0,
    error: 1
};

export default class ChooseUser extends Component{

    _clickedOutsideTimer;
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
                is the search valid?
             */
            searchValid: true,
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
        options get shown
     */
    showOptions = event => {
        clearTimeout(this.clickedOutsideTimer);
        this.setState({
            showOptions: true
        });
    };
    /*
        options get hidden
     */
    clickedOutsideOptions = () => {
        this.clickedOutsideTimer = setTimeout(this.hideOptions,100);
    };
    hideOptions = () => {
        this.setState({
            showOptions: false
        });
    };
    /*
        when new group gets clicked
     */
    newGroupClick = event => {
        clearTimeout(this.clickedOutsideTimer);
        this.props.setCurrentTab(tabs.newGroup);
    };
    /*
        when join group is clicked
     */
    joinGroupClick = event => {
        clearTimeout(this.clickedOutsideTimer);
        this.props.setCurrentTab(tabs.chooseGroup);
    };
    /*
        gets called when the search of the user changed. the new result gets requested
     */
    searchChanged = event => {
        const searchValue = event.target.value;

        const searchValid = true;

        this.setState({
            searchValue: searchValue,
            searchValid: searchValid
        });
        /*
            new search result gets requested if search is valid
         */
        if(searchValid) {
            this.numAlreadyLoaded = 0;
            this.reachedBottom = false;
            this.requestSearchResult(searchValue).then(r => {
            });
        }
    };
    /*
        the search result gets requested
     */
    requestSearchResult = async (searchValue) => {
        try {
            const config = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    search: searchValue,
                    limit: 10,
                    start: this.numAlreadyLoaded
                })
            };
            const response = await fetch('/user/noChat', config);

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
                        this.requestSearchResult(searchValue);
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

    render() {
        /*
            if state.showOptions is true, options get rendered
         */
        const renderOptions = () => {
            if(this.state.showOptions)
                return(
                    <div className="options">
                        <ul className="list-group"
                            ref={this.assignListRef}
                        >
                            <li className="list-group-item"
                                onClick={this.newGroupClick}
                            >
                                neue Gruppe
                            </li>
                            <li className="list-group-item"
                                onClick={this.joinGroupClick}
                            >
                                einer Gruppe beitreten
                            </li>
                        </ul>
                    </div>
                );
            return null;
        };
        /*
            results only get rendered if search was valid
         */
        const renderResult = () => {
            if(this.state.error === errorCode.error){
                return(
                    <div className="alert alert-danger" role="alert">
                        Ein Fehler ist aufgetreten!
                    </div>
                )
            }
            else if(this.state.searchValid) {
                if(this.state.searchResult.length > 0) {
                    return (
                        <Dummy>
                            <h5>Ergebnisse:</h5>
                            <ul className="list-user list-group result-list">
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
                        <ul className="list-user result-list">
                            <div className="alert alert-warning" role="alert">
                                Nichts gefunden!
                            </div>
                        </ul>
                    )
                }
            }else{
                return(
                    <div className="alert alert-danger" role="alert">
                        Ihre Suche enthält ungültige Zeichen!
                    </div>
                )
            }
        };

        return(
            <div className="user-results">
                <div className="newChat-user-top">
                    <div className="newChat-searchUser">
                        <input type="text"
                               name="newChat-searchUser"
                               className="form-control"
                               placeholder="Benutzer suchen"
                               onChange={this.searchChanged}
                        />
                    </div>
                    <div className="newChat-user-more">
                        <i className="fas fa-ellipsis-h fa-2x"
                           onClick={this.showOptions}
                        />
                        {renderOptions()}
                    </div>
                </div>
                {renderResult()}
            </div>
        );
    }
    componentDidMount() {
        this.listNode = ReactDOM.findDOMNode(this.listRef);
        document.body.addEventListener('click',this.clickedOutsideOptions);
        /*
            users are requested
         */
        this.numAlreadyLoaded = 0;
        this.reachedBottom = false;
        this.requestSearchResult('').then(r => {});
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        this.listNode = ReactDOM.findDOMNode(this.listRef);
    }

    componentWillUnmount() {
        clearTimeout(this.clickedOutsideTimer);
        document.body.removeEventListener('click',this.clickedOutsideOptions);
    }

    get clickedOutsideTimer() {
        return this._clickedOutsideTimer;
    }

    set clickedOutsideTimer(value) {
        this._clickedOutsideTimer = value;
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