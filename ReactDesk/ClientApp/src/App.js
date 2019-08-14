import React, { Component } from 'react';
import { Route } from 'react-router';
import { Home } from './components/home/Home';
import { Register } from './components/users/Register';
import { Login } from './components/users/Login';
import { history } from './helpers/history';
import { Role } from './helpers/role';
 import { authenticationService } from './services/authentication.service';
import { PrivateRoute } from './components/routing/PrivateRoute';
import { Router } from 'react-router-dom'
import Admin from './components/admin/Admin';
import Navbar from './components/Navbar';
import RequestsTable from './components/requests/table/RequestsTable';
import CreateRequest from './components/requests/Create';
import CreateSolution from './components/solutions/Create';
import { NotificationContainer } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import RequestDetails from './components/requests/details/Details';
import SolutionsIndex from './components/solutions/SolutionsIndex';
import SolutionDetails from './components/solutions/Details';
import Chat from './components/chat/Chat';
import ReportsIndex from './components/reports/ReportsIndex';
import ReportWizard from './components/reports/ReportWizard';
import PieReport from './components/reports/DeleteThisWhenDbIsImplemented/PieReport';
import UsersTable from './components/admin/UsersTable';
import Approvals from './components/requests/approvals/approvals';


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
                                <Route path="/login" component={Login} />
                                <Route path="/register" component={Register} />
                                <PrivateRoute path="/approvals" component={Approvals} />

                                <PrivateRoute exact path="/admin" roles={[Role.Admin]} component={Admin} />
                                <PrivateRoute path="/requests/create" component={CreateRequest} />
                                <PrivateRoute path="/admin/users" roles={[Role.Admin]} component={UsersTable} />                        
                                <PrivateRoute exact path="/requests" component={RequestsTable} /> 
                                <PrivateRoute exact path="/solutions" component={SolutionsIndex} />
                                <PrivateRoute path="/solutions/create" roles={[Role.Admin, Role.Helpdesk]} component={CreateSolution} />
                                <PrivateRoute path="/requests/details/:id" component={RequestDetails} />
                                <PrivateRoute path="/solutions/details/:id" component={SolutionDetails} />                            
                                <PrivateRoute exact path="/reports" component={ReportsIndex} />
                                <PrivateRoute path="/reports/create" component={ReportWizard} />
                                <PrivateRoute path="/reports/details/piereport" component={PieReport} />
                                <PrivateRoute path="/chat" component={Chat}/>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Router>)
  }
}
