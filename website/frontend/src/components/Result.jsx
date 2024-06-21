import { useState, useEffect } from "react"
import { resultsOptions, labels } from "../utils/chartConfig";
import { Bar } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Colors
  } from 'chart.js';

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Colors
  );

const getResults = data => {
    const chartData = {
        labels,
        datasets: [
            {
            label: 'Loading...',
            data: [0,0,0,0],
            barPercentage: 0.5,
            categoryPercentage: 1,
            borderColor: 'rgb(127, 255, 212)',
            borderWidth: 2,
            backgroundColor: (context) => {
                const value = context.dataset.data[context.dataIndex];
                return value >= 50 ? 'red' : 'green';},
            yAxisID: 'y'
            }
        ]
    };
    chartData.datasets[0].label= 'Final Result'
    chartData.labels = ['Lips Movement', 'Dynamic Texture', 'Frequency Domain', 'SBI Analysis']
    const lipResult = Math.max(data['LipDFAvg'], data['LipF2FAvg'], data['LipFSAvg'], data['LipNTAvg'])
    const dtResult = Math.max(data['DTBinaryDFAvg'], data['DTBinaryF2FAvg'], data['DTBinaryFSAvg'], data['DTBinaryNTAvg'])
    const fdResult = Math.max(data['FDA_DF'], data['FDA_F2F'], data['FDA_FS'], data['FDA_NT'])
    const sbiResult = data['SBIAvg']
    chartData.datasets[0].data = [lipResult*100, dtResult*100, fdResult*100, sbiResult*100]
    return chartData
}

const Result = ({data}) => {
    const [resultSign, setResultSign] = useState(0)
    const [resultMessage, setResultMessage] = useState('This video might be Fake!')
    const [messageType, setMessageType] = useState('real')
    const [resultsData, setResultData] = useState({})
    
    useEffect(() => {
        const resultData = getResults(data)
        const messageType = getMessage(resultData)
        setMessageType(messageType)
        setResultMessage(messageType)
    }, [])  

    const getMessage = (resultData) => {
        const normArray = resultData.datasets[0].data.map(element => Math.round(element / 100))
        const sum = normArray.reduce((accumulator, currentValue) => accumulator + currentValue, 0)
        console.log(sum)
        if(sum == 0)
        return 'REAL'
        else if(sum > 2)
        return 'FAKE'
        else
        return 'SUSPICIOUS'
    }

    return (
        <>
        <div className="result-container">
            <div className={"final-result" + ` ${messageType}`}>
                <p>{resultMessage} VIDEO</p>
            </div>
            <div className="chart"><Bar options={resultsOptions} data={getResults(data)}/></div>
        </div>
        </>
    )
}

export default Result