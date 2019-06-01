import React, { Component } from 'react';
import { NotificationManager } from 'react-notifications';
import { Link } from 'react-router-dom'


export default class ReportWizard extends Component{
    constructor(props) {
        super(props)
        
        this.state = ({
            DisplayColumns: [],
            During: '',
            FromTo: [],
            GroupBy: '',
            ChartType: ''
        })    
    }

    handleInputChange = (event) => {

        let inputName = event.target.name;
        let inputValue = event.target.value;
        this.setState({
            [inputName]: inputValue
        })
    }

    handleMultiSelectChange = (event) => {

        let selectName = event.target.name;
        let selectOptions = event.target.options;
        var value = [];
        for (var i = 0, l = selectOptions.length; i < l; i++) {
          if (selectOptions[i].selected) {
            value.push(selectOptions[i].value);
          }
        }

        this.setState({
            [selectName]: value
        })
    }

    handleSubmit = (event) => {
        event.preventDefault();
        let data = this.state
        console.log(data)

        // requestService.createRequest(data.Subject, data.Description, data.CategoryId)
        //     .then(res => {
        //         if (res) {
        //             NotificationManager.success('Successfully generated report' + res.name)
        //             return this.props.history.push('/')

        //         }
        //         else {
        //             console.log(res)
        //             return NotificationManager.error(res.error)
        //         }
        //     })
    }

    handleDateFilter = (event) => {
        // event.preventDefault();
        // event.stopPropagation();
       let btnId = event.target.id;
       document.getElementById(btnId).checked = true;
       let fromToFields = document.getElementsByName('fromToField');
       let duringField =  document.getElementsByName('duringField')[0];
       debugger;

       if(btnId === 'fromToBtn'){
           
           for (const field of fromToFields) {
               field.disabled = false;
           }
           duringField.disabled = true;
       }
       else{
        document.getElementById(btnId).checked = true;
            for (const field of fromToFields) {
                field.disabled = true;
            }
            duringField.disabled = false;
       }
    }
    
    render() {
        return (
            
            <div>
                <div className="text-center">
                <h2>Generate a custom report</h2>   
                <hr/>
                </div>       
                <form onSubmit={this.handleSubmit} className="form-horizontal" enctype="multipart/form-data">
                <h3>Select columns to display</h3>
                <div>
                    <select multiple className="form-control" name="DisplayColumns" onChange={this.handleMultiSelectChange}>
                        <option>Id</option>
                        <option>Subject</option>
                        <option>Requester</option>
                        <option>Technician</option>
                        <option>Start Time</option>
                        <option>End Time</option>
                    </select>
                </div>
                <div>
                    <h3>Date Filter</h3>
                    <div className="form-inline">
                            <label className="radio-inline mx-sm-3"><input type="radio" id="duringBtn" name="dateFilterBtn" checked  onClick={this.handleDateFilter}/>During</label>
                            <select className="form-control" name="duringField" onChange={this.handleInputChange}>                             
                                <option>Today</option>
                                <option>Yesterday</option>
                                <option>This week</option>
                                <option>This month</option>     
                                <option>This year</option>
                            </select>          
                        
                            <label className="radio-control"><input type="radio" id="fromToBtn" name="dateFilterBtn" onClick={this.handleDateFilter}/>From</label>
                            <input name='fromToField' disabled className="form-control"/>
                            <label>To</label>
                            <input name='fromToField' disabled className="form-control"/>
                        
                    </div>
                </div>
                <div>
                <h3>Group by</h3>
                            <select className="form-control" name="GroupBy" onChange={this.handleInputChange}>                             
                                <option>Requester</option>
                                <option>Technician</option>
                                <option>Start Time</option>
                                <option>End Time</option>
                                <option>Category</option>
                                <option>Status</option>
                            </select>
                </div>
                <div>
                <h3>Chart type</h3>
                            <select className="form-control" name="ChartType" onChange={this.handleInputChange}>                             
                                <option>Pie</option>
                                <option>Bar</option>
                            </select>
                </div>
                <br/>
                <div className="text-center">
                    <div className="btn-group">
                        <input type="submit" value="Generate" className="btn btn-success" />
                        <Link to='/Reports' className="btn btn-info">Back to reports</Link> 
                    </div>
                </div>
                </form>
          </div>

        )
    }
}