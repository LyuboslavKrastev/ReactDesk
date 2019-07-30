import React, { Component } from 'react'

export default class TechnicianPanel extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        let statuses = this.props.statuses;
        let request = this.props.request;
        let technicians = this.props.technicians
        let categories = this.props.categories

        return (
            <div>
                <div className="col-sm-3 pull-left">
                    <label className="control-label">Status: </label>
                    <select className="form-control" onChange={this.props.setStatus}>
                        {
                            statuses !== null && statuses !== undefined && statuses.length > 0 ?
                                statuses.map((s, index) =>
                                    s.name === request.status ?
                                        <option selected="selected" key={index} value={s.id}>{s.name}</option> :
                                        <option key={index} value={s.id}>{s.name}</option>
                                ) : null
                        }
                    </select>
                </div>

                <div className="pull-right">
                    <label className="control-label">Technician: </label>
                    <select className="form-control" onChange={this.props.setTechnician} >
                        {!request.technician ? <option selected="selected">Unassigned</option> : null}
                        {
                            technicians !== null && technicians !== undefined && technicians.length > 0 ?
                                technicians.map((u, index) =>
                                    <option key={index} value={u.id}>{u.fullName}</option>
                                ) : null
                        }
                    </select>
                </div>

                <div className="pull-left">
                    <label className="control-label pull-left col-sm-1">Category: </label>
                    <select className="form-control" onChange={this.props.setCategory} >
                        {
                            categories !== null && categories !== undefined && categories.length > 0 ?
                                categories.map((c, index) =>
                                    c.name === request.category ?
                                        <option selected="selected" key={index} value={c.id}>{c.name}</option> :
                                        <option key={index} value={c.id}>{c.name}</option>
                                ) : null
                        }
                    </select>
                </div>

                    <div className="col-md-offset-6">
                        <button className="btn btn-success" type="submit" onClick={this.updateRequest} > Save</button>
                    </div>
            </div>
        )
    }

}