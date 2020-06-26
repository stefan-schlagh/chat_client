import React from "react";
import { Route, Redirect } from "react-router-dom";
import {useGlobal} from "reactn";

function PrivateRoute({ component: Component, ...rest }) {

    const [global,setGlobal] = useGlobal();

    return (
        <Route
            {...rest}
            render={props =>
                global.loaded ? (
                    global.authTokens ?
                    (
                        <Component {...props} />
                    )
                    : (
                        <Redirect
                            to={{
                                pathname: "/login",
                                state: {
                                    referer: props.location
                                }
                            }}
                        />
                    )
                ) : null
            }
        />
    );
}

export default PrivateRoute;