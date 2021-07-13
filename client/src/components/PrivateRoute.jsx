import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import AuthService from "../services/auth.service"

const PrivateRoute = ({ component: Component, ...rest }) => {

    // Add your own authentication on the below line.
    const user = AuthService.getCurrentUser();

    return (
        <Route
            {...rest}
            render={props =>
                user ? (
                    <Component {...props} />
                ) : (
                        <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
                    )
            }
        />
    )
}

export default PrivateRoute