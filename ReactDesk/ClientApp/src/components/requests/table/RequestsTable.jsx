import React, { Component } from 'react'
import SearchBar from './SearchBar'
import RequestsList from './RequestsList';
import UpperTable from './UpperTable';
import sorter from './sorter'
import { requestService } from '../../../services/requests.service'
import { NotificationManager } from 'react-notifications';
import { showNotes, hideNotes } from '../modals/note-view-modal-controls'
import ReactPaginate from 'react-paginate';

// checks all checkboxes
function toggle(event) {
    let isChecked = event.target.checked

    let checkboxes = document.getElementsByName('requestCheckbox');
    console.log(checkboxes)
    for (var i = 0, n = checkboxes.length; i < n; i++) {
        checkboxes[i].checked = isChecked;
    }
}

const DEFAULT_PERPAGE = 50;

export default class RequestsTable extends Component {

    constructor(props) {
        super(props)

        this.state = {
            idSearch: '',
            subjectSearch: '',
            requesterSearch: '',
            assignedToSearch: '',
            startTimeSearch: '',
            endTimeSearch: '',
            statusId: null,
            requests: [],
            showSearch: false,
            orderBy: '',
            perPage: DEFAULT_PERPAGE
        }
    }

    // gets the filtering information from the state
    getStateCriteria = () => {
        let result = {
            'idSearch': this.state.idSearch,
            'subjectSearch': this.state.subjectSearch,
            'requesterSearch': this.state.requesterSearch,
            'assignedToSearch': this.state.assignedToSearch,
            'startTimeSearch': this.state.startTimeSearch,
            'endTimeSearch': this.state.endTimeSearch,
            'offset': this.state.offset,
            'perPage': this.state.perPage,
            'orderBy': this.state.orderBy,
            'statusId': this.state.statusId
        };

        return result;
    }

    // sends a GET request to the API, containing the filtering criteria, contained in the state
    loadRequests = () => {
        let criteria = this.getStateCriteria();
        NotificationManager.info("Loading requests...")
        requestService.getAll(criteria)
            .then(res => {
                this.setState({
                    requests: res.requests,
                    pageCount: Math.ceil(res.total / this.state.perPage)
                }, function () {
                        NotificationManager.success("Requests loaded!")
                    })})
    }

    // filters the requests by status type (open, closed, rejected, etc.)
    filterRequests = (event) => {
        let value = event.target.value;

        if (value !== 'All Requests' && isNaN(value)) {
            return;
        }
        let id = value === "All Requests" ? null : value;

        this.setState({
            statusId: id
        }, function () {
            this.loadRequests();
        })
    }

    // sets the number of requests, displayed per page
    setRequestsPerPage = (event) => {
        let value = event.target.value;

        if (isNaN(value)) {
            return;
        }

        this.setState({
            perPage: value
        }, function () {
            this.loadRequests();
        })
    }

    // searches requests by the given fields
    searchRequests = (data) => {
        this.setState({
            'idSearch': data.IdSearch,
            'subjectSearch': data.SubjectSearch,
            'requesterSearch': data.RequesterSearch,
            'assignedToSearch': data.AssignedToSearch,
            'startTimeSearch': data.StartTimeSearch,
            'endTimeSearch': data.EndTimeSearch,
        }, function () {
            this.loadRequests();
        })
    }

    // this needs to be changed, ordering should be done on the backend
    orderRequests = (event) => {
        let value = event.target.text.toLowerCase()
        value = value.replace(/\s/g, ''); // remove spaces
        if (value === 'starttime') {
            value = 'startTime'
        }
        let sorted;
        let orderFilter = this.state.orderBy;
        let order;

        if (orderFilter.includes(value)) {
            if (orderFilter.includes('ASC')) {
                order = 'DESC'
                sorted = sorter(this.state.requests, order, value)
            } else {
                order = 'ASC'
                sorted = sorter(this.state.requests, order, value)
            }
        } else {
            order = 'DESC'
            sorted = sorter(this.state.requests, order, value)
        }
        NotificationManager.success(`Ordered by ${order} ${value}`)
        this.setState({
            orderBy: value + order,
            requests: sorted
        })

    }

    // shows or hides the search bar
    showSearchBar = () => {
        let showSearchPrev = this.state.showSearch

        this.setState({
            showSearch: !showSearchPrev
        })
    }

    componentDidMount = () => {
        this.loadRequests();
    }

    // switches between pages
    handlePageClick = (data) => {
        let selected = data.selected;
        let offset = Math.ceil(selected * this.state.perPage);

        this.setState({
            'offset': offset,
            'perPage': this.state.perPage
        }, function () {
            this.loadRequests();
        })
    };

    render() {
        return (
            <div>

                {this.state.requests.map((r, index) =>
                    <div key={index} className="modal" id={'notes_' + r.id} tabIndex="-1" role="dialog">
                        <div className="modal-dialog modal-dialog-scrollable" role="document">
                            <div className="modal-content" style={{ overflow: 'inherit' }}>
                                <div className="modal-body modal-wide">
                                    <div className="panel-group">
                                        <div className="panel">
                                            {r.notes.map((n, index) =>
                                                <div key={index}>
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
                                            <button type="button" className="btn btn-warning" data-dismiss="modal" onClick={() => { hideNotes(r.id) }}>Close</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>)}

                <UpperTable filterRequests={this.filterRequests} loadRequests={this.loadRequests} setRequestsPerPage={this.setRequestsPerPage} perPage={this.state.perPage} />
                <table className="table table-hover table-striped table-bordered">
                    <thead>
                        <tr>
                            <th className="text-center"><input onClick={toggle} type="checkbox" className="checkbox-inline" id="checkAll" /></th>
                            <th className="text-center">Notes</th>
                            <th>
                                <a onClick={this.orderRequests}>Id</a>
                            </th>
                            <th>
                                <a onClick={this.orderRequests}>
                                    Subject
        </a>
                            </th>
                            <th>
                                <a onClick={this.orderRequests}>Requester</a>
                            </th>
                            <th>
                                <a onClick={this.orderRequests}>Assigned To</a>
                            </th>
                            <th>
                                <a onClick={this.orderRequests}>Start Time</a>
                            </th>
                            <th>
                                <a onClick={this.orderRequests}>
                                    End Time
        </a>
                            </th>
                            <th>
                                <a onClick={this.orderRequests}>Status</a>
                                <a id="searchIcon"><i className="glyphicon glyphicon-zoom-in pull-right" onClick={this.showSearchBar}></i></a>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.showSearch ? <SearchBar searchRequests={this.searchRequests} /> : null}
                        <RequestsList requests={this.state.requests} showNotes={showNotes} />
                    </tbody>


                </table>
                <ReactPaginate
                    previousLabel={'previous'}
                    nextLabel={'next'}
                    breakLabel={'...'}
                    breakClassName={'break-me'}
                    pageCount={this.state.pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={this.handlePageClick}
                    containerClassName={'pagination'}
                    subContainerClassName={'pages pagination'}
                    activeClassName={'active'}
                />
            </div>
        )
    }
}