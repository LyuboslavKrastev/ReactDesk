import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { requestService } from '../../services/requests.service'
import { NotificationManager } from 'react-notifications';
import { categoriesService } from '../../services/categories.service'

export default class CreateRequest extends Component {

    constructor(props) {
        super(props);

        this.state = {
            Subject: '',
            Description: '',
            categories: [],
            CategoryId: ''
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
            .then(res => {
                if (res) {
                    NotificationManager.success('Successfully created request' + res.subject)
                    return this.props.history.push('/')

                }
                else {
                    console.log(res)
                    return NotificationManager.error(res.error)
                }
            })
    }

    componentDidMount = () => {
        categoriesService.getAll()
            .then(res => this.setState({
                categories: res,
                CategoryId: res.length > 0 ? res[0].id : ''
            }));
    }

    render() {
        let categoriesList = this.state.categories.map(function (category) {
            return (
                <option value={category.id}>{category.name}</option>
            )
        })
        return (
            <div>
                <h2 className="text-center">Create a request</h2>

                <form onSubmit={this.handleSubmit} className="form-horizontal" enctype="multipart/form-data">
                    <label htmlFor="Subject">Subject</label>
                    <input className="form-control" name="Subject" onChange={this.handleInputChange} />
                    <label htmlFor="description">Description</label>
                    <textarea rows="15" className="form-control" name="Description" onChange={this.handleInputChange} ></textarea>
                    <label htmlFor="CategoryId">Category</label>

                    <select className="form-control" onChange={this.handleInputChange} name="CategoryId">
                        {categoriesList}
                    </select>

                    <br />
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