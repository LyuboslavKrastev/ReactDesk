import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { authenticationService } from '../services/authentication.service'

import { history } from '../helpers/history';

const nStyle = {
    background: '#36648B',
}

export default class Navbar extends Component {
    constructor(props) {
        super(props)

        this.state = {
            currentUser: null,
        };
    }

    componentDidMount() {
        authenticationService.currentUser.subscribe(x => this.setState({
            currentUser: x,
        }));
    }

    logout() {
        authenticationService.logout();
        history.push('/login');
    }

    render() {
        const isLoggedIn = this.state.currentUser;
        let button;

        if (isLoggedIn) {
            button = <a onClick={this.logout} className="nav-item nav-link ml-auto">Logout</a>
        } else {
            button = <Link to="/Login" className="nav-item nav-link ml-auto">Login</Link>
        }

        return (
            <div>
                <nav className="navbar-inverse navbar-fixed-top" style={nStyle}>
                    <div className="container-fluid">

                        <ul className="nav navbar-nav">
                            <Link to="/" className="navbar-brand">ReactDesk</Link>
                            <li><Link to="/"><span className="glyphicon glyphicon-home"></span></Link></li>
                        </ul>

                        {this.state.currentUser ? // display these buttons, only if there is an authenticated user
                            <ul className="nav navbar-nav">
                                <li><Link to="/Requests">Requests</Link></li>
                                <li><Link to="/Solutions">Solutions</Link></li>

                                <li >
                                    <Link to="/Requests/Create">
                                        Create Request <i className="glyphicon-plus"></i>
                                    </Link>
                                </li>
                                {this.state.currentUser && (this.state.currentUser.role === 'Admin' || this.state.currentUser.role == 'Helpdesk') ? <li >
                                    <Link to="/Solutions/Create">
                                        Create Solution <i className="glyphicon-plus"></i>
                                    </Link>
                                </li> : null}
                                {this.state.currentUser && this.state.currentUser.role === 'Admin' ? <li >
                                    <Link to="/Admin/Users">
                                        Manage Users
                                </Link>
                                </li> : null}


                                <li><Link to="/Reports">Reports</Link></li>
                                <li><Link to="/Chat">Chat</Link></li></ul> : null
                        }




                        <ul className="nav navbar-nav pull-right">
                            {!this.state.currentUser ? // display the Register button, only if there is no authenticated user
                                <li><Link to="/Register">Register</Link></li> : null}
                            {this.state.currentUser ? <li><Link to={`/user/profile?id=` + this.state.currentUser.id}>Greetings, {this.state.currentUser.fullName}!</Link></li> : null}
                            <li>{button}</li> 
                          
                        </ul>
                    </div>
                </nav>
                <br />
            </div>
        )
    }
}