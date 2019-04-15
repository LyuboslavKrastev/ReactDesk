import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { requestService } from '../../services/requests.service'

export default class CreateRequest extends Component{

    constructor(props) {
        super(props);

        this.state = {
            Subject: '',
            Description: '',
            CategoryId: 1
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

        requestService.createRequest(data.Subject, data.Description, data.CategoryId)
            .then(this.props.history.push('/'));
    }
    
    render(){
        return(
            <div>
                <h2 className="text-center">Create a request</h2>

                <form onSubmit={this.handleSubmit} className="form-horizontal" enctype="multipart/form-data">
                    <label htmlFor="Subject">Subject</label>
                    <input className="form-control" name="Subject" onChange={this.handleInputChange} />
                        <label htmlFor="description">Description</label>    
                    <textarea className="form-control" name="Description" onChange={this.handleInputChange} ></textarea>
                        <div className="form-group">
                            <label className="control-label col-sm-2" asp-for="CategoryId">Category</label>
                            <div className="col-sm-8">
                                <select className="form-control" asp-for="CategoryId" asp-items="Model.Categories"></select>
                            </div>
                        </div>
                        <input className="center-block" asp-for="Attachments" type="file" multiple />
                        <div className="form-group">
                            <br />
                            <div className="col-sm-10 col-sm-push-5">
                                <input type="submit" value="Create" className="btn btn-success" />
                                <Link to='/Requests' className="btn btn-danger">Cancel</Link>
                            </div>
                        </div>
                    </form>
            </div>
        )
    }
}