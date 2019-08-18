import React, { Component } from 'react'
import { showHistory, showDetails, showResolution, showApprovals } from './DetailsButtonsFunctions'

export default class Menu extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        let approvals = this.props.approvals;
        let resolution = this.props.resolution;
        let notes = this.props.notes;
        let requestId = this.props.requestId;
        return (
            <div>

                <div className="btn-group btn-group-toggle pull-right" data-toggle="buttons">
                    <button className="btn btn-info" data-toggle="modal" onClick={() => this.props.showModal('approvalModal')}>Submit for Approval</button>
                    <button className="btn btn-info" data-toggle="modal" onClick={() => this.props.showModal('noteModal')}>Add Note</button>
                    {notes != undefined && notes.length > 0 ? <button className="btn btn-info" data-toggle="modal" onClick={() => this.props.showModal(`notes_${requestId}`)} > View Notes</button> : null}

                    <button className="btn btn-info pull-right" id="mergeButton">Merge Request</button>
                </div>
                <div className="btn-group btn-group-toggle" data-toggle="buttons">
                    <button className="btn disabled" style={{ display: 'table', 'backgroundColor': '#00611C', color: 'white' }}>Request ID: {requestId}</button>
                    <button id="btn_desc" className="btn btn btn-danger" onClick={showDetails}>Request</button>
                    <button id="btn_res" className="btn btn" onClick={showResolution}>Resolution</button>
                    <button id="btn_hist" className="btn btn" onClick={showHistory}>History</button>
                    {approvals != undefined && approvals.length > 0 ? <button id="btn_appr" className="btn btn" onClick={showApprovals}>Approvals</button> : null}
                </div>
            </div>)
    }
}

