import React, { Component } from 'react';
import { NotificationManager } from 'react-notifications';
import { Link } from 'react-router-dom';
import { solutionService } from '../../services/solutions.service';

export default class CreateSolution extends Component {
    constructor(props) {
        super(props);

        this.state = {
            Title: '',
            Content: '',
        };
    }

    handleInputChange = (event) => {
        let inputName = event.target.name;
        let inputValue = event.target.value;
        this.setState({
            [inputName]: inputValue
        })
    }

    handleFileUpload = (event) => {
        let files = event.target.files

        this.setState({
            Attachments: files
        })
    }

    handleSubmit = (event) => {
        event.preventDefault();
        let content = this.state.Title
        let title = this.state.Title
        let data = this.state

        if (!title || !content) {
            NotificationManager.error('Solutions must have a title and content')
            return;
        }

        solutionService.createSolution(data.Title, data.Content, data.Attachments)
            .then(res => {
                if (res) {
                    console.log('responseeeeeeeee')
                    console.log(res)
                    NotificationManager.success('Successfully created solution' + res.title)
                    return this.props.history.push(`/solutions/details/${res.id}`);

                }
                else {
                    console.log(res)
                    return NotificationManager.error(res.error)
                }
            })
    }
    render() {
        return (
            <div>
                <h2 class="text-center">Create a solution</h2>

                <form method="post" class="form-horizontal" enctype="multipart/form-data" onSubmit={this.handleSubmit}>
                    <label htmlFor="Title">Title</label>
                    <input className="form-control" name="Title" onChange={this.handleInputChange} />
                    <label htmlFor="description">Content</label>
                    <textarea rows="15" className="form-control" name="Content" onChange={this.handleInputChange} ></textarea>
                    <br />
                    <input onChange={this.handleFileUpload} class="center-block" asp-for="Model.Attachments" type="file" multiple />
                    <div className="form-group">
                        <br />
                        <div className="col-sm-10 col-sm-push-5">
                            <Link to='/Solutions' className="btn btn-danger">Cancel</Link>
                            <input type="submit" value="Create" className="btn btn-success" />
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}