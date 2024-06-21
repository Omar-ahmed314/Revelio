import { useSelector } from "react-redux"
import { useEffect, useState } from "react"

const Video = () => {
    const videoFile = useSelector((state) => state.file.value)
    const [videoURL, setVideoURL] = useState('')

    useEffect(() => {
        readVideoURL(videoFile, (url) => setVideoURL(url));
    }, [])

    const readVideoURL = (file, callback) => {
        const fileReader = new FileReader()
        fileReader.onload = () => {
            callback(fileReader.result)
        }
        fileReader.readAsDataURL(file)
    }
    return (
        <>
            <div className="video-container">
                <video src={videoURL} controls></video>
            </div>
        </>
    )
}

export default Video