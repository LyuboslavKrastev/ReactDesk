import React, { Component } from 'react'
import { repliesService } from '../../../services/replies.service' 
import { NotificationManager } from 'react-notifications';

export default class AddReply extends Component {

    constructor(props) {
        super(props)

        this.state = {
            description: ''
        }
    }

    hideModal = () => {
        document.getElementById('replyModal').style.display = 'none'
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
            NotificationManager.error('Replies must have a description.')
            return;
        }

        let requestId = this.props.requestId;
        if (!requestId) {
            NotificationManager.error('Request id not found.')
            return;
        } 

        repliesService.createReply(requestId, description)
            .then(res => {
                if (res) {
                    NotificationManager.success('Successfully added reply.');
                    setTimeout(window.location.reload(), 4000);

                    return this.hideModal();

                }
                else {
                    console.log(res)
                    return NotificationManager.error(res.error)
                }
            })
    }


    render() {
        return (
            <div className="modal" id="replyModal" tabindex="-1" role="dialog">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3 className="modal-title text-center">Add Reply</h3>
                        </div>
                        <form asp-area="" asp-controller="Replies" asp-action="Create" method="post">
                            <div className="modal-body">
                                <label htmlFor='description'>Description</label>
                                <textarea onChange={this.handleInputChange} className="form-control" rows="4" style={{ "min-width": "100%", "resize": "none" }} name="description"></textarea>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-danger" onClick={this.hideModal}>Close</button>
                                <button type="submit" className="btn btn-success" onClick={this.handleSubmit} > Add Reply</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}


