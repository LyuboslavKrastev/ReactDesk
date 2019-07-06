import React, { Component } from 'react'
let data = {};

export default class SearchBar extends Component {
    
    handleInputChange = (event) => {
        let inputName = event.target.name;
        let inputValue = event.target.value;
        data[inputName] = inputValue;
    }

    render() {
        return (
            <tr id="searchBar">
                <td></td>
                <td></td>

                <td>
                    <input type="text" placeholder="Id" name="IdSearch" onChange={this.handleInputChange} />
                </td>
                <td>
                    <input className="text-right searchInput" type="text" placeholder="Subject" name="SubjectSearch" onChange={this.handleInputChange} />
                </td>
                <td>
                    <input className="text-right searchInput" type="text" placeholder="Requester Name" name="RequesterSearch" onChange={this.handleInputChange} />
                </td>
                <td>
                    <input className="text-right searchInput" type="text" placeholder="Assigned To" name="AssignedToSearch" onChange={this.handleInputChange} />
                </td>
                <td>
                    <input className="text-right searchInput" type="text" placeholder="MM/DD/YYYY" name="StartTimeSearch" onChange={this.handleInputChange} />
                </td>
                <td>
                    <input className="text-right searchInput" type="text" placeholder="MM/DD/YYYY" name="EndTimeSearch" onChange={this.handleInputChange}/>
                </td>
                <td>
                    <button type="submit" className="btn btn-success" onClick={() => this.props.searchRequests(data)}>Search</button>
                </td>
            </tr>
        );
    }
};