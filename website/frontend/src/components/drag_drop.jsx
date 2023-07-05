import { useEffect, useRef, useState } from 'react'
import '../styles/Drag_Drop.css'

const DragAndDrop = ({activateWindow}) => {
    const [isDraged, setDraged] = useState(false)
    const dragDropContainer = useRef(null)
    const dragDropArea = useRef(null)
    const fileButton = useRef(null)

    useEffect(() => {
        dragDropArea.current.addEventListener('dragover', fileDragedOver)
        dragDropArea.current.addEventListener('dragleave', fileDragedReleased)
        dragDropArea.current.addEventListener('drop', fileDroped)
        fileButton.current.addEventListener('change', fileChosen)
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
        readFileURL(file, (ev) => alert(ev))
    }

    const fileChosen = (event) => {
        event.preventDefault()
        const file = event.target.files[0]
        readFileURL(file, () => alert('file chosen'))
    }

    const readFileURL = (file, callback) => {
        const fileReader = new FileReader()
        fileReader.onload = () => {
            callback(fileReader.result)
        }
        fileReader.readAsArrayBuffer(file)
    }

    const sendFile = (fileArrayBuffer) => {
        
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
                        {isDraged ? (<p>Release the file</p>) : 
                        (<p>DRAG & DROP <br/>OR 
                            <label htmlFor='upload_video'> UPLOAD</label>
                            <input id='upload_video' type='file' ref={fileButton} hidden/>
                        </p>)
                        }
                    </div>
                </div>
            </div>
        </div>
        )
}

export default DragAndDrop