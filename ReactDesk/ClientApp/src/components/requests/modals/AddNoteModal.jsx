import React, { Component } from 'react'
import { notesService } from '../../../services/notes.service'
import { NotificationManager } from 'react-notifications';
import getCheckedBoxes  from '../../../helpers/checkbox-checker'

export default class AddNoteModal extends Component{

    constructor(props) {
        super(props)

        this.state = ({
            description: ''
        })
    }

    hideModal = () => {
        document.getElementById('noteModal').style.display = 'none'
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
       
        notesService.createNote(ids, description)
            .then(res => {
                if (res) {
                    NotificationManager.success('Successfully added note.');
                    setTimeout(window.location.reload(), 4000);
                    
                    return this.hideModal();

                }
                else {
                    console.log(res)
                    return NotificationManager.error(res.error)
                }
            })
    }

    render(){
        return(
            <div className="modal" id="noteModal" tabIndex="-1" role="dialog">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3 className="modal-title text-center">Add Note</h3>
                        </div>
                        <div className="modal-body">
                            <textarea id="noteDescription" name='description' className="form-control" rows="4" style={{ minWidth: '100%', resize: 'none' }} onChange={this.handleInputChange} ></textarea>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-danger" onClick={this.hideModal}>Close</button>
                            <button type="button" className="btn btn-success" id="noteBtn" onClick={this.handleSubmit}>Add Note</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}