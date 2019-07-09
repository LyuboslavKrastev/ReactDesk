import React, { Component } from 'react';
import { Chart } from 'chart.js'
import colors from './colors.js'
import { reportsService } from '../../services/reports.service'

export default class MyRequestsReport extends Component {
    constructor(props) {
        super(props)

        this.state = {
            myChart: ''
        };
    }

    componentDidMount = () => {
        reportsService.getMyRequests()
            .then(res => {
                let labels = [];
                let data = [];

                for (var index in res) {
                    labels.push(res[index].dimensionOne);
                    data.push(res[index].quantity);
                }

                this.setState({
                    labels: labels,
                    data: data
                }, function () {
                        this.generateChart('pie');
                    })
                }
            );
    }

    generateChart = (type) => {
        if (this.state.myChart) {
            this.state.myChart.destroy();
        }

        let labelsArr = this.state.labels
        let dataArr = this.state.data

        let backgroundColors = []
        for (let index = 0; index < dataArr.length; index++) {
            let color = colors[index]
            backgroundColors.push(color)
        }

        var ctx = document.getElementById('myChart').getContext('2d');

        let chart = new Chart(ctx, {
            type: type,
            data: {
                labels: labelsArr,
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
                <div className='btn btn-group'>
                    <button name='pie' onClick={this.changeType} className="btn btn-warning">Pie</button>
                    <button name='doughnut' onClick={this.changeType} className="btn btn-warning">Doughnut</button>
                    <button name='bar' onClick={this.changeType} className="btn btn-warning">Bar</button>
                </div>
                <canvas id="myChart"></canvas>

            </div>)
    }
}