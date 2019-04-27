import React, { Component } from 'react'
import { NotificationManager } from 'react-notifications';
import { Link } from 'react-router-dom'

export default class CreateSolution extends Component{
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

    handleSubmit = (event) => {
        event.preventDefault();
        let data = this.state
        console.log(data)

        // requestService.createRequest(data.Subject, data.Description, data.CategoryId)
        //     .then(res => {
        //         if (res) {
        //             NotificationManager.success('Successfully created solution' + res.subject)
        //             return this.props.history.push('/')
                    
        //         }
        //         else {
        //             console.log(res)
        //             return NotificationManager.error(res.error)
        //         }
        //     })
    }
    render(){
        return (
            <div>
            <h2 class="text-center">Create a solution</h2>

            <form method="post" class="form-horizontal" enctype="multipart/form-data" onSubmit={this.handleSubmit}>
                <label htmlFor="Title">Title</label>
                <input className="form-control" name="Title" onChange={this.handleInputChange} />
                <label htmlFor="description">Content</label>    
                <textarea rows="15" className="form-control" name="Content" onChange={this.handleInputChange} ></textarea>
                <br/>
                <input class="center-block" asp-for="Model.Attachments" type="file" multiple />
                <div className="form-group">
                            <br />
                            <div className="col-sm-10 col-sm-push-5">
                                <input type="submit" value="Create" className="btn btn-success" />
                                <Link to='/Solutions' className="btn btn-danger">Cancel</Link>
                            </div>
                        </div>
            </form>
            </div>
        )
    }
}