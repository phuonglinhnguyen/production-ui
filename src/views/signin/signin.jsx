import React, { Component } from 'react'
import { PageDecorator, userLogin } from '@dgtx/coreui'
import { Login } from '../../@components'
 class SigninEnchand extends Component {
    render() {
        return (
            <Login doLogin={this.props.userLogin}/>
        )
    }
}


export const Signin = PageDecorator({
    actions: {
        userLogin
    }
})(SigninEnchand)
