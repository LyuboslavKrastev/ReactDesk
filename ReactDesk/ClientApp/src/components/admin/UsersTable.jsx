import React, { Component } from 'react'
import { userService } from '../../services/user.service';
import { Link } from 'react-router-dom';

export default class UsersTable extends Component {
    constructor(props) {
        super(props)

        this.state = {
            users: []
        }
    }

    componentDidMount = () => {
        userService.getAll()
            .then(res => {
                console.log(res)
                this.setState({
                    users: res
                })
            })
    }

    updateRole = (userId, role) => {
        debugger;
        userService.setRole(userId, role)
        .then(res => console.log(res))
    }

    render() {
        let users = this.state.users;

        return (
            <div>
                <h2 className="text-center">All Users</h2>
                <hr />
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Helpdesk Agent?</th>
                            <th>Admin?</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users !== undefined && users !== null && users.length > 0 ?
                            users.map(u =>
                                <tr>
                                    <td>{u.id}</td>
                                    <td>{u.fullName}</td>
                                    <td><a href={ "mailto:" + u.email }>{u.email}</a></td>
                                    <td>{u.isHelpdeskAgent ? <div>True</div> : <div>False</div>}</td>
                                    <td>{u.isAdmin ? <div>True</div> : <div>False</div>}</td>
                                    <td>
                                        {u.isAdmin || u.isHelpdeskAgent ? <button onClick={() => this.updateRole(u.id, "User")}  style={{ width: "100%" }} className="btn btn-warning">Set to User</button> : <button onClick={() => this.updateRole(u.id, "Helpdesk")} style={{ width: "100%" }} className="btn btn-warning">Set to HelpDesk agent</button>}
                                        <Link to="/details" style={{ width: "100%" }} className="btn btn-info">Details</Link>
                                        <button style={{ width: "100%" }} className="btn btn-danger">Ban (not implemented)</button>                 
                                    </td>
                                </tr>
                            ) : null
                        }
                    </tbody>
                </table>
            </div>
        )
    }
}