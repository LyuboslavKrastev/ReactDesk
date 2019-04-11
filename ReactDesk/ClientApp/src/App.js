import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { FetchData } from './components/FetchData';
import { Counter } from './components/Counter';
import { Register } from './components/users/Register';
import { Login } from './components/users/Login';
import { history } from './helpers/history';
import { Role } from './helpers/role';
import { authenticationService } from './services/authentication.service';
import { PrivateRoute } from './components/routing/PrivateRouter';
import { Router } from 'react-router-dom'
import { Link } from 'react-router-dom'
import Admin from './components/admin/Admin';
import Navbar from './components/Navbar';
import Create from './components/requests/Create';
import RequestsTable from './components/requests/RequestsTable';


export default class App extends Component {
  displayName = App.name

  constructor(props) {
    super(props);

    this.state = {
        currentUser: null,
        isAdmin: false
    };
  }
  componentDidMount() {
    authenticationService.currentUser.subscribe(x => this.setState({
        currentUser: x,
        isAdmin: x && x.role === Role.Admin
    }));
  }

  logout() {
    authenticationService.logout();
    history.push('/login');
  }

  render() {
    const { currentUser, isAdmin } = this.state;
    return (
        <Router history={history}>
            <div>
                <Navbar/>
                <div className="jumbotron">
                    <div className="container">
                        <div className="row">
                            <div>
                                <Route exact path="/" component={Home} />
                                <PrivateRoute path="/admin" roles={[Role.Admin]} component={Admin} />
                                <PrivateRoute path="/requests/create" component={Create} />
                                <PrivateRoute path="/requests" component={RequestsTable} />


                                <Route path="/login" component={Login} />
                                <Route path="/register" component={Register} />

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Router>)
  }
}
