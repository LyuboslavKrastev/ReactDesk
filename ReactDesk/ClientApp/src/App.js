import React, { Component } from 'react';
import { Route } from 'react-router';
import { Home } from './components/Home';
import { Register } from './components/users/Register';
import { Login } from './components/users/Login';
import { history } from './helpers/history';
import { Role } from './helpers/role';
import { authenticationService } from './services/authentication.service';
import { PrivateRoute } from './components/routing/PrivateRouter';
import { Router } from 'react-router-dom'
import Admin from './components/admin/Admin';
import Navbar from './components/Navbar';
import RequestsTable from './components/requests/table/RequestsTable';
import SolutionsTables from './components/solutions/SolutionsTables';
import CreateRequest from './components/requests/Create';
import CreateSolution from './components/solutions/Create';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';


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
    
    return (
        <Router history={history}>
            <div>
                <Navbar />
                <NotificationContainer />
                <div className="jumbotron">
                    <div className="container">
                        <div className="row">
                            <div>
                                <Route exact path="/" component={Home} />
                                <PrivateRoute path="/admin" roles={[Role.Admin]} component={Admin} />
                                <Route path="/requests/create" component={CreateRequest} />
                                {/* <PrivateRoute path="/requests/create" component={CreateRequest} /> */}
                               
                                <PrivateRoute exact path="/requests" component={RequestsTable} /> 
                                <Route exact path="/solutions" component={SolutionsTables} />
                                {/* <PrivateRoute exact path="/solutions" component={SolutionsTables} /> */}
                                <PrivateRoute path="/solutions/create" component={CreateSolution} />

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
