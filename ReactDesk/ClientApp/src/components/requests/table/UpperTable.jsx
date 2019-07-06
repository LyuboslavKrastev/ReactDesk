import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import AddNoteModal from '../modals/AddNoteModal';
import { statusService } from '../../../services/status.service'
import getCheckedBoxes from '../../../helpers/checkbox-checker'
import { requestService } from '../../../services/requests.service'
import { NotificationManager } from 'react-notifications';

export default class UpperTable extends Component {
    constructor(props) {
        super(props)

        this.state = {
            ReqPerPageList: [1, 5, 10, 15, 25, 50, 100, 150, 200, 250, 1000],
            statuses: []
        }
    }

    showModal = () => {
        document.getElementById('noteModal').style.display = 'block'
    }

    componentDidMount = () => {
        statusService.getAll()
            .then(res => {
                this.setState({
                    statuses: res
                })
            })
    }

    mergeRequests = () => {
        let ids = getCheckedBoxes('requestCheckbox');

        if (!ids) {
            NotificationManager.error('Please select request[s] for merging')
            return;
        }

        requestService.mergeRequests(ids)
            .then(r => {
                if (r.error || !r.message) {
                    NotificationManager.error('Please select request[s] for merging')

                } else {
                    NotificationManager.success(r.message)
                    setTimeout(window.location.reload(), 3000)          
                }
            });
    }

    deleteRequests = () => {
        debugger
        let ids = getCheckedBoxes('requestCheckbox');

        if (!ids) {
            NotificationManager.error('Please select request[s] for deletion')
            return;
        }

        requestService.deleteRequests(ids)
            .then(r => {
                if (r.error || !r.message) {
                    NotificationManager.error('Please select request[s] for deletion')

                } else {
                    NotificationManager.success(r.message)
                    setTimeout(window.location.reload(), 3000)
                }
            });
    }


    render() {
        let perPage = this.props.perPage;
        let selectList = this.state.ReqPerPageList.map(function (selectOption) {
            return (
                    <option value={selectOption}>{selectOption}</option>
            )
        })
        let statusList = this.state.statuses.map(function (status) {
            return (
                <option value={status.id}>{status.name}</option>
            )
        })

        return (
            <div>
                <AddNoteModal />


                <table className="table table-hover table-bordered">
                    <tr>
                        <th>
                            <form method="get" className="form-inline">
                                <div className="form-group">
                                    <label for="currentFilter">Showing </label>
                                    <select name='currentFilter' onChange={this.props.filterRequests} className="form-control">
                                        <option value="All Requests">All Requests</option>
                                        {statusList}
                                    </select>
                                </div>
                            </form>
                        </th>
                        <th><Link to="/Requests/Create" className="btn btn-success" style={{ width: "100%" }} >New Request <i classNameName="glyphicon-plus"></i></Link></th>
                        <th><a className="btn btn-warning" style={{ width: "100%" }} onClick={this.showModal}>Add Note</a></th>
                        <th><a className="btn btn-warning" style={{ width: "100%" }} onClick={this.mergeRequests} id="mergeReq">Merge</a></th>
                        <th><a className="btn btn-danger" style={{ width: "100%" }} onClick={this.deleteRequests}>Delete</a></th>

                        <th>
                            <form method="get" className="form-inline">
                                <div className="form-group">
                                    <label for="myfield">Show</label>                                  

                                    <select name="requestsPerPage" onChange={this.props.setRequestsPerPage} defaultValue={perPage} className="form-control">
                                        {selectList}                         
                                    </select>
                                    <label for="myfield">per page</label>
                                </div>
                            </form>
                        </th>
                    </tr>
                </table>
            </div>
        )
    }
}