import '../styles/Analysis/Analysis.css'
import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import config from '../config'
import Video from '../components/video'
import Result from '../components/Result'
import AnalysisComp from '../components/AnalysisComp'
import Toolbar from '../components/Toolbar'

   
const Analysis = () => {
    const [isAnalyze, setAnalyze] = useState(true)
    const [data, setData] = useState({})
    const [isResultsActive, setIsResultsActive] = useState(true) 
    const videoFile = useSelector((state) => state.file.value)

    useEffect(() => {
        const doWork = async () => {
            const jobId = await getJobID()
            const data  =  await getAnalysis(jobId)
            // const data = {"LipDF": [0.8560863137245178, 0.09192192554473877, 0.8527987599372864, 0.07138288021087646], "LipDFAvg": 0.46804749965667725, "LipF2F": [0.9890004992485046, 0.9306281208992004, 0.9967411756515503, 0.5059844255447388], "LipF2FAvg": 0.8555885553359985, "LipFS": [0.004478335380554199, 4.76837158203125e-07, 0.0001347064971923828, 0.0], "LipFSAvg": 0.0011533498764038086, "LipNT": [0.0031213760375976562, 0.9364521503448486, 0.08311927318572998, 0.002200186252593994], "LipNTAvg": 0.25622326135635376, "FDA_DF": 0.14423076923076922, "FDA_F2F": 0.2692307692307692, "FDA_FS": 0.22115384615384615, "FDA_NT": 0.0, "DTBinaryDF": [0.0, 1.0], "DTBinaryDFAvg": 0.5, "DTBinaryF2F": [0.0, 1.0], "DTBinaryF2FAvg": 0.5, "DTBinaryFS": [0.0, 1.0], "DTBinaryFSAvg": 0.5, "DTBinaryNT": [0.0, 1.0], "DTBinaryNTAvg": 0.5, "DTMulti": [0.0, 4.0], "SBI": [0.08270682394504547, 0.07796404510736465, 0.03387252613902092, 0.07806439697742462], "SBIAvg": 0.06815195083618164}
            // setTimeout(() => { setAnalyze(false); setData(data); }, 3000);
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
                    setData(JSON.parse(body['data']))
                    setAnalyze(false)
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
            <Toolbar/>
            <div className="page-body">
                {!isAnalyze ? 
                <>
                    <Video/>
                    <span className="expander" onClick={() => setIsResultsActive(!isResultsActive)}>❮</span>
                    <div 
                    className={`results-container ${isResultsActive ? null : 'active'}`}>
                        <Result data={data}/>
                        <AnalysisComp data={data}/>
                    </div>
                </> : undefined}
                
            </div>
        </div>
    )
}

export default Analysis