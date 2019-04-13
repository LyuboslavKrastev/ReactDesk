import React, { Component } from 'react'

export default class SearchBar extends Component{
    constructor(props){
        super(props)
    }

    render(){
                return (
                    <tr id="searchBar">
                        <td></td>
                        <td></td>
                    
                            {/* <input hidden name="currentFilter" value="@Model.CurrentFilter" /> */}
                            <td>
                                <input type="text" placeholder="Id" name="IdSearch" />
                            </td>
                            <td>
                                <input form="searchForm" className="text-right searchInput" type="text" placeholder="Subject" name="SubjectSearch" value={this.props.CurrentSearch? this.props.CurrentSearch.SubjectSearch: ''} />
                            </td>
                            <td>
                                <input form="searchForm" className="text-right searchInput" type="text" placeholder="Requester Name" name="RequesterSearch" value={this.props.CurrentSearch? this.props.CurrentSearch.RequesterSearch: ''} />
                            </td>
                            <td>
                                <input form="searchForm" className="text-right searchInput" type="text" placeholder="Assigned To" name="AssignedToSearch"  value={this.props.CurrentSearch? this.props.CurrentSearch.RequesterSearch: ''}  />
                            </td>
                            <td>
                                <input form="searchForm" className="text-right searchInput" type="text" placeholder="MM/DD/YYYY" name="CreationDateSearch" value={this.props.CurrentSearch? this.props.CurrentSearch.RequesterSearch: ''}  />
                            </td>
                            <td>
                                <input form="searchForm" className="text-right searchInput" type="text" placeholder="MM/DD/YYYY" name="ClosingDateSearch"  value={this.props.CurrentSearch? this.props.CurrentSearch.RequesterSearch: ''} />
                            </td>
                            <td>
                                <button type="submit" className="btn btn-success" onClick={this.props.searchRequests}>Search</button>
                            </td>                
                    </tr>
                );
            }
        };