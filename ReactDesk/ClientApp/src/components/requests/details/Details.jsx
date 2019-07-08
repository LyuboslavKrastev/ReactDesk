import React, { Component } from 'react'
import { showHistory, showDetails, showResolution } from './DetailsButtons'
import { requestService } from '../../../services/requests.service'
import AddNoteModal from '../modals/AddNoteModal'
import { showNotes, hideNotes } from '../modals/note-view-modal-controls'
import Replies from './Replies';
import AddReply from './AddReply';

import { authenticationService } from '../../../services/authentication.service';
import { categoriesService } from '../../../services/categories.service'
import { statusService } from '../../../services/status.service'
import { NotificationManager } from 'react-notifications';
import { userService } from '../../../services/user.service';




export default class RequestDetails extends Component {

    constructor(props) {
        super(props)

        this.state = {
            request: {},
            currentUser: null
        }
    }

    componentDidMount = () => {
        authenticationService.currentUser.subscribe(x => this.setState({
            currentUser: x
        }, function () {
            this.loadRequest();

            if (this.state.currentUser.role === 'Admin') {
                this.loadStatuses();
                this.loadCategories();
                this.loadTechnicians();
            }
        }));

    }

    loadStatuses = () => {
        statusService.getAll()
            .then(res => this.setState(
                {
                    statuses: res
                }))
    }

    loadRequest = () => {

        let id = this.props.match.params.id;
        requestService.getById(id)
            .then(res => {
                console.log(res);
                this.setState({
                    request: res
                })
            })
    }

    loadCategories = () => {
        categoriesService.getAll()
            .then(res => this.setState(
                {
                    categories: res
                }))
    }

    loadTechnicians = () => {
        userService.getAllTechnicians()
            .then(res => this.setState(
                {
                    technicians: res
                }, function () {
                    console.log(this.state)
                }))
    }

    showModal = () => {
        document.getElementById('noteModal').style.display = 'block'
    }

    getFile = (fileName, filePath, id) => {
        requestService.getFile(fileName, filePath, id)
            .then(res => console.log(res))
    }

    showAddReplyModal = () => {
        document.getElementById('replyModal').style.display = 'block'
    }

    setStatus = (event) => {
        let value = event.target.value;
        this.setState({
            status: value
        })
    }

    setTechnician = (event) => {
        let value = event.target.value;
        this.setState({
            technician: value
        })
    }

    setCategory = (event) => {
        let value = event.target.value;
        this.setState({
            category: value
        })
    }

    updateRequest = () => {
        let data = {
            id: this.state.request.id,
        };

        if (this.state.status !== undefined) {
            data['statusId'] = this.state.status
        }
        if (this.state.category !== undefined) {
            data['categoryId'] = this.state.category
        }
        if (this.state.technician !== undefined) {
            data['assignedToId'] = this.state.technician
        }

        requestService.updateRequest(data)
            .then(res => {
                if (res.message) {
                    NotificationManager.success(res.message)
                } else if (res.error) {
                    debugger
                    let message = res.error
                    NotificationManager.error(message)
                }
            })
    }

    render() {
        let request = this.state.request;
        let categories = this.state.categories
        let statuses = this.state.statuses
        let technicians = this.state.technicians

        return (
            <div>
                <AddNoteModal requestId={request.id} />
                {request.notes != undefined && request.notes.length > 0 ? <div className="modal" id={'notes_' + request.id} tabIndex="-1" role="dialog">
                    <div className="modal-dialog modal-dialog-scrollable" role="document">
                        <div className="modal-content" style={{ overflow: 'inherit' }}>
                            <div className="modal-body modal-wide">
                                <div className="panel-group">
                                    {request.notes.map(n =>
                                        <div>
                                            <div className="panel-heading clearfix">
                                                <div className="pull-left"><strong>Author:</strong> {n.author}</div>
                                                <div className="pull-right"><strong>Created On:</strong> {new Date(n.creationTime).toLocaleDateString()}</div>
                                            </div>
                                            <div className="panel-body">
                                                <strong>Description</strong>
                                                <p>{n.description}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => { hideNotes(request.id) }}>Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> : null}


                <div className="btn-group btn-group-toggle" data-toggle="buttons">
                    <button className="btn disabled" style={{ display: 'table', 'backgroundColor': '#00611C', color: 'white' }}>Request ID: {request.id}</button>
                    <button id="btn_desc" className="btn btn btn-danger" onClick={showDetails}>Request</button>
                    <button id="btn_res" className="btn btn" onClick={showResolution}>Resolution</button>
                    <button id="btn_hist" className="btn btn" onClick={showHistory}>History</button>
                    {request.approvals ? <button id="btn_appr" className="btn btn">Approvals</button> : null}
                </div>
                <div className="panel-group" id="resolution" style={{ display: 'none' }}>
                    <div className="panel">
                        <div className="panel-heading clearfix">
                            <div className="pull-left"><strong>Resolution</strong></div>
                        </div>
                        <div className="panel-body">
                            {request.resolution}
                        </div>
                    </div>
                </div>

                <div className="btn-group btn-group-toggle pull-right" data-toggle="buttons">
                    <button className="btn btn-info" data-toggle="modal" data-target="#approvalModal">Submit for Approval</button>
                    <button className="btn btn-info" data-toggle="modal" onClick={this.showModal}>Add Note</button>
                    {request.notes != undefined && request.notes.length > 0 ? <button className="btn btn-info" data-toggle="modal" onClick={() => showNotes(request.id)} > View Notes</button> : null}

                    <button className="btn btn-info pull-right" id="mergeButton">Merge Request</button>
                </div>
                <div className="panel-group" id="history" style={{ display: 'none' }}>
                    <div className="panel">
                        <div className="panel-heading clearfix">
                            <div className="pull-left"><strong>History</strong></div>
                        </div>
                        <div className="panel-body"><p>Model.History</p></div>
                    </div>
                </div>
                <div className="panel-group" id="request">
                    <div className="panel">
                        <div className="panel-heading clearfix">
                            <div className="pull-left"><strong>Requester:</strong> <a data-toggle="modal" data-target="#@Model.Author.Id">{request.author ? request.author.fullName : null}</a></div>
                            <div className="pull-right"><strong>Created On:</strong> {request.createdOn}</div>
                        </div>
                        <div className="panel-body" style={{ height: '300px', overflowY: 'scroll' }}>
                            <p><strong>Subject:</strong> {request.subject}</p>
                            <strong>Description</strong>
                            <p>{request.description}</p>
                        </div>

                        <div className="panel-footer clearfix">
                            {this.state.currentUser !== null && this.state.currentUser.role === "Admin" ?
                                <div className="col-sm-3 pull-left">>
                                    <label className="control-label pull-left col-sm-1" asp-for="bindingModel.CategoryId">Status: </label>

                                    <select className="form-control" onChange={this.setStatus}>
                                        {
                                            statuses !== null && statuses !== undefined && statuses.length > 0 ?
                                                statuses.map((s, index) =>
                                                    s.name === request.status ?
                                                        <option selected="selected" key={index} value={s.id}>{s.name}</option> :
                                                        <option key={index} value={s.id}>{s.name}</option>
                                                ) : null
                                        }
                                    </select>
                                </div> : <div className="pull-left"><strong>Status:</strong> {request.status}</div>

                            }
                            {
                                this.state.currentUser !== null && this.state.currentUser.role === "Admin" ?
                                    <div className="pull-right">
                                        <label className="control-label pull-left col-sm-1">Technician: </label>
                                        <select className="form-control" onChange={this.setTechnician} >
                                            {
                                                technicians !== null && technicians !== undefined && technicians.length > 0 ?
                                                    technicians.map((u, index) =>
                                                        <option key={index} value={u.id}>{u.fullName}</option>
                                                    ) : null
                                            }
                                        </select>
                                    </div> : request.assignedTo ?

                                        <div className="pull-right"><strong>Technician:</strong><a data-toggle="modal" data-target="#@Model.Technician.Id">{request.assignedTo}</a>
                                        </div> :
                                        <div className="pull-right"><strong>Technician: </strong><span className="text-danger"><strong>Unassigned</strong></span></div>

                            }
                            {this.state.currentUser !== null && this.state.currentUser.role === "Admin" ?
                                <div className="pull-left">
                                    <label className="control-label pull-left col-sm-1">Category: </label>
                                    <select className="form-control" onChange={this.setCategory} >
                                        {
                                            categories !== null && categories !== undefined && categories.length > 0 ?
                                                categories.map((c, index) =>
                                                    c.name === request.category ?
                                                        <option selected="selected" key={index} value={c.id}>{c.name}</option> :
                                                        <option key={index} value={c.id}>{c.name}</option>
                                                ) : null
                                        }
                                    </select>
                                </div> : <div className="pull-left"><strong>Category:</strong> {request.category}</div>
                            }

                            {request.attachments !== undefined && request.attachments.length > 0 ?
                                <div className="text-center">
                                    <br />
                                    <label className="text-center">Attachments: </label>
                                    <hr />
                                    {request.attachments.map((a, index) =>
                                        <div key={index}>
                                            <a onClick={() => this.getFile(a.fileName, a.pathToFile, a.id)}>
                                                {a.fileName}
                                            </a>
                                            <br />
                                        </div>
                                    )}
                                </div>
                                : null}
                            <br />
                            <div className="panel-footer clearfix">
                                <div className="col-md-offset-6">
                                    <button className="btn btn-success" type="submit" onClick={this.updateRequest} > Save</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="panel-group" id="resolution" style={{ display: "none" }}>
                    <div className="panel">
                        <div className="panel-heading clearfix">
                            <div className="pull-left"><strong>Resolution</strong></div>
                        </div>
                        <div className="panel-body">
                            TO BE IMPLEMENTED
        </div>
                    </div>
                </div>
                <div className="panel-group" id="history" style={{ display: "none" }}>
                    <div className="panel">
                        <div className="panel-heading clearfix">
                            <div className="pull-left"><strong>History</strong></div>
                        </div>
                        <div className="panel-body"><p>TO BE IMPLEMENTED</p></div>
                    </div>
                </div>



                {request.replies !== undefined && request.replies.length > 0 ? <Replies replies={request.replies} /> : null}
                <div className='text-center'>
                    <button className="btn btn-success" onClick={this.showAddReplyModal}>Reply</button>
                </div>
                <AddReply requestId={request.id} />

            </div>
        )
    }

}