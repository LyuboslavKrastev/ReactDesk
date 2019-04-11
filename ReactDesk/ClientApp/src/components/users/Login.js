import React, { Component } from 'react';
import requester from '../../helpers/requester'
import { Link } from 'react-router-dom';
import { authenticationService } from '../../services/authentication.service'

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
            Password: ''
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
        console.log(data)

        authenticationService.login(data.Username, data.Password)
            .then(this.props.history.push('/'));
    }

    render() {
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
