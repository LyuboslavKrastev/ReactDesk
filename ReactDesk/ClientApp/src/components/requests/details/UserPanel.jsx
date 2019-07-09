import React, { Component } from 'react'

export default class UserPanel extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        let request = this.props.request
     
        return (
            <div>
                <div className="pull-left"><strong>Status:</strong> {request.status}</div>
                <br/>
                {request.technician ?
                    <div className="pull-right"><strong>Technician:</strong><a data-toggle="modal">{request.technician.fullName}</a>
                    </div> :
                    <div className="pull-right"><strong>Technician: </strong><span className="text-danger"><strong>Unassigned</strong></span></div>}
                <div className="pull-left"><strong>Category:</strong> {request.category}</div>
            </div>
        )
    }

}