import React, { Component } from 'react';
import { Link } from 'react-router-dom'

export default class ReportsIndex extends Component{
    constructor(props) {
        super(props)

        this.state = {
            data: null //This is what our data will eventually be loaded into
        };
    }

    componentDidMount = () => {
       
    }
    
    render() {
        return (      
        <div className="text-center">
        <h2>Browse Reports</h2>
                <hr/>
                <table class="table table-hover table-striped table-bordered">
                    <thead>
                    <tr>
                        <th class="text-center" style={{backgroundColor:'#36648B', color:'white'}}>Report Name</th>
                    </tr>
                    </thead>
                    <tbody>
                        <tr><td><Link to='/Reports/Details/PieReport'>Some Template Report</Link></td></tr>
                    </tbody>
                </table>
                <Link to='/Reports/Create' className="btn btn-success">Generage a custom report</Link>
        </div>)
    }
}