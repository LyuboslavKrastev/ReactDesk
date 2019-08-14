import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import MyRequestsReport from '../reports/MyRequestsReport'
import { approvalsService } from '../../services/approvals.service';

export default class AuthenticatedHome extends Component {
    constructor(props) {
        super(props)
        // set default approvals counters values
        this.state = {
            "PendingForUser": 0,
            "ApprovedForUser": 0,
            "DeniedForUser": 0,
            "PendingByUser": 0,
            "ApprovedByUser": 0,
            "DeniedByUser": 0,
        };
    }

    getApprovalsCount = (isApprover, status) => {

        if (status != "Pending" && status != "Denied" && status != "Approved") {
            return;
        }

        approvalsService.getApprovalsCount(isApprover, status)
            .then(res => {
                debugger;
                let statusType = res.status;

                if (isApprover) {
                    statusType += "ForUser"
                } else {
                    statusType += "ByUser"
                }

                let count = res.count
                this.setState(
                    {
                        [statusType]: count,
                    })
            }, console.log(this.state))
    }

    componentDidMount = () => {
        setInterval(this.getAllApprovalStatuses(), 60000);
    }

    getAllApprovalStatuses = () => {
        let isApprover = true;
        this.getApprovalsCount(isApprover, "Pending");
        this.getApprovalsCount(isApprover,"Approved");
        this.getApprovalsCount(isApprover, "Denied");

        isApprover = false;
        this.getApprovalsCount(isApprover, "Pending");
        this.getApprovalsCount(isApprover, "Approved");
        this.getApprovalsCount(isApprover, "Denied");
    
    }


    render() {
        return (
            <div>
                <div class="box-body clearfix row">
                    <div class="col-md-6">
                        <h4 className="text-center">Your Requests</h4>
                        <hr />
                        <MyRequestsReport />
                    </div>
                    <div className="col-md-6">
                        <h4 className="text-center">Actions</h4>
                        <hr />
                        <Link to='/requests/create' className="btn btn-success btn-block">
                            Create Request <i class="glyphicon-plus"></i>
                        </Link>
                        <Link to='/requests' className="btn btn-warning btn-block">View All Requests</Link>
                        <h4 className="text-center">Approvals</h4>
                        <hr />
                        <h4 className="text-center">Submitted to you</h4>
                        <Link to='/requests/create' className="btn btn-info btn-block">
                            Pending - {this.state.PendingForUser} <i className="glyphicon glyphicon-envelope"></i>
                        </Link>
                        <Link to='/requests/create' className="btn btn-success btn-block">
                            Approved - {this.state.ApprovedForUser} <i className="glyphicon glyphicon-ok"></i>
                        </Link>
                        <Link to='/requests/create' className="btn btn-danger btn-block">
                            Denied - {this.state.DeniedForUser} <i className="glyphicon glyphicon-remove"></i>
                        </Link>
                        <h4 className="text-center">Submitted by you</h4>
                        <Link to='/requests/create' className="btn btn-info btn-block">
                            Pending - {this.state.PendingByUser} <i className="glyphicon glyphicon-envelope"></i>
                        </Link>
                        <Link to='/requests/create' className="btn btn-success btn-block">
                            Approved - {this.state.ApprovedByUser} <i className="glyphicon glyphicon-ok"></i>
                        </Link>
                        <Link to='/requests/create' className="btn btn-danger btn-block">
                            Denied - {this.state.DeniedByUser} <i className="glyphicon glyphicon-remove"></i>
                        </Link>
                    </div>
                </div>
            </div>)
    }
    /*{ @if (Model.Model.SubmittedApprovals.Any() || Model.Model.ApprovalsToApprove.Any())
    {
        <h4 class="text-center">Approvals</h4>
        <div class="col-md-6">
            <table class="table table-hover table-bordered">
                <tr>
                    <th class="text-center">To Approve</th>
                </tr>
                <tbody>
                    @foreach (var approval in Model.Model.ApprovalsToApprove)
                    {
                        <tr>
                            <td>
                                Subject: @approval.Subject
                                <br>
                                <a asp-area="" asp-controller="Requests" asp-action="Details" asp-route-id="@approval.RequestId">Click here to view request</a>
                            </td>
                        </tr>
                    }

                </tbody>
            </table>
        </div>

        <div class="col-md-6">
            <table class="table table-hover table-bordered">
                <tr>
                    <th class="text-center">Submitted</th>
                </tr>

                <tbody>
                    @foreach (var approval in Model.Model.SubmittedApprovals)
                    {
                        <tr>
                            <td>
                                Subject: @approval.Subject
                                <br>
                                <a asp-area="" asp-controller="Requests" asp-action="Details" asp-route-id="@approval.RequestId">Click here to view request</a>
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
        </div>
</div>
)
} }*/

} 