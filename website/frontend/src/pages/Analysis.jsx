import '../styles/Analysis/Analysis.css'
import { useEffect, useState } from 'react'
import axios from 'axios'
import config from '../config'
import { useSelector } from 'react-redux'
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


export const resultsOptions = {
indexAxis: 'y',
elements: {
    bar: {
        inflateAmount: 2,
        borderRadius: 2
    }
},
layout: {
    padding: 0
},
responsive: true,
plugins: {
    legend: {
    position: 'right',
    },
    title: {
    display: true,
    text: 'Chart.js Horizontal Bar Chart',
    },
},
};

// data we need
export const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Chart.js Bar Chart',
      },
    },
    scales: {
        y: {
            ticks: {
                min: 0,
                max: 100,
                // stepSize: 5
            }
        }
    }
  };
  
  const labels = ['Deep Fake', 'Face2Face', 'Face Swap', 'Neural Textures'];
  const fakeData = [50, 40, 5, 20]
  
  export const chartData = {
    labels,
    datasets: [
      {
        label: 'Dataset 1',
        data: fakeData,
        barPercentage: 0.5,
        categoryPercentage: 0.1,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: (context) => {
            const value = context.dataset.data[context.dataIndex];
            return value >= 10 ? 'red' : 'green';},
        yAxisID: 'y'
      }
    ]
  };


const Analysis = () => {
    const [isAnalyze, setAnalyze] = useState(true)
    const [data, setData] = useState({})
    const videoFile = useSelector((state) => state.file.value)
    const [videoURL, setVideoURL] = useState('')
    const [resultSign, setResultSign] = useState(0)
    const [resultMessage, setResultMessage] = useState('Real')

    useEffect(() => {
        const doWork = async () => {
            const jobId = await getJobID()
            const data  = await getAnalysis(jobId)
            readVideoURL(videoFile, (url) => setVideoURL(url))
        }
        doWork()
    }, [])

    const getJobID = async () => {
        try {
            const response = await axios.post(`${config.url}:${config.port}/analyze`,
            undefined,
            {
                headers: {
                        "Content-Type": 'application/json',
                        'Accept': 'application/json'
                    }
            })
            let jobId = response.data['job_id']
            return jobId
        } catch(err) {}
    }

    const readVideoURL = (file, callback) => {
        const fileReader = new FileReader()
        fileReader.onload = () => {
            console.log(fileReader.result)
            callback(fileReader.result)
        }
        fileReader.readAsDataURL(file)
    }

    const getAnalysis = async (job_id) => {
        try {
            while(true) {
                const response = await axios.get(`${config.url}:${config.port}/getAnalysis`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    params: {
                        job_id: job_id
                    }
                })

                const body = response.data

                if(body['status'] == 'done') {
                    setAnalyze(false)
                    setData(body['data'])
                    break
                }
            }
        } catch (err) {
            
        }
    }

    return (
        <div className="page-container">
            {isAnalyze ? <div className="analyze-popup-background">
                <div className="analyze-popup-window">
                    <span>ANALYZING</span>
                </div>
            </div> : undefined}
            <div className="toolbar">
                <a href="/">BACK</a>
            </div>
            <div className="page-body">
                <div className="video-result-container">
                    <div className="video-container">
                        <video src={videoURL} controls></video>
                    </div>
                    <div className="result-container">
                        <div className="final-result">
                            <p>{resultMessage}</p>
                        </div>
                        <div className="chart"><Bar options={resultsOptions} data={chartData}/></div>
                    </div>
                </div>
                <div className="analysis-container">
                    <div className="chart"><Bar options={options} data={chartData}/></div>
                    <div className="chart"><Bar options={options} data={chartData}/></div>
                    <div className="chart"><Bar options={options} data={chartData}/></div>
                    <div className="chart"><Bar options={options} data={chartData}/></div>
                </div>
            </div>
        </div>
    )
}

export default Analysis