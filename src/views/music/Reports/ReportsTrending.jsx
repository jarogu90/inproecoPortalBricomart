import React from 'react';
import {
    Row, Col,
} from 'reactstrap';
// react plugin used to create charts
import { Doughnut, HorizontalBar } from 'react-chartjs-2';
// function that returns a color based on an interval of numbers

import {
    
} from 'components';

class MusicReportsTrending extends React.Component{
    render(){


const data2 = {
  labels: [
    'Firefox',
    'Chrome',
    'Edge'
  ],
  datasets: [{
    data: [300, 50, 100],
    backgroundColor: [
      '#ffccbc','#ffab91','#ff8a65','#ffa183','#fc8b68','#fe825b'
    ],
  }]
};


const data = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
  datasets: [
    {
      label: 'Users',
      backgroundColor: 'rgba(38, 166, 154,1)',
      borderColor: 'rgba(38, 166, 154,0.8)',
      borderWidth: 1,
      hoverBackgroundColor: 'rgba(38, 166, 154,0.8)',
      hoverBorderColor: 'rgba(38, 166, 154,1)',
      data: [65, 59, 80, 81, 56, 55, 40]
    }
  ]
};


// General configuration for the charts with Line gradientStroke
const gradientChartOptionsConfiguration2 = {
    maintainAspectRatio: false,
    legend: {
        display: true
    },
    tooltips: {
      bodySpacing: 4,
      mode:"nearest",
      intersect: 0,
      position:"nearest",
      xPadding:10,
      yPadding:10,
      caretPadding:10
    },
    responsive: 1,
    scales: {
        yAxes: [{
          display:1,
          ticks: {
              display: true
          },
          gridLines: {
              
              drawBorder: false
          }
        }],
        xAxes: [{
          display:1,
          ticks: {
              display: true
          },
          gridLines: {
            zeroLineColor: "transparent",
            drawTicks: false,
            display: true,
            drawBorder: false
          }
        }]
    },
    layout:{
      padding:{left:0,right:0,top:25,bottom:25}
    }
};


// General configuration for the charts with Line gradientStroke
const gradientChartOptionsConfiguration3 = {
    maintainAspectRatio: false,
    legend: {
        display: true
    },
    tooltips: {
      bodySpacing: 4,
      mode:"nearest",
      intersect: 0,
      position:"nearest",
      xPadding:10,
      yPadding:10,
      caretPadding:10
    },
    responsive: 1,
    scales: {
        yAxes: [{
          display:0,
          ticks: {
              display: false
          },
          gridLines: {
              
              drawBorder: false
          }
        }],
        xAxes: [{
          display:0,
          ticks: {
              display: false
          },
          gridLines: {
            zeroLineColor: "transparent",
            drawTicks: false,
            display: true,
            drawBorder: false
          }
        }]
    },
    layout:{
      padding:{left:0,right:0,top:25,bottom:25}
    }
};


        return (
            <div>
                <div className="content">
                    <Row>
                        <Col xs={12} md={12}>

                    <div className="page-title">
                        <div className="float-left">
                            <h1 className="title">Site Trending Reports</h1>
                        </div>
                    </div>


                    <div className="col-12">
                        <section className="box ">
                            <header className="panel_header">
                                <h2 className="title float-left">Monthly Users</h2>
                                
                            </header>
                            <div className="content-body">
                                <div className="row">
                                    <div className="col-lg-12">
                            
                                    <div className="chart-area" style={{height: 500+'px'}}>
                                        <HorizontalBar data={data} options={gradientChartOptionsConfiguration2} />
                                    </div>


                                    </div>
                                </div>


                            </div>
                        </section>
                    </div>

                    <div className="col-12">
                        <section className="box ">
                            <header className="panel_header">
                                <h2 className="title float-left">Browsers Used</h2>
                                
                            </header>
                            <div className="content-body">
                                <div className="row">
                                    <div className="col-lg-12">
                            

                                    <div className="chart-area" style={{height: 400+'px'}}>
                                        <Doughnut data={data2} options={gradientChartOptionsConfiguration3} />
                                    </div>


                                    </div>
                                </div>


                            </div>
                        </section>
                    </div>
                                  
                        </Col>

                    </Row>
                </div>
            </div>
        );
    }
}

export default MusicReportsTrending;
