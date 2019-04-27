import React, { Component } from 'react'
import { solutionService } from '../../services/solutions.service'

export default class SolutionDetails extends Component{

    constructor(props) {
        super(props)

        this.state = {
            solution: {}
        }
    }

    componentDidMount = () => {
        let id = this.props.match.params.id;

        solutionService.getById(id)
            .then(res => this.setState({
                solution: res
            }))
    }
    

    render() {
        let solution = this.state.solution

        return(
            <div>
            <h2 class="text-center">Details for Solution {solution.id}</h2>

<div class="container">
    <div class="panel-group">
        <div class="panel panel-primary">
            <div class="panel-heading clearfix">
                <div class="pull-left"><strong>Subject:</strong> {solution.title}</div>
                <div class="pull-right"><strong>Created On:</strong> {solution.creationTime}</div>
            </div>
            <div class="panel-body"><strong>Description:</strong> <p>{solution.content}</p></div>
            <div class="panel-footer clearfix">
                <div class="text-center"><strong> Author:</strong> {solution.author}</div>
            </div>
            {/* @if (Model.Attachments.Any())
            {
                <div class="text-center">
                    @foreach (var attachment in Model.Attachments)
                    {
                        <label asp-for="@attachment">Attachment: </label>
                        <a asp-controller="Solutions" asp-action="Download"
                           asp-route-filename="@attachment.FileName" asp-route-filePath="@attachment.PathToFile" asp-route-attachmentId="@attachment.Id">
                            @attachment.FileName
                        </a>
                        <br />
                    }
                </div>
            } */}
        </div>

    </div>
</div>
</div>
        )
    }
}