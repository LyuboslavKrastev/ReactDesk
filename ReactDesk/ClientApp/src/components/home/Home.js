import React, { Component } from 'react';
import AuthenticatedHome from './AuthenticatedHome'
import UnauthenticatedHome from './UnauthenticatedHome'
 import { authenticationService } from '../../services/authentication.service'

export class Home extends Component {
  displayName = Home.name

    constructor(props) {
        super(props)

        this.state = {
            currentUser: null
        }
    }

    componentDidMount() {
        authenticationService.currentUser.subscribe(x => this.setState({
            currentUser: x
        }));
    }
    render() {
        if (this.state.currentUser) {
            return (
               <AuthenticatedHome/>
            )
        }
    return (
      <UnauthenticatedHome/>
    );
  }
}
