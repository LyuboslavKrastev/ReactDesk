import React, { Component } from 'react';
import requester from '../../helpers/requester'
import { Link } from 'react-router-dom';

export class Register extends Component {
    displayName = Register

    constructor(props) {
        super(props);
        this.state = {
            Username: '',
            FullName: '',
            Password: '',
            ConfirmPassword: ''
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

        requester.post("api/users/register", data)
            .then(res => {
                console.log(res)
            })
    }

    render() {
        return (
            <div>
                <div className="row col-md-4 col-md-offset-4">
                    <h2 className="text-center">Register</h2>
                    <form method="post" onSubmit={this.handleSubmit}>
                        <div asp-validation-summary="All" className="text-danger"></div>
                        <div className="form-group">
                            <label htmlFor="Username">Username</label>
                            <input name="Username" className="form-control" onChange={this.handleInputChange}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="FullName">Full Name</label>
                            <input name="FullName" className="form-control" onChange={this.handleInputChange}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="Password">Password</label>
                            <input type="password" name="Password" className="form-control" onChange={this.handleInputChange}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="ConfirmPassword">Confirm Password</label>
                            <input type="password" name="ConfirmPassword" className="form-control" onChange={this.handleInputChange}/>
                        </div>
                        <button type="submit" className="btn btn-block btn-success">Register</button>
                        <div class="form-group">
                            <Link to="./Login" asp-route-returnUrl="@Model.ReturnUrl" class="pull-right">Already have an account? Click here to log in.</Link>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}
