import React, { Component } from 'react';
import { approvalsService  }from '../../../services/approvals.service';
import { NotificationManager } from 'react-notifications';

const DEFAULT_SELECTOPTION_VALUE = '----------Select technician----------';

export default class AddApprovalModal extends Component {
    constructor(props) {
        super(props);
        let urlElements = window.location.pathname.split('/');
        let id = urlElements[urlElements.length - 1];

        console.log(id);
        this.state = {
            requestId: id,
            subject: `Approval required for request ${id}`,
            description: 'Your approval is required for a request to act upon.'
        }
    }

    handleInputChange = (event) => {
        debugger;
        let inputName = event.target.name;
        let inputValue = event.target.value;
        if (inputValue === DEFAULT_SELECTOPTION_VALUE) {
            NotificationManager.warning("Please, select a technician");
            return;
        }
        this.setState({
            [inputName]: inputValue
        })
    }

    handleSubmit = (event) => {
        //debugger
        event.preventDefault();
        let requestId = this.state.requestId;
        let approverId = this.state.approverId;
        if (!approverId) {
            NotificationManager.error('Please select an approver.');
            return;
        }
        let subject = this.state.subject;
        if (!subject) {
            NotificationManager.error('Subject is required.');
            return;
        }
        let description = this.state.description;
        if (!description) {
            NotificationManager.error('Description is required.');
            return;
        }

        approvalsService.createApproval(requestId, approverId, subject, description)
            .then(res => {
                if (res) {
                    NotificationManager.success('Successfully submitted approval.');
                    this.props.reload();

                    return this.props.hideModal();

                }
                else {
                    console.log(res)
                    return NotificationManager.error(res.error)
                }
            })
    }

    

    render() {
        let requestId = this.props.requestId;
        let technicians = this.props.technicians;
        return (

            <div>
                <div className="modal" id="approvalModal" tabIndex="-1" role="dialog">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3 className="modal-title text-center">Submit for Approval</h3>
                            </div>
                            <form asp-area="" asp-controller="Approvals" asp-action="AddApproval" asp-route-requestId="@Model.RequestId" method="post">
                                <div className="modal-body">
                                    <label>To</label>
                                    <select name="approverId" className="form-control" onChange={this.handleInputChange} >
                                        <option selected="selected">{DEFAULT_SELECTOPTION_VALUE}</option>
                                        {
                                            technicians !== null && technicians !== undefined && technicians.length > 0 ?
                                                technicians.map((u, index) =>
                                                    <option key={index} value={u.id}>{u.fullName}</option>
                                                ) : null
                                        }
                                    </select>
                                    <br />
                                    <label htmlFor="subject">Subject</label>
                                    <input className="form-control" type="text" value={this.state.subject} onChange={this.handleInputChange} name="subject" />
                                    <br/>
                                    <span asp-validation-for="Subject" className="text-danger"></span>

                                    <label htmlFor="description">Description</label>
                                    <textarea asp-for="Description" className="form-control" name="description" value={this.state.description} onChange={this.handleInputChange} rows="4" style={{ minWidth: "100%", resize: "none" }}></textarea>
                                    <span asp-validation-for="Description" className="text-danger"></span>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={this.props.hideModal}>Close</button>
                                    <button type="submit" className="btn btn-success" onClick={this.handleSubmit} > Submit</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}