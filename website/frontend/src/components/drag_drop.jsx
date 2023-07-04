import { useEffect, useRef, useState } from 'react'
import '../styles/Drag_Drop.css'

const DragAndDrop = ({activateWindow}) => {
    const [isDraged, setDraged] = useState(false)
    const dragDropContainer = useRef(null)
    const dragDropArea = useRef(null)

    useEffect(() => {
        dragDropArea.current.addEventListener('dragover', fileDragedOver)
        dragDropArea.current.addEventListener('dragleave', fileDragedReleased)
        dragDropArea.current.addEventListener('drop', fileDroped)
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
    }

    const readFileURL = (file) => {
        const fileReader = new FileReader()
        
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
                            <input id='upload_video' type='file' hidden/>
                        </p>)
                        }
                    </div>
                </div>
            </div>
        </div>
        )
}

export default DragAndDrop