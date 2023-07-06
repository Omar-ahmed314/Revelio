import { useEffect, useRef, useState } from 'react'
import '../styles/Drag_Drop.css'
import config from '../config'
import axios from 'axios'

const DragAndDrop = ({activateWindow}) => {
    const [isDraged, setDraged] = useState(false)
    const [isLoading, setLoading] = useState(false) 
    const [loadingPercentage, setLoadingPercentage] = useState(0)
    const dragDropContainer = useRef(null)
    const dragDropArea = useRef(null)
    const fileButton = useRef(null)

    useEffect(() => {
        dragDropArea.current?.addEventListener('dragover', fileDragedOver)
        dragDropArea.current?.addEventListener('dragleave', fileDragedReleased)
        dragDropArea.current?.addEventListener('drop', fileDroped)
        fileButton.current?.addEventListener('change', fileChosen)
    }, [])

    const fileDragedOver = (event) => {
        event.preventDefault()
        setDraged(true)
        dragDropContainer.current.classList.add('drag_over')
    }

    const fileDragedReleased = () => {
        setDraged(false)
        dragDropContainer.current.classList.remove('drag_over')
        }

    const fileDroped = (event) => {
        event.preventDefault()
        const file = event.dataTransfer.files[0]
        readFileURL(file, (data, fileName) => uploadFile(data, fileName))
    }

    const fileChosen = (event) => {
        event.preventDefault()
        const file = event.target.files[0]
        readFileURL(file, (data, fileName) => uploadFile(data, fileName))
    }

    const readFileURL = (file, callback) => {
        const fileReader = new FileReader()
        fileReader.onload = () => {
            callback(fileReader.result, file.name)
        }
        fileReader.readAsArrayBuffer(file)
    }

    const uploadFile = async (fileArrayBuffer, fileName) => {
        setLoading(true)
        const fileSize = fileArrayBuffer.byteLength
        const CHUNK_SIZE = 1024 * 100
        const chunkCount = Math.ceil(fileSize / CHUNK_SIZE)

        for(let chunkNum = 0; chunkNum < chunkCount; chunkNum++) {
            const startIdx = chunkNum * CHUNK_SIZE
            const endIdx = startIdx + CHUNK_SIZE
            const currentChunk = fileArrayBuffer?.slice(startIdx, endIdx)

            try {
                // send the current chunk into the backend
                const response = await axios.post(`${config.url}:${config.port}/upload`, 
                currentChunk,
                {
                    headers: {'Content-Type': 'application/octet-stream',
                                'File-Name': fileName}
                })
                
                // if success call on progress callback function
                const progress = Math.round((chunkNum + 1) * 100 / chunkCount, 0)
                // onProgressCallback(progress)
                setLoadingPercentage(progress)

            } catch (err) {

            }
        }
    }

    return (
        <div className="popup_window">
            <div className="dragdrop_container">
                <div className='dragdrop_inner_container'
                ref={dragDropContainer}>
                    <div className="close_btn_container">
                        <button className="close_btn" onClick={() => activateWindow?.setPopupActive(false)}></button>
                    </div>
                    <div className="dragdrop" ref={dragDropArea}>
                        { !isLoading ? 
                        <div className="dragdrop-text">
                            {isDraged ? (<p>Release the file</p>) : 
                            (<p>DRAG & DROP <br/>OR 
                                <label htmlFor='upload_video'> UPLOAD</label>
                                <input id='upload_video' type='file' ref={fileButton} hidden/>
                            </p>)
                            }
                        </div>
                        :
                        <div className="loading_container">
                            <span>LOADING</span>
                            <progress value={loadingPercentage} max={100}>{loadingPercentage}%</progress>
                        </div>
                        }
                    </div>
                </div>
            </div>
        </div>
        )
}

export default DragAndDrop