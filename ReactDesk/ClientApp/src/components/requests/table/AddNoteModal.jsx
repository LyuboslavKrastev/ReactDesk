import React, { Component } from 'react'

export default class AddNoteModal extends Component{

    hideModal = () => {
        document.getElementById('noteModal').style.display = 'none'
    }

    render(){
        return(
            <div className="modal" id="noteModal" tabindex="-1" role="dialog">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3 className="modal-title text-center">Add Note</h3>
                        </div>
                        <div className="modal-body">
                            <textarea id="noteDescription" className="form-control" rows="4" style={{'min-width': '100%', resize: 'none'}}></textarea>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={this.hideModal}>Close</button>
                            <button type="button" className="btn btn-success" id="noteBtn" onClick={this.hideModal}>Add Note</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}