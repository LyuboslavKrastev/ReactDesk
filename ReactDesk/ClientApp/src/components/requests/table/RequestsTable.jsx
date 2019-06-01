import React, { Component } from 'react'
import SearchBar from './SearchBar'
import RequestsList from './RequestsList';
import UpperTable from './UpperTable';
import sorter from './sorter'
import { requestService } from '../../../services/requests.service'
import { NotificationManager } from 'react-notifications';




function toggle(event) {
    let isChecked = event.target.checked

    let checkboxes = document.getElementsByClassName('check');

    for (var i = 0, n = checkboxes.length; i < n; i++) {
        checkboxes[i].checked = isChecked;
    }
}

export default class RequestsTable extends Component {

    constructor(props) {
        super(props)

        this.state = {
            idSearch: '',
            creationDateSearch: '',
            requests: [],
            showSearch: false,
            orderBy: '',
        }
    }

    filterRequests = (event) => {
        let value = event.target.value;
        debugger;

        if (value === 'All Requests') {
            requestService.getAll()
                .then(res => {
                    this.setState({
                        requests: res
                    })
                })

            return
        }



        if (value) {
            requestService.getAll(value)
                .then(res => {
                    this.setState({
                        requests: res
                    })
                })
        }
    }

    orderRequests = (event) => {
        debugger
        let value = event.target.text.toLowerCase()
        value = value.replace(/\s/g, ''); // remove spaces

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

    componentWillMount = () => {

        requestService.getAll()
            .then(res => {
                this.setState({
                    requests: res
                })
            })
    }

    showNotes = (id) => {
        document.getElementById(`notes_${id}`).style.display = 'block'
    }

    hideNotes = (id) => {
        document.getElementById(`notes_${id}`).style.display = 'none'
    }

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
                                            <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => { this.hideNotes(r.id) }}>Close</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>)}

                <UpperTable filterRequests={this.filterRequests} />
                <table className="table table-hover table-striped table-bordered">
                    <thead>
                        <th className="text-center"><input onClick={toggle} type="checkbox" className="checkbox-inline" id="checkAll" /></th>
                        <th></th>
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
                            <a onClick={this.orderRequests} asp-area="" asp-controller="Requests" asp-action="Index" asp-route-sortOrder="@Model.StartDateSort" asp-route-currentFilter="@Model.CurrentFilter" asp-route-searchString="@Model.CurrentSearch">
                                Start Time
        </a>
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
                        {this.state.showSearch ? <SearchBar /> : null}
                        <RequestsList requests={this.state.requests} showNotes={this.showNotes} />
                    </tbody>


                </table>
            </div>
        )
    }
}