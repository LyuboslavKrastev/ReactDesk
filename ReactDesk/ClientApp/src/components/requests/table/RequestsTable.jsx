import React, { Component } from 'react'
import SearchBar from './SearchBar'
import RequestsList from './RequestsList';
import UpperTable from './UpperTable';
import sorter from './sorter'
import { requestService } from '../../../services/requests.service'
import { NotificationManager } from 'react-notifications';
import { showNotes, hideNotes } from '../modals/note-view-modal-controls'
import ReactPaginate from 'react-paginate';

function toggle(event) {
    let isChecked = event.target.checked

    let checkboxes = document.getElementsByName('requestCheckbox');
    console.log(checkboxes)
    for (var i = 0, n = checkboxes.length; i < n; i++) {
        checkboxes[i].checked = isChecked;
    }
}

function isObject(obj) {
    var type = typeof obj;
    return type === 'function'
    type === 'object' && !!obj;
};

function iterationCopy(src) {
    let target = {};
    for (let prop in src) {
        if (src.hasOwnProperty(prop)) {
            // if the value is a nested object, recursively copy all it's properties
            if (isObject(src[prop])) {
                target[prop] = iterationCopy(src[prop]);
            } else {
                target[prop] = src[prop];
            }
        }
    }
    return target;
}

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
            perPage: 50
        }
    }

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

    filterRequests = (event) => {
        let value = event.target.value;

        if (value !== 'All Requests' && isNaN(value)) {
            return;
        }
        let id = value === "All Requests" ? null : value;

        this.setState({
            statusId: id
        }, function () {
            debugger;
            let criteria = this.getStateCriteria();
            requestService.getAll(criteria)
                .then(res => {
                    this.setState({
                        requests: res.requests,
                        pageCount: Math.ceil(res.total / this.state.perPage)
                    })
                })
        })
    }

    setRequestsPerPage = (event) => {
        let value = event.target.value;

        if (isNaN(value)) {
            return;
        }

        this.setState({
            perPage: value
        }, function () {
            debugger;
            let criteria = this.getStateCriteria();
            requestService.getAll(criteria)
                .then(res => {
                    this.setState({
                        requests: res.requests,
                        pageCount: Math.ceil(res.total / this.state.perPage)
                    })
                })
        })
    }

    searchRequests = (data) => {
        this.setState({
            'idSearch': data.IdSearch,
            'subjectSearch': data.SubjectSearch,
            'requesterSearch': data.RequesterSearch,
            'assignedToSearch': data.AssignedToSearch,
            'startTimeSearch': data.StartTimeSearch,
            'endTimeSearch': data.EndTimeSearch,
        }, function () {
            let criteria = this.getStateCriteria();
            requestService.getAll(criteria)
                .then(res => {
                    this.setState({
                        requests: res.requests,
                        pageCount: Math.ceil(res.total / this.state.perPage)
                    })
                })
        })


    }

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

    showSearchBar = () => {
        let showSearchPrev = this.state.showSearch

        this.setState({
            showSearch: !showSearchPrev
        })
    }

    componentDidMount = () => {
        let criteria = this.getStateCriteria();
        requestService.getAll(criteria)
            .then(res => {
                this.setState({
                    requests: res.requests,
                    pageCount: Math.ceil(res.total / this.state.perPage)
                })
            })
    }

    handlePageClick = (data) => {
        let selected = data.selected;
        let offset = Math.ceil(selected * this.state.perPage);

        this.setState({
            'offset': offset,
            'perPage': this.state.perPage
        }, function () {
            let criteria = this.getStateCriteria();

            requestService.getAll(criteria).then(res => {
                this.setState({
                    requests: res.requests,
                    pageCount: Math.ceil(res.total / this.state.perPage),
                })
            })
        })
    };



    render() {
        return (
            <div>

                {this.state.requests.map(r =>
                    <div class="modal" id={'notes_' + r.id} tabindex="-1" role="dialog">
                        <div class="modal-dialog modal-dialog-scrollable" role="document">
                            <div class="modal-content" style={{ overflow: 'inherit' }}>
                                <div class="modal-body modal-wide">
                                    <div class="panel-group">
                                        <div class="panel">
                                            {r.notes.map(n =>
                                                <div>
                                                    <div class="panel-heading clearfix">
                                                        <div class="pull-left"><strong>Author:</strong> {n.author}</div>
                                                        <div class="pull-right"><strong>Created On:</strong> {new Date(n.creationTime).toLocaleDateString()}</div>
                                                    </div>
                                                    <div class="panel-body">
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

                <UpperTable filterRequests={this.filterRequests} setRequestsPerPage={this.setRequestsPerPage} perPage={this.state.perPage} />
                <table className="table table-hover table-striped table-bordered">
                    <thead>
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