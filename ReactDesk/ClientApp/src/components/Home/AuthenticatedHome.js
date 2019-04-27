import React from 'react'
import { Link } from 'react-router-dom';

const AuthenticatedHome = (props) => {
    return (
       <div>
           <div class="box-body clearfix row">
        <div class="col-md-6">
            <h4 class="text-center">Your Requests</h4>
            <div class="chart-container">
                <canvas id="chart" style={{'height':'400px'}}></canvas>
            </div>
        </div>
        <div class="col-md-6">
            <h4 class="text-center">Actions</h4>
            <Link to='/requests/create' className="btn btn-success btn-block">
                Create Request <i class="glyphicon-plus"></i>
            </Link>
            <Link to='/requests' className="btn btn-warning btn-block">View All Requests</Link>
        </div>
        </div>
        </div>)}
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

export default AuthenticatedHome