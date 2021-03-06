﻿import React, { Component } from 'react'
import { requestService } from '../../../services/requests.service'
import AddNoteModal from '../modals/AddNoteModal'
import Replies from './Replies';
import AddReply from './AddReply';

import { authenticationService } from '../../../services/authentication.service';
import { categoriesService } from '../../../services/categories.service'
import { statusService } from '../../../services/status.service'
import { NotificationManager } from 'react-notifications';
import { userService } from '../../../services/user.service';
import TechnicianPanel from './TechnicianPanel';
import UserPanel from './UserPanel';
import NoteViewingModal from './NoteViewingModal';
import AttachmentsSection from './AttachmentsSection';
import Menu from './Menu';
import AddApprovalModal from '../modals/AddApprovalModal';
import ApprovalsSection from './ApprovalsSection';




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
            let role = this.state.currentUser.role;
            if (role === 'Admin' || role === 'Helpdesk') {
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
                    originalResolution: res.resolution,
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
                }))
    }

    showModal = (modalName) => {
        document.getElementById(modalName).style.display = 'block'
    }

    hideModal = (modalName) => {
        document.getElementById(modalName).style.display = 'none'
    }

    getFile = (fileName, filePath, id) => {
        requestService.getFile(fileName, filePath, id)
            .then(res => console.log(res))
    }

    setStatus = (event) => {
        let value = event.target.value;
        this.setState({
            status: value
        })
    }

    setTechnician = (event) => {
        let value = event.target.value;
        if (value === 'Unassigned') {
            return;
        }
        this.setState({
            technician: value
        })
    }

    setCategory = (event) => {
        debugger;
        let value = event.target.value;
        this.setState({
            category: value
        })
    }

    resetResolution = () => {
        let modifiedRequest = this.state.request;
        modifiedRequest.resolution = this.state.originalResolution;

        this.setState({
            request: modifiedRequest
        });
    }

    //TODO: remove all the setX methods and combine them into one
    setResolution = (event) => {
        debugger;
        let value = event.target.value;
        let modifiedRequest = this.state.request;
        modifiedRequest.resolution = value;
        this.setState({
            request: modifiedRequest
        })
    }

    updateRequest = (ev) => {
        ev.preventDefault();
        debugger;
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
            data['assignToId'] = this.state.technician
        }

        if (this.state.request.resolution != undefined) {
            data['resolution'] = this.state.request.resolution
        }

        requestService.updateRequest(data)
            .then(res => {
                if (res.message) {
                    NotificationManager.success(res.message)
                    this.loadRequest();
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
                <AddNoteModal requestId={request.id} reload={this.loadRequest} hideModal={() => this.hideModal('noteModal')} />
                <AddApprovalModal technicians={technicians} requestId={request.id} reload={this.loadRequest} hideModal={() => this.hideModal('approvalModal')} />
                <NoteViewingModal notes={request.notes} requestId={request.id} hideModal={() => this.hideModal(`notes_${request.id}`)} />
                <Menu notes={request.notes} approvals={request.approvals} resolution={request.resolution}
                    requestId={request.id} showModal={this.showModal} />

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
                            {this.state.currentUser !== null && (this.state.currentUser.role === "Admin" || this.state.currentUser.role === "Helpdesk") ?
                                <TechnicianPanel updateRequest={this.updateRequest} request={request} statuses={statuses} technicians={technicians} categories={categories}
                                    setCategory={this.setCategory} setStatus={this.setStatus} setTechnician={this.setTechnician} /> :
                                <UserPanel request={request} />

                            }
                            <AttachmentsSection attachments={request.attachments} getFile={this.getFile} />


                        </div>
                    </div>
                </div>
                <div className="panel-group" id="resolution" style={{ display: "none" }}>
                    <div className="panel">
                        <div className="panel-heading clearfix">
                            <div className="pull-left"><strong>Resolution</strong></div>
                        </div>
                        <div className="panel-body">
                            <p htmlFor="resolution" style={{ wordWrap: "break-word" }}>{this.state.originalResolution}</p>

                            {this.state.currentUser !== null && (this.state.currentUser.role === "Admin" || this.state.currentUser.role === "Helpdesk") ?

                                <form onSubmit={this.updateRequest} className="form-horizontal" encType="multipart/form-data">
                                    <label htmlFor="resolution">Set to:</label>

                                    <textarea rows="5" className="form-control" name="Resolution" onChange={this.setResolution} value={this.state.request.resolution} ></textarea>
                                    <div className="form-group">
                                        <br />
                                        <div className="col-md-offset-5">
                                            <input onClick={this.resetResolution} value="Cancel" className="btn btn-danger" />
                                            <input type="submit" value="Set" className="btn btn-success" />
                                        </div>
                                    </div>
                                </form> : null
                            }
                           
                           
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

                <div className="panel-group" id="approvals" style={{ display: 'none' }}>
                    <ApprovalsSection approvals={request.approvals} currentUser={this.state.currentUser} reload={this.loadRequest} />
                </div>



                {request.replies !== undefined && request.replies.length > 0 ? <Replies replies={request.replies} /> : null}
                <div className='text-center'>
                    <button className="btn btn-success" onClick={() => this.showModal('replyModal')}>Reply</button>
                </div>
                <AddReply requestId={request.id} loadRequest={this.loadRequest} />

            </div>
        )
    }

}