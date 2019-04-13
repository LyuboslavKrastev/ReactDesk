import React, { Component } from 'react'

export default class RequestsList extends Component{

    render(){
        let requestsList = this.props.requests.map(function(request){
            let assignedTo;
            if (request.AssignedTo)
            {
                assignedTo = <a className="text-success"><strong>{request.AssignedTo}</strong></a>
            }
            else
            {
                assignedTo = <label className="text-danger">Unassigned</label>
            }

            let noteColor = request.Notes.length > 0? 'orange': '';
        
            return (   
                <tr>
                    <td className="text-center"><input value="@item.Id" type="checkbox" className="check"/></td>
                    <td className="text-center"><a className="glyphicon glyphicon-file" style={{color: noteColor}} name="noteIcon" data-toggle="modal" data-target="#@notesModalId"></a></td>
                    <td>
                        {request.Id}
                    </td>
                    <td>
                        <a asp-area="" asp-controller="Requests" asp-action="Details" asp-route-id="@item.Id">{request.Subject}</a>
                    </td>
                    <td>
                        {request.Requester}
                    </td>
                    <td>
                        {assignedTo}
                    </td>
                    <td>
                        {request.StartTime}
                    </td>
                    <td>
                        {request.EndTime}
                    </td>
                    <td>
                        {request.Status}
                    </td>
                </tr>
            )
          })
           
          return requestsList
    }
}