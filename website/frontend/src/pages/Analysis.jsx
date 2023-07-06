import '../styles/Analysis/Analysis.css'
import { useEffect, useState } from 'react'
import axios from 'axios'
import config from '../config'

const Analysis = () => {
    const [isAnalyze, setAnalyze] = useState(true)
    const [data, setData] = useState({})

    useEffect(() => {
        const doWork = async () => {
            const jobId = await getJobID()
            await getAnalysis(jobId)
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
                <div className="video-container">
                    <video controls></video>
                </div>
                <div className="result-container"></div>
                <div className="analysis-container"></div>
            </div>
        </div>
    )
}

export default Analysis