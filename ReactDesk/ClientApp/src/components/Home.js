import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { authenticationService } from '../services/authentication.service'

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
                <div class="col-md-6">
                    <h1 class="text-center">To be implemented</h1>
                    <div class="chart-container">
                        <canvas id="chart"></canvas>
                    </div>
                </div>
            )
        }
    return (
      <div>
            <div class="jumbotron text-center">
                <h1>ReactDesk</h1>
                <h2>Helpdesk Management System</h2>
                <hr class="bg-dark" />
                <p><Link  to="/Login">Login </Link> if you have an account.</p>
                <p><Link  to="/Register">Register </Link> if you don't.</p>
            </div>
      </div>
    );
  }
}
