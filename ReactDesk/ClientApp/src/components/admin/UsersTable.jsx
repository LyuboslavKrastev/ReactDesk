import React, { Component } from 'react'
import { userService } from '../../services/user.service';
import { Link } from 'react-router-dom';
import { NotificationManager } from 'react-notifications';

export default class UsersTable extends Component {
    constructor(props) {
        super(props)

        this.state = {
            users: []
        }
    }

    componentDidMount = () => {
        this.loadUsers();
    }

    loadUsers = () => {
        userService.getAll()
            .then(res => {
                console.log(res)
                this.setState({
                    users: res
                })
            })
    }

    updateRole = (userId, role) => {
        userService.setRole(userId, role)
            .then(res => {
                console.log(res)
                if (res.error) {
                    NotificationManager.error(res.error)
                }
                else {
                    NotificationManager.success(res.message)
                    this.loadUsers();
                }
            });
    }

    banUser = (userId) => {
        userService.ban(userId)
            .then(res => {
                if (res.error) {
                    NotificationManager.error(res.error)
                }
                else {
                    NotificationManager.success(res.message)
                    this.loadUsers();
                }
            });
    }

    unbanUser = (userId) => {
        userService.unban(userId)
            .then(res => {
                if (res.error) {
                    NotificationManager.error(res.error)
                }
                else {
                    NotificationManager.success(res.message)
                    this.loadUsers();
                }
            });
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
                            <th>Is Banned?</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users !== undefined && users !== null && users.length > 0 ?
                            users.map(u =>
                                <tr>
                                    <td>{u.id}</td>
                                    <td>{u.fullName}</td>
                                    <td><a href={"mailto:" + u.email}>{u.email}</a></td>
                                    <td>{u.isHelpdeskAgent ? <div>True</div> : <div>False</div>}</td>
                                    <td>{u.isAdmin ? <div>True</div> : <div>False</div>}</td>
                                    <td>{u.isBanned ? <div>True</div> : <div>False</div>}</td>
                                    <td>
                                        {u.isAdmin || u.isHelpdeskAgent ? <button onClick={() => this.updateRole(u.id, "User")} style={{ width: "100%" }} className="btn btn-warning">Set to User</button> : <button onClick={() => this.updateRole(u.id, "Helpdesk")} style={{ width: "100%" }} className="btn btn-warning">Set to HelpDesk agent</button>}
                                        <Link to="/details" style={{ width: "100%" }} className="btn btn-info">Details</Link>
                                        {u.isBanned ? <button onClick={() => this.unbanUser(u.id)} style={{ width: "100%" }} className="btn btn-danger">Unblock access</button> :
                                            <button onClick={() => this.banUser(u.id)} style={{ width: "100%" }} className="btn btn-danger">Block access</button>}
                                        
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