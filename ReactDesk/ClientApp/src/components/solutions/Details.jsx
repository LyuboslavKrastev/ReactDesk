import React, { Component } from 'react'
import { solutionService } from '../../services/solutions.service'

export default class SolutionDetails extends Component {

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

    getFile = (fileName, filePath, id) => {
        solutionService.getFile(fileName, filePath, id)
            .then(res => console.log(res))
    }


    render() {
        let solution = this.state.solution
        console.log(solution)
        return (
            <div>
                <h2 class="text-center">Details for Solution {solution.id}</h2>

                <div class="container">
                    <div class="panel-group">
                        <div class="panel panel-primary">
                            <div class="panel-heading clearfix">
                                <div class="pull-left"><strong>Subject:</strong> {solution.title}</div>
                                <div class="pull-right"><strong>Created On:</strong> {solution.createdOn}</div>
                            </div>
                            <div class="panel-body"><strong>Description:</strong> <p>{solution.content}</p></div>
                            <div class="panel-footer clearfix">
                                <div class="text-center"><strong> Author:</strong> {solution.author}</div>
                            </div>
                            {solution.attachments != undefined && solution.attachments.length > 0 ?
                                <div className="text-center">
                                    <br />
                                    <label className="text-center">Attachments: </label>
                                    <hr />
                                    {solution.attachments.map(a =>
                                        <div>
                                            <a onClick={() => this.getFile(a.fileName, a.pathToFile, a.id)}>
                                                {a.fileName}
                                            </a>
                                            <br />
                                        </div>
                                    )}
                                </div>
                                : null}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}