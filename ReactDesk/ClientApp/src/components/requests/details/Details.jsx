import React, { Component } from 'react'
import { showHistory, showDetails, showResolution } from './DetailsButtons'
import { requestService } from '../../../services/requests.service'
import AddNoteModal from '../modals/AddNoteModal'
import { showNotes, hideNotes } from '../modals/note-view-modal-controls'

export default class RequestDetails extends Component {

    constructor(props) {
        super(props)

        this.state = {
            request: {}
        }
    }

    componentDidMount = () => {
        debugger;
        let id = this.props.match.params.id;
        requestService.getById(id)
            .then(res => {
                console.log(res);
                this.setState({
                    request: res
                })
            })
    }

    showModal = () => {
        document.getElementById('noteModal').style.display = 'block'
    }


    render() {
        let request = this.state.request;
        console.log('notes: ')
        console.log(request.notes);

        return (
            <div>
                <AddNoteModal requestId={request.id} />
                {request.notes != undefined && request.notes.length > 0 ? <div class="modal" id={'notes_' + request.id} tabindex="-1" role="dialog">
                    <div class="modal-dialog modal-dialog-scrollable" role="document">
                        <div class="modal-content" style={{ overflow: 'inherit' }}>
                            <div class="modal-body modal-wide">
                                <div class="panel-group">
                                    {request.notes.map(n =>
                                        <div>
                                            <div class="panel-heading clearfix">
                                                <div class="pull-left"><strong>Author:</strong> {n.author}</div>
                                                <div class="pull-right"><strong>Created On:</strong> {new Date(n.creationTime).toLocaleDateString()}</div>
                                            </div>
                                            <div class="panel-body">
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
                </div> : null }

                
                <div className="btn-group btn-group-toggle" data-toggle="buttons">
                    <button className="btn disabled" style={{ display: 'table', 'background-color': '#00611C', color: 'white' }}>Request ID: {request.id}</button>
                    <button id="btn_desc" class="btn btn btn-danger" onClick={showDetails}>Request</button>
                    <button id="btn_res" class="btn btn" onClick={showResolution}>Resolution</button>
                    <button id="btn_hist" class="btn btn" onClick={showHistory}>History</button>
                    {request.approvals ? <button id="btn_appr" class="btn btn">Approvals</button> : null}
                </div>
                <div class="panel-group" id="resolution" style={{ display: 'none' }}>
                    <div class="panel">
                        <div className="panel-heading clearfix">
                            <div class="pull-left"><strong>Resolution</strong></div>
                        </div>
                        <div class="panel-body">
                            {request.resolution}
                        </div>
                    </div>
                </div>

                <div class="btn-group btn-group-toggle pull-right" data-toggle="buttons">
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
                        <div class="panel-body"><p>Model.History</p></div>
                    </div>
                </div>
                <div className="panel-group" id="request">
                    <div className="panel">
                        <div className="panel-heading clearfix">
                            <div className="pull-left"><strong>Requester:</strong> <a data-toggle="modal" data-target="#@Model.Author.Id">{request.requester}</a></div>
                            <div className="pull-right"><strong>Created On:</strong> {request.StartTime}</div>
                        </div>
                        <div className="panel-body" style={{ height: '300px', 'overflow-y': 'scroll' }}>
                            <p><strong>Subject:</strong> {request.subject}</p>
                            <strong>Description</strong>
                            <p>{request.description}</p>
                        </div>

                        <div className="panel-footer clearfix">
                            <div className="pull-left"><strong>Status:</strong> {request.Status}</div>
                            {
                                request.assignedTo ?
                                    <div className="pull-right"><strong>Technician:</strong><a data-toggle="modal" data-target="#@Model.Technician.Id">{request.assignedTo}</a>
                                    </div> :
                                    <div className="pull-right"><strong>Technician: </strong><span className="text-danger"><strong>Unassigned</strong></span></div>

                            }
                            {/*             
            @if (Model.Technician != null)
            {
                <div className="pull-right"><strong>Technician:</strong><a data-toggle="modal" data-target="#@Model.Technician.Id"> @Model.Technician.UserName</a></div>
            }
            else
            {
                <div className="pull-right"><strong>Technician: <span className="text-danger">Unassigned</span></strong></div>
            } */}
                            <br />
                            <div className="pull-left"><strong>Category:</strong> {request.category}</div>
                            {/* @if (Model.Attachments.Any())
            {
                <div className="text-center">
                    @foreach (var attachment in Model.Attachments)
                    {
                        <label asp-for="@attachment">Attachment: </label>
                        <a asp-controller="Requests" asp-action="Download"
                           asp-route-filename="@attachment.FileName" asp-route-filePath="@attachment.PathToFile" asp-route-requestId="@Model.Id">
                            @attachment.FileName
                        </a>
                        <br />
                    }
                </div>
            } */}
                        </div>

                    </div>
                </div>
                <div className="panel-group" id="resolution" style={{ display: "none" }}>
                    <div className="panel">
                        <div className="panel-heading clearfix">
                            <div className="pull-left"><strong>Resolution</strong></div>
                        </div>
                        <div className="panel-body">
                            @Model.Resolution
        </div>
                    </div>
                </div>
                <div className="panel-group" id="history" style={{ display: "none" }}>
                    <div className="panel">
                        <div className="panel-heading clearfix">
                            <div className="pull-left"><strong>History</strong></div>
                        </div>
                        <div className="panel-body"><p>Model.History</p></div>
                    </div>
                </div>

                <partial name="ReplyListPartial" for="Replies" />
                <button className="btn btn-info" data-toggle="modal" data-target="#replyModal">Reply</button>

                <div className="modal fade" id="dynamic-modal" tabindex="-1" role="dialog">
                    <div className="modal-dialog" role="document"></div>
                </div>

            </div>
        )
    }

}