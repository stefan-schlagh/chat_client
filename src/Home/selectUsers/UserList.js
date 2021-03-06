import React,{Component} from "react";
import UserItem from "./UserItem";
import Dummy from "../../utilComp/Dummy";
import InfiniteScroll from 'react-infinite-scroller';

const errorCode={
    none: 0,
    error: 1
};

export default class extends Component {

    scrollParentRef;
    lastRequest = {};

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
            error: errorCode.none,
            /*
                are there items left?
             */
            hasMore: true
        }
    }

    searchChanged = event => {
        this.setState({
            searchValue: event.target.value,
            searchResult: [],
            hasMore: true
        });
    };
    /*
        more users are loaded
     */
    loadUsers = async () => {

        const searchValue = this.state.searchValue;
        const length = this.state.searchResult.length;

        if(
            this.lastRequest.searchValue !== searchValue
            || this.lastRequest.length !== length
        ) {

            this.lastRequest = {
                searchValue: searchValue,
                length: length
            };

            try {

                const data = await this.props.loadUsers(
                    searchValue,
                    length
                );

                if (data.length === 0) {
                    this.setState({
                        hasMore: false,
                        error: errorCode.none
                    })
                } else {
                    this.setState(state => ({
                        searchResult: state.searchResult.concat(data),
                        error: errorCode.none
                    }));
                }

            } catch (error) {
                this.setState({
                    error: errorCode.error
                });
            }
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
                <div
                    className="selectUsers"
                    ref={ref => this.scrollParentRef = ref}
                >
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={this.loadUsers}
                        hasMore={this.state.hasMore}
                        loader={
                            <div className="loader" key={-1}>
                                <div
                                    className="spinner-border text-secondary"
                                    role="status"
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
                        <ul className="selectUsers">
                            {this.state.searchResult.map((item, index) => (
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
                            {this.state.searchResult.length === 0 ?
                                <div key={-1} className="nothingFound">
                                    Nichts gefunden!
                                </div>
                                :
                                null
                            }
                        </ul>
                    </InfiniteScroll>
                </div>
            </Dummy>
        )
    }
}