import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { authenticationService } from '../../services/authentication.service'
import {  NotificationManager } from 'react-notifications';
import ReactLoading from 'react-loading';


export class Login extends Component {
    displayName = Login

    constructor(props) {
        super(props);

        // redirect to home if already logged in
        if (authenticationService.currentUserValue) {
            this.props.history.push('/');
        }

        this.state = {
            Username: '',
            Password: '',
            Loading: false
        };
    }

    handleInputChange = (event) => {
        let inputName = event.target.name;
        let inputValue = event.target.value;
        this.setState({
            [inputName]: inputValue
        })
    }

    handleSubmit = (event) => {
        event.preventDefault();
        let data = this.state

        this.setState({
            Loading: true
        });

        authenticationService.login(data.Username, data.Password)
            .then(res => {
                if (res.username) {
                    NotificationManager.success(`Welcome, ${res.username}`)
                    return this.props.history.push('/');
                }
                else {
                    this.setState({
                        Loading: false
                    })
                    return NotificationManager.error(res)
                   
                }
            })
   
    }

    render() {
        if(this.state.Loading){
            
            return(<div className="row col-md-4 col-md-offset-5">
            <ReactLoading type="bars" color="#36648B" height={'100%'} width={'100%'} /></div>)
        }
        return (
            <div class="row col-md-4 col-md-offset-4">
                <h2 class="text-center">Login</h2>
                <section>
                    <form method="post" onSubmit={this.handleSubmit}>
                        <div asp-validation-summary="All" class="text-danger"></div>
                        <div class="form-group">
                            <label htmlFor="Username">Username</label>
                            <input name="Username" class="form-control" onChange={this.handleInputChange}/>
                        </div>
                        <div class="form-group">
                            <label htmlFor="Password">Password</label>
                            <input type="password" name="Password" class="form-control" onChange={this.handleInputChange} />
                        </div>
                        <div class="form-group">
                            <button type="submit" class="btn btn-block btn-success">Log in</button>
                        </div>
                        <div class="form-group">
                            <Link to="./Register" asp-route-returnUrl="@Model.ReturnUrl" class="pull-right">Register as a new user</Link>
                        </div>
                    </form>
                </section>
            </div>
        );
    }
}
