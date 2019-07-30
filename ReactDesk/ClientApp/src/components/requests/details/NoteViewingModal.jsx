import React, { Component } from 'react'

export default class NoteViewingModal extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        let notes = this.props.notes;
        let requestId = this.props.requestId;
        return (
        <div>
            {
                notes != undefined && notes.length > 0 ? <div className="modal" id={'notes_' + requestId} tabIndex="-1" role="dialog">
                    <div className="modal-dialog modal-dialog-scrollable" role="document">
                        <div className="modal-content" style={{ overflow: 'inherit' }}>
                            <div className="modal-body modal-wide">
                                <div className="panel-group">
                                    {notes.map(n =>
                                        <div>
                                            <div className="panel-heading clearfix">
                                                <div className="pull-left"><strong>Author:</strong> {n.author}</div>
                                                <div className="pull-right"><strong>Created On:</strong> {new Date(n.creationTime).toLocaleDateString()}</div>
                                            </div>
                                            <div className="panel-body">
                                                <strong>Description</strong>
                                                <p>{n.description}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={this.props.hideModal}>Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> : null
                }
                </div>
            )
    }
}