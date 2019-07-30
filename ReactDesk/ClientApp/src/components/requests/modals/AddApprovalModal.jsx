import React, { Component } from 'react';
import approvalsService from '../../../services/approvals.service';
import { NotificationManager } from 'react-notifications';

export default class AddApprovalModal extends Component {
    constructor(props) {
        super(props)
    }

    handleInputChange = (event) => {
        let inputName = event.target.name;
        let inputValue = event.target.value;
        this.setState({
            [inputName]: inputValue
        })
    }

    handleSubmit = (event) => {
        debugger
        event.preventDefault();

        let description = this.state.description
        if (!description) {
            NotificationManager.error('Notes must have a description.')

            return;
        }
        // Get the id, passed from the details page, or the checked checkboxes from the requests table
        let ids = [];
        let requestId = this.props.requestId;
        if (requestId) {
            ids.push(requestId)
        } else {
            ids = getCheckedBoxes("requestCheckbox");
            if (!ids) {
                NotificationManager.error('Please select request[s] in order to add a note.');
                return;
            }
        }

        approvalsService.createApproval(ids, description)
            .then(res => {
                if (res) {
                    NotificationManager.success('Successfully added note.');
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
                                    <select asp-for="ApproverId" name="approverId" className="form-control">
                                        {
                                            technicians !== null && technicians !== undefined && technicians.length > 0 ?
                                                technicians.map((u, index) =>
                                                    <option key={index} value={u.id}>{u.fullName}</option>
                                                ) : null
                                        }
                                    </select>
                                    <br />
                                    <label htmlFor="subject">Subject</label>
                                    <input className="form-control" name="subject" />
                                    <span asp-validation-for="Subject" className="text-danger"></span>
                                    <br />
                                    <label htmlFor="description">Description</label>
                                    <textarea asp-for="Description" className="form-control" name="description" rows="4" style={{ minWidth: "100%", resize: "none" }}></textarea>
                                    <span asp-validation-for="Description" className="text-danger"></span>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={this.props.hideModal}>Close</button>
                                    <button type="submit" className="btn btn-success">Submit</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}