import { Fragment } from "react"
import { labels } from "../utils/chartConfig";
import { Bar } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

const getAnalysis = (chartIndex, data) => { 
    const chartData = {
        labels,
        datasets: [
            {
            label: 'Loading...',
            data: [0,0,0,0],
            barPercentage: 0.5,
            categoryPercentage: 1,
            // barThickness: 28,
            borderWidth: 2,
            borderColor: 'rgb(127, 255, 212)',
            backgroundColor: (context) => {
                const value = context.dataset.data[context.dataIndex];
                return value >= 50 ? 'rgba(237, 7, 7, 0.66)' : 'green';},
            }
        ]
        };

    switch(chartIndex) {
        case 0:
            chartData.datasets[0].data = [data['LipDFAvg']*100, data['LipF2FAvg']*100, data['LipFSAvg']*100, data['LipNTAvg']*100]
            return chartData
        case 1:
            chartData.datasets[0].data = [data['DTBinaryDFAvg']*100, data['DTBinaryF2FAvg']*100, data['DTBinaryFSAvg']*100, data['DTBinaryNTAvg']*100]
            return chartData
        case 2:
            chartData.datasets[0].data = [data['FDA_DF']*100, data['FDA_F2F']*100, data['FDA_FS']*100, data['FDA_NT']*100]
            return chartData
        case 3:
            chartData.datasets[0].data = [data['SBIAvg']*100]
            chartData.labels = ['SBI']
            return chartData
        default:
            return chartData
    }
}

const getOptions = (chartTitle) => {
    const options = {
        responsive: true,
        elements: {
            bar: {
                inflateAmount: 'auto',
                // borderRadius: 10
            }
        },
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: chartTitle,
                font: {
                    size: 18,
                    family: 'Orbitron',
                },
                color: 'white'
            },
        },
        scales: {
            y: {
                min: 0,
                max: 100,
                ticks: {
                    stepSize: 25,
                    color: 'rgb(127, 255, 212)'
                },
                grid: {
                    color: 'rgba(127, 255, 212, 0.5)',
                    tickColor: '#00ffff',
                    tickWidth: 2
                },
                border: {
                    color: 'rgb(127, 255, 212)',
                    width: 2
                }
            },
            x: {
                grid: {
                    color: 'rgba(127, 255, 212, 0.5)',
                    tickColor: '#00ffff',
                    tickWidth: 2
                },
                ticks: {
                    color: 'rgb(127, 255, 212)',
                    font: {
                        family: 'Orbitron'
                    }
                },
                border: {
                    color: 'rgb(127, 255, 212)',
                    width: 2
                }
            },
            
            // xAxis: {
            //     grid: {
            //         color: 'rgb(127, 255, 212)',
            //     }
            // }
        }
    };
    return options
}

const AnalysisComp = ({data}) => {
    return (
        <Fragment>
            <div className="analysis-container">
                <div className="chart"><Bar options={getOptions('Lips Movement Analysis')} data={getAnalysis(0, data)}/></div>
                <div className="chart"><Bar options={getOptions('Dynamic Texture Analysis')} data={getAnalysis(1, data)}/></div>
                <div className="chart"><Bar options={getOptions('Frequency Domain Analysis')} data={getAnalysis(2, data)}/></div>
                <div className="chart"><Bar options={getOptions('SBI Analysis')} data={getAnalysis(3, data)}/></div>
            </div> 
        </Fragment>
    )
}

export default AnalysisComp