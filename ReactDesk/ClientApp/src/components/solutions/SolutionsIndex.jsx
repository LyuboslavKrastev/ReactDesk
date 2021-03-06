import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { solutionService } from '../../services/solutions.service'

export default class SolutionsIndex extends Component {

    constructor(props) {
        super(props)

        this.state = {
            mostRecent: [],
            mostViewed: []
        }
    }

    componentDidMount = () => {
        solutionService.getAll()
            .then(res => this.setState({
                mostRecent: res.slice(0).sort(function (a, b) {
                    let aVal = a['creationTime'];
                    let bVal = b['creationTime'];
                    if (aVal < bVal) return 1;
                    if (aVal > bVal) return -1;
                    if (aVal === bVal) return 0;
                }),
                mostViewed: res.slice(0).sort(function (a, b) {
                    let aVal = a['views'];
                    let bVal = b['views'];
                    if (aVal < bVal) return 1;
                    if (aVal > bVal) return -1;
                    if (aVal === bVal) return 0;
                })
            }))
    }

    render() {
        return (
            <div>
                <div className="col-md-6">
                    <table className="table table-hover table-striped table-bordered">
                        <thead>
                            <tr>
                                <th className="text-center" style={{ backgroundColor: '#36648B', color: 'white' }}>Most Recent</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.mostRecent.map((s, index) => <tr>
                                <td key={index}>
                                    <Link to={`/solutions/details/${s.id}`}><strong>{s.title}</strong></Link>
                                    <br />
                                    Created On: {s.creationTime} | Views: {s.views} <br />
                                    Author: {s.author}
                                </td>
                            </tr>)}
                        </tbody>
                    </table>
                </div>
                <div className="col-md-6">
                    <table className="table table-hover table-striped table-bordered col-md-6">
                        <thead>
                            <tr>
                                <th className="text-center" style={{ backgroundColor: '#36648B', color: 'white' }}>Most Viewed</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.mostViewed.map((s, index) => <tr>
                                <td key={index}>
                                    <Link to={`/solutions/details/${s.id}`}><strong>{s.title}</strong></Link>
                                    <br />
                                    Created On: {s.creationTime} | Views: {s.views} <br />
                                    Author: {s.author}
                                </td>
                            </tr>)}
                        </tbody>
                    </table>
                </div>

                {/* @if (User.IsInRole(WebConstants.AdminRole) || User.IsInRole(WebConstants.HelpdeskRole))
{
    <div className="text-center">
        <a asp-area="Management" asp-controller="Solutions" asp-action="Create" className="btn btn-lg btn-primary">
            Create Solution <i className="glyphicon-plus"></i>
        </a>
    </div>
    <br />
} */}
            </div>
        )

    }
}