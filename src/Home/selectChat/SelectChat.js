import React,{Component} from "react";
import Dummy from "../../utilComp/Dummy";
import UserItem from "./UserItem";
import InfiniteScroll from 'react-infinite-scroller';

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

    scrollParentRef;

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
                are there items left?
             */
            hasMore: true
        };
    }
    /*
        gets called when the search of the user changed. the new result gets requested
     */
    searchChanged = (searchValue) => {

        this.setState({
            searchValue: searchValue,
            searchResult: [],
            hasMore: true
        });
    };
    /*
        more chats are loaded
     */
    loadChats = async () => {
        try {

            const response = await this.props.loadChats(
                this.state.searchValue,
                this.state.searchResult.length
            );

            if (response.ok) {
                //return json
                let data = await response.json();

                if(data.length === 0){
                    this.setState({
                        hasMore: false
                    })
                } else {
                    this.setState(state => ({
                        searchResult: state.searchResult.concat(data)
                    }));
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

    componentDidUpdate(prevProps, prevState, snapshot) {
        /*
            is searchBar is not shown,
                it is checked if searchValue has changed
         */
        if(!this.props.showSearchBar){
            if(this.props.searchValue !== prevProps.searchValue){
                this.searchChanged(this.props.searchValue);
            }
        }
    }

    render() {

        if(this.state.error === errorCode.error){
            return(
                <div className="alert alert-danger" role="alert" key={0}>
                    Ein Fehler ist aufgetreten!
                </div>
            )
        }
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
                                           onChange={(event) => {
                                               this.searchChanged()
                                           }}
                                    />
                                </div>
                            </div>
                            : null
                    }
                    <div
                        className="selectChat"
                        ref={ref => this.scrollParentRef = ref}
                    >
                        <InfiniteScroll
                            pageStart={0}
                            loadMore={this.loadChats}
                            hasMore={this.state.hasMore}
                            loader={
                                <div className="loader">
                                    <div
                                        className="spinner-border text-secondary"
                                        role="status"
                                        key={0}
                                    >
                                        <span className="sr-only">
                                            Loading...
                                        </span>
                                    </div>
                                </div>
                            }
                            useWindow={false}
                            getScrollParent={() => this.scrollParentRef}
                            >
                            <ul
                                className="selectChat">
                                {this.state.searchResult.map((item, index) => (
                                    <UserItem
                                        key={index}
                                        uid={item.uid}
                                        username={item.username}
                                        hide={this.props.hide}
                                    />
                                ))}
                                {this.state.searchResult.length === 0 ?
                                    <div key={1} className="nothingFound">
                                        Nichts gefunden!
                                    </div>
                                    :
                                    null
                                }
                            </ul>
                        </InfiniteScroll>
                    </div>
                </Dummy>
            );
    }
}