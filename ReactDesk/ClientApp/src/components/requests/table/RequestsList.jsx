import React, { Component } from 'react'
import { Link } from 'react-router-dom';

export default class RequestsList extends Component{
    
    render() {

        let showNotes = this.props.showNotes

        let requestsList = this.props.requests.map(function(request, index){
            let assignedTo;
            if (request.assignedto)
            {
                assignedTo = <a key={index} className="text-success"><strong>{request.assignedto}</strong></a>
            }
            else
            {
                assignedTo = <label key={index} className="text-danger">Unassigned</label>
            }

            let noteColor = '';

            if (request.notes) {
                if (request.notes.length > 0) {
                    noteColor = 'orange'
                }
            }

            let startDate = new Date(request.startTime).toLocaleDateString();

            return (   
               
                <tr>
                    <td className="text-center"><input type="checkbox" name="requestCheckbox" value={request.id} className="check" /></td>
                    <td className="text-center"><a className="glyphicon glyphicon-file" style={{color: noteColor}} name="noteIcon" onClick={() => {showNotes(request.id)}}></a></td>
                    <td>
                        {request.id}
                    </td>
                    <td>
                        <Link to={`/requests/details/${request.id}`}>{request.subject}</Link>
                    </td>
                    <td>
                        {request.requester}
                    </td>
                    <td>
                        {assignedTo}
                    </td>
                    <td>
                        {startDate}
                    </td>
                    <td>
                        {request.endtime}
                    </td>
                    <td>
                        {request.status}
                    </td>
                </tr>
            )
          })
           
          return requestsList
    }
}