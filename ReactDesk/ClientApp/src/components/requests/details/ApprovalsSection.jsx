import React, { Component } from 'react'
import { approvalsService } from '../../../services/approvals.service';
import { NotificationManager } from 'react-notifications';

export default class ApprovalsSection extends Component {
    constructor(props) {
        super(props)
    }

    updateApproval = (approvalId, isApproved) => {
        debugger;
        approvalsService.update(approvalId, isApproved)
            .then(res => {
                NotificationManager.info(res.message);
                this.props.reload();
            })
    }

    render() {
        let currentUser = this.props.currentUser;
        console.log(currentUser)
        let approvals = this.props.approvals;
        console.log('approvals')
        console.log(approvals)
        return (
            <div>
                {approvals != null && approvals != undefined && approvals.length > 0 ?
                    approvals.map((a, index) =>
                        <div key={index} class="panel-group">
                            <div class="panel">
                                <div class="panel-heading clearfix" style={a.status == "Approved" ? { backgroundColor: "green" } : a.status == "Denied" ? { backgroundColor: "red" } : null}>
                                    <div class="pull-left"><strong>Approval</strong></div>
                                </div>
                                <div class="panel-body">
                                    <strong>Subject: {a.subject}</strong>
                                    <br />
                                    <strong>Status: {a.status}</strong>
                                    <br />
                                    <strong>Description: </strong>{a.description}
                                </div>
                                <div class="panel-footer">
                                    <div class="col-md-offset-5">
                                        {a.status === 'Pending' && a.approverId === currentUser.id ?
                                            <div>
                                                <button className="btn btn-success" onClick={() => this.updateApproval(a.id, true)} > Approve</button>
                                                <button className="btn btn-danger" onClick={() => this.updateApproval(a.id, false)} > Deny</button>
                                            </div>:
                                            null}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )

                    : null}
            </div>
        )
    }
}

//@if (Model.Any()) {
//    <div id="approvals" style="display:none">
//        @foreach (var approval in Model)
//    {
//        if(approval.Status == "Denied")
//        {
//            color = "red";
//        }
//        else if(approval.Status == "Approved")
//        {
//            color = "lawngreen";
//        }
//        else
//        {
//            color = "yellow";
//        }
//        <div class="panel-group">
//            <div class="panel">
//                <div class="panel-heading clearfix">
//                    <div class="pull-left"><strong>Approval</strong></div>
//                </div>
//                <div class="panel-body" style="background-color:@color">
//                    <p><strong>Subject: @approval.Subject</strong></p>
//                    <p><strong>Status: @approval.Status</strong></p>

//                    <strong>Description: </strong>@approval.Description
//                </div>
//                <div class="panel-footer">
//                    <div class="col-md-offset-5">
//                        @{
//                            if (approval.ApproverId == userManager.GetUserId(User))
//                            {
//                                if (approval.Status == "Denied")
//                                {
//                            <p class="danger"><strong>Denied</strong></p>
//                        }
//                        else if (approval.Status == "Approved")
//                                {
//                            <p class="success"><strong>Approved</strong></p>
//                        }
//                        else
//                                {
//                            <form method="post" asp-area="" asp-controller="Approvals" asp-action="ApproveApproval" asp-route-approvalId="@approval.Id" asp-route-requestId="@approval.RequestId">
//                                <button type="submit" class="btn btn-success">Approve</button>
//                            </form>
//                            <form method="post" asp-area="" asp-controller="Approvals" asp-action="DenyApproval" asp-route-approvalId="@approval.Id" asp-route-requestId="@approval.RequestId">
//                                <button type="submit" class="btn btn-danger">Deny</button>
//                            </form>
//                                }

//                        }
//                    }
//                    </div>
//                </div>
//            </div>
//        </div>
//        }
//</div>
//}