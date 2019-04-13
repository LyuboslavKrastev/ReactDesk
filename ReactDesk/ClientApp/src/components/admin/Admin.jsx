import React, { Component } from 'react';
import { userService } from '../../services/user.service'

export default class Admin extends Component{
    constructor(props) {
        super(props)

        this.state = {
            data: null //This is what our data will eventually be loaded into
        };
    }

    componentWillMount = () => {
        userService.getAll()
            .then(res => this.setState({ data: res}))
    }
    
    render() {
        if (!this.state.data) {
            return <div />
        }
        return <h1>HI ADMIN</h1>
    }
}