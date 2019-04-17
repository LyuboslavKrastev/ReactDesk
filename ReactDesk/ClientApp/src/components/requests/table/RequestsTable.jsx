import React, { Component } from 'react'
import SearchBar from './SearchBar'
import RequestsList from './RequestsList';
import UpperTable from './UpperTable';
import sorter from './sorter'
import { requestService } from '../../../services/requests.service'

const statuses = [
    'All Requests',
    'Open',
    'Closed', 
    'Rejected'
]

//const requests = [
//    {
//        Id: 1,
//        Subject: 'Req 1',
//        Description: "Description 1",
//        AssignedTo: 'Pesho',
//        Status: statuses[1],
//        Requester: 'ASDAS',
//        StartTime: '020319',
//        EndTime: '050319',
//        Notes: []
//    },
//    {
//        Id: 2,
//        Subject: 'Req 2',
//        Description: "Description 2",
//        AssignedTo: 'Pesho 2',
//        Status: statuses[1],
//        Requester: 'ASDAS',
//        StartTime: '030319',
//        EndTime: '060319',
//        Notes: 'Hi'
//    },
//    {
//        Id: 3,
//        Subject: 'Req 3',
//        Description: "Description 3",
//        AssignedTo: 'Pesho 3',
//        Status: statuses[2],
//        Requester: 'ASDASAAAA',
//        StartTime: '530319',
//        EndTime: '060319',
//        Notes: []
//    },
//    {
//        Id: 4,
//        Subject: 'Req 4',
//        Description: "Description 3",
//        AssignedTo: '',
//        Status: statuses[3],
//        Requester: 'ASDASAAAA',
//        StartTime: '530319',
//        EndTime: '060319',
//        Notes: []
//    }
//]

function toggle(event) {
    let isChecked = event.target.checked

    let checkboxes = document.getElementsByClassName('check');

    for(var i=0, n=checkboxes.length;i<n;i++) {
        checkboxes[i].checked = isChecked;
    }    
  }

export default class RequestsTable extends Component{

    constructor(props){
        super(props)

        this.state = {
            idSearch: '',
            creationDateSearch: '',
            requests: [],
            showSearch: false,
            orderBy: ''
        }
    }

    filterRequests = (event) => {
        let value = event.target.value;
        debugger;
        if(value === 'All Requests'){
            requestService.getAll()
                .then(res =>
                    this.setState({
                        requests: res
                    }))
            return;
        }
        let prevRequests = this.state.requests;
        this.setState({
            requests: prevRequests.filter(r => r.Status == value)
        })
    }

    orderRequests = (event) => {
        debugger
        let value = event.target.text.toLowerCase()
        value = value.replace(/\s/g, ''); // remove spaces

        let sorted;
        let orderFilter = this.state.orderBy;
        let order;

        if(orderFilter.includes(value)){
            if(orderFilter.includes('ASC')){
                order = 'DESC'
                sorted = sorter(this.state.requests, order, value)
            }else{
                order = 'ASC'
                sorted = sorter(this.state.requests, order, value)
            }
        } else {
            order = 'DESC'
            sorted = sorter(this.state.requests, order, value)
        }

        this.setState({
            orderBy: value+order,
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
        requestService.getAll()
            .then(res => 
                this.setState({
                requests: res
            }))
    }
    
    render(){
        return (
            <div>
            <UpperTable filterRequests={this.filterRequests} statuses={statuses}/>
            <table className="table table-hover table-striped table-bordered">
    <thead>
    <th className="text-center"><input onClick={toggle} type="checkbox" className="checkbox-inline" id="checkAll"/></th>
    <th></th>
    <th>
        <a onClick={this.orderRequests} asp-area="" asp-controller="Requests" asp-action="Index" asp-route-sortOrder="@Model.IdSort" asp-route-currentFilter="@Model.CurrentFilter" asp-route-searchString="@Model.CurrentSearch">
            Id
        </a>
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
        {this.state.showSearch? <SearchBar/> : null}
        <RequestsList requests={this.state.requests}/>
    </tbody>

    
</table>
</div>
        )
    }
}