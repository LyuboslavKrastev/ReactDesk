import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { authenticationService } from '../services/authentication.service'
import { history } from '../helpers/history';

const nStyle= {
    background: '#36648B',
}

export default class Navbar extends Component{
    constructor(props){
        super(props)

        this.state = {
            currentUser: null,
            isAdmin: false
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
            button = <a onClick={this.logout} className="nav-item nav-link">Logout</a>
        } else {
            button = <Link to="/Login" className="nav-item nav-link">Login</Link>
        }

        return (
            <div>
            <nav className="navbar-inverse navbar-fixed-top" style={nStyle}>
     <div className="container-fluid">
         
         <ul className="nav navbar-nav">
         
             <Link to="/"  className="navbar-brand">ReactDesk</Link>
        
                     <li><Link to="/"><span className="glyphicon glyphicon-home"></span></Link></li>
                     <li><Link to="/Requests">Requests</Link></li>
                     <li><Link to="/Solutions">Solutions</Link></li>
                     <li><Link to="/Chat">Chat</Link></li>
             {/* if (User.IsInRole(WebConstants.AdminRole))
{
                 <li className="dropdown">
                     <a className="dropdown-toggle" data-toggle="dropdown" href="#">
                         Admin Panel
                         <span className="caret"></span>
                     </a>
                     <ul className="dropdown-menu">
                         <li><a asp-area="Management" asp-controller="Users" asp-action="Index">Users</a></li>
                         <li><a asp-area="Management" asp-controller="Categories" asp-action="Index">Categories</a></li>
                         <li><a asp-area="Management" asp-controller="Statuses" asp-action="Create">Create Request Status</a></li>
                         <li><a href="/Management/Reports">Reports</a></li>
             
                     </ul>
                 </li>
             } */}
                 <li >
                             <Link to="/Requests/Create">
                                 Create Request <i className="glyphicon-plus"></i>
                             </Link>
                 </li>
                
                 <li>{button}</li>

                
                 
    </ul>
     </div>
</nav>  
<br />
</div>
        )
    }
}