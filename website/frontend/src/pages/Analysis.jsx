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
        inflateAmount: 10,
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
    text: '',
    },
},
};

// data we need
export const options = {
    responsive: true,
    elements: {
        bar: {
            inflateAmount: 10,
            borderRadius: 2
        }
    },
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
            min: 0,
            max: 100,
            ticks: {
                stepSize: 50,
            },
        }
    }
  };
  
const labels = ['DeepFake', 'Face2Face', 'FaceSwap', 'Neural Textures'];


const Analysis = () => {
    const [isAnalyze, setAnalyze] = useState(true)
    const [data, setData] = useState({})
    const videoFile = useSelector((state) => state.file.value)
    const [videoURL, setVideoURL] = useState('')
    const [resultSign, setResultSign] = useState(0)
    const [resultMessage, setResultMessage] = useState('This video might be Fake!')

    useEffect(() => {
        const doWork = async () => {
            //const jobId = await getJobID()
            //const data  =  await getAnalysis(jobId)
            const data = {
                'LipDFAvg': 0.95,
                'LipF2FAvg':0.3,
                'LipFSAvg': 0.1,
                'LipNTAvg': 0.72,
    
                'FDA_DF': 0.89,
                'FDA_F2F': 0.59,
                'FDA_FS': 0.2,
                'FDA_NT': 0.52,
    
                'DTBinaryDFAvg': 0.3,
                'DTBinaryF2FAvg':0.21,
                'DTBinaryFSAvg':0.41,
                'DTBinaryNTAvg':0.02,
                    
                'SBIAvg': 0.65,   
            }
            setTimeout(() => { setAnalyze(false); setData(data); }, 3000);
            
    
            readVideoURL(videoFile, (url) => setVideoURL(url));
        }
        doWork()
    }, [])

    const getJobID = async () => {

        try {
            const response = await axios.get(`${config.url}:${config.port}/analyze`,
            {
                headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                params: {
                    filename: videoFile.name
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

    const processData = (chartIndex) => { 
        const chartData = {
            labels,
            datasets: [
              {
                label: 'Loading...',
                data: [0,0,0,0],
                barPercentage: 0.5,
                categoryPercentage: 0.1,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: (context) => {
                    const value = context.dataset.data[context.dataIndex];
                    return value >= 50 ? 'red' : 'green';},
                yAxisID: 'y'
              }
            ]
          };
          if(isAnalyze) return chartData;
        switch(chartIndex) {
            case 0:
                chartData.datasets[0].label= 'Lips Movement Analysis'
                chartData.datasets[0].data = [data['LipDFAvg']*100, data['LipF2FAvg']*100, data['LipFSAvg']*100, data['LipNTAvg']*100]
                return chartData
            case 1:
                chartData.datasets[0].label= 'Dynamic Texture Analysis'
                chartData.datasets[0].data = [data['DTBinaryDFAvg']*100, data['DTBinaryF2FAvg']*100, data['DTBinaryFSAvg']*100, data['DTBinaryNTAvg']*100]
                return chartData
            case 2:
                chartData.datasets[0].label= 'Frequency Domain Analyis'
                chartData.datasets[0].data = [data['FDA_DF']*100, data['FDA_F2F']*100, data['FDA_FS']*100, data['FDA_NT']*100]
                return chartData
            case 3:
                chartData.datasets[0].label= 'SBI Analysis'
                chartData.datasets[0].data = [data['SBIAvg']*100]
                chartData.labels = ['SBI']
                return chartData
            case 4:
                chartData.datasets[0].label= 'Final Result'
                chartData.labels = ['Lips Movement', 'Dynamic Texture', 'Frequency Domain', 'SBI Analysis']
                const lipResult = Math.max(data['LipDFAvg'], data['LipF2FAvg'], data['LipFSAvg'], data['LipNTAvg'])
                const dtResult = Math.max(data['DTBinaryDFAvg'], data['DTBinaryF2FAvg'], data['DTBinaryFSAvg'], data['DTBinaryNTAvg'])
                const fdResult = Math.max(data['FDA_DF'], data['FDA_F2F'], data['FDA_FS'], data['FDA_NT'])
                const sbiResult = data['SBIAvg']
                chartData.datasets[0].data = [lipResult*100, dtResult*100, fdResult*100, sbiResult*100]
                return chartData
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
                        <div className="chart"><Bar options={resultsOptions} data={processData(4)}/></div>
                    </div>
                </div>
                <div className="analysis-container">
                    <div className="chart"><Bar options={options} data={processData(0)}/></div>
                    <div className="chart"><Bar options={options} data={processData(1)}/></div>
                    <div className="chart"><Bar options={options} data={processData(2)}/></div>
                    <div className="chart"><Bar options={options} data={processData(3)}/></div>
                </div>
            </div>
        </div>
    )
}

export default Analysis