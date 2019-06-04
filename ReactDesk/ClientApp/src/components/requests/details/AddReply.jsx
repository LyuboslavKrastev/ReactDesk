import React, { Component } from 'react'

export default class AddReply extends Component {

    hideModal = () => {
        document.getElementById('replyModal').style.display = 'none'
    }

    render() {
        let requestId = this.props.requestId;
        return (
            <div className="modal" id="replyModal" tabindex="-1" role="dialog">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3 className="modal-title text-center">Add Reply</h3>
                        </div>
                        <form asp-area="" asp-controller="Replies" asp-action="Create" method="post">
                            <div className="modal-body">
                                <input style={{ "display": "none" }} name="requestId" value="@Model" />
                                <textarea className="form-control" rows="4" style={{ "min-width": "100%", "resize": "none" }} name="replyDescription"></textarea>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-danger" onClick={this.hideModal}>Close</button>
                                <button type="submit" className="btn btn-success">Add Reply</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}


