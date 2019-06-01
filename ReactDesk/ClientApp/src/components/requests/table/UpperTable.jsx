import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import AddNoteModal from '../modals/AddNoteModal';
import { statusService } from '../../../services/status.service'

export default class UpperTable extends Component{
    constructor(props){
        super(props)

        this.state = {
            ReqPerPageList: [25, 50, 100, 150, 200, 250, 1000],
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

    
    render(){
        let selectList = this.state.ReqPerPageList.map(function(selectOption){
            return (   
                <option selected="selected" value="@status.Value">{selectOption}</option>
            )
        })
        let statusList = this.state.statuses.map(function(status){
            return (   
                <option value={status.id}>{status.name}</option>
            )
        })

        return(
            <div>
<AddNoteModal/>

        
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
            <th><Link to="/Requests/Create"className="btn btn-success" style={{width: "100%"}} >New Request <i classNameName="glyphicon-plus"></i></Link></th>
            <th><a className="btn btn-warning" style={{width: "100%"}} onClick={this.showModal}>Add Note</a></th>
            <th><a className="btn btn-warning" style={{width: "100%"}} id="mergeReq">Merge</a></th>
            <th><a className="btn btn-danger" style={{width: "100%"}}  id="deleteReq">Delete</a></th>

            <th>
                <form method="get" className="form-inline">
                    <div className="form-group">
                        <label for="myfield">Show</label>
                        {/* @{
                            if (Model.CurrentFilter != null)
                            {
                                <input style="display:none" name="currentFilter" value="@Model.CurrentFilter" />
                            }
                            if (Model.CurrentSearch != null)
                            {
                                <input style="display:none" name="searchString" value="@Model.CurrentSearch" />
                            }
                            if (Model.CurrentSort != null)
                            {
                                <input style="display:none" name="sortOrder" value="@Model.CurrentSort" />
                            }
                        } */}

                        <select name="requestsPerPage" onchange='this.form.submit()' className="form-control">
                            {selectList}
                            {/* @foreach (var option in Model.ReqPerPageList)
                            {
                                if (Model.RequestsPerPage == int.Parse(option.Value))
                                {
                                    <option selected="selected" value="@option.Value">@option.Text</option>
                                }
                                else
                                {
                                    <option value="@option.Value">@option.Text</option>
                                }
                            } */}
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