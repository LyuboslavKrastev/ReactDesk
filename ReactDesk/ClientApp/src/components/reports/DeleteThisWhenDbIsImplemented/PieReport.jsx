import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { Chart } from 'chart.js'
import colors from '../colors.js'

export default class PieReport extends Component{     
    constructor(props) {
        super(props)

        this.state = {
            data: null,
            myChart: ''
        };
    }

    componentDidMount = () => {
        this.generateChart('pie');
    }

    generateChart = (type) => {
        if (this.state.myChart) {
            this.state.myChart.destroy();

        }
        let dataArr = []
        for (let index = 0; index < colors.length; index++) {
            dataArr.push(10)
        }

        //let dataArr = [12, 19, 3, 5, 2, 3, 22, 13, 32, 43, 21, 8, 15, 66, 32, 43, 21, 8, 15]
        let backgroundColors = []
        for (let index = 0; index < dataArr.length; index++) {
            let color = colors[index]
            backgroundColors.push(color)
        }

        var ctx = document.getElementById('myChart').getContext('2d');

        let chart = new Chart(ctx, {
            type: type,
            data: {
                labels: dataArr,
                datasets: [{
                    data: dataArr,
                    backgroundColor: backgroundColors,
                    borderColor: backgroundColors,
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
        this.setState({
            myChart: chart
        }
        )
    }

    changeType = (event) => {      
        let type = event.target.name;
        this.generateChart(type);   
    }

    render() {
        return (
            
        <div className="text-center">
         
            <h2>Some pie report</h2>
                <hr />
                <div className='btn btn-group'>
                    <Link to='/Reports' className="btn btn-info">Back to reports</Link>
                    <button name='pie' onClick={this.changeType} className="btn btn-warning">Pie</button>
                    <button name='doughnut' onClick={this.changeType} className="btn btn-warning">Doughnut</button>
                    <button name='bar' onClick={this.changeType} className="btn btn-warning">Bar</button>
                </div>
                <canvas id="myChart"></canvas>
            
        </div>)
    }
}