import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import AddNoteModal from '../modals/AddNoteModal';
import { statusService } from '../../../services/status.service'
import getCheckedBoxes from '../../../helpers/checkbox-checker'
import { requestService } from '../../../services/requests.service'
import { NotificationManager } from 'react-notifications';

let statusList;
let selectList; 

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
        let perPage = this.props.perPage
        statusService.getAll()
            .then(res => {
                this.setState({
                    statuses: res
                }, function () {
                    selectList = this.state.ReqPerPageList.map(function (selectOption, index) {
                        let option = selectOption === perPage ?  
                            <option selected="selected" key={index} value={selectOption}>{selectOption}</option> :
                            <option key={index} value={selectOption}>{selectOption}</option>
                        return (                          
                              option
                        )
                    })
                    statusList = this.state.statuses.map(function (status, index) {
                        return (
                            <option key={index} value={status.id}>{status.name}</option>
                        )
                    })

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
                    this.props.loadRequests();
                }
            });
    }

    deleteRequests = () => {
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
                    this.props.loadRequests();
                }
            });
    }


    render() {
        return (
            <div>
                <AddNoteModal reload={this.props.loadRequests} />

                <table className="table table-hover table-bordered">
                    <thead>
                    <tr>
                        <th>
                                <div className="form-group">
                                <label htmlFor="currentFilter">Showing </label>
                                    <select name='currentFilter' onChange={this.props.filterRequests} className="form-control">
                                        <option value="All Requests">All Requests</option>
                                        {statusList}
                                    </select>
                                </div>
                            </th>
                            <th><div className="form-group"><Link to="/Requests/Create" className="btn btn-success" style={{ width: "100%" }} >New</Link></div></th>
                            <th><div className="form-group"><a className="btn btn-warning" style={{ width: "100%" }} onClick={this.showModal}>Add Note</a></div></th>
                            <th><div className="form-group"><a className="btn btn-warning" style={{ width: "100%" }} onClick={this.mergeRequests} id="mergeReq">Merge</a></div></th>
                            <th><div className="form-group"><a className="btn btn-danger" style={{ width: "100%" }} onClick={this.deleteRequests}>Delete</a></div></th>

                        <th>
                            <div className="form-group">
                                <label htmlFor="myfield">Show per page</label>                                  
                                    <select name="requestsPerPage" onChange={this.props.setRequestsPerPage}  className="form-control">
                                        {selectList}                         
                                    </select>
                                
                                </div>
                        </th>
                        <th>
                            <div className="form-group text-center">
                                <label htmlFor="myfield">Refresh</label>
                                <br />
                                <a id="refreshIcon"><i style={{ fontSize: '30px' }} className="glyphicon glyphicon-refresh" onClick={this.props.loadRequests}></i></a>
                            </div>
                        </th>
                        </tr>
                    </thead>
                    </table>
            </div>
        )
    }
}