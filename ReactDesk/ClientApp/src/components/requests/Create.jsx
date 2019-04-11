import React, { Component } from 'react'

export default class Create extends Component{
    
    render(){
        return(
            <div>
            <h2 className="text-center">Create a request</h2>

<form method="post" className="form-horizontal" enctype="multipart/form-data">
    <label htmlFor="subject">Subject</label>
    <input className="form-control" name="subject"/>
    <label htmlFor="description">Subject</label>    
    <textarea className="form-control" name="description"></textarea>
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
            <a asp-page="/Index" className="btn btn-danger">Cancel</a>
        </div>
    </div>
</form>
</div>
        )
    }
}