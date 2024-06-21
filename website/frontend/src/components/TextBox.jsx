import '../styles/TextBox.css'
const TextBox = ({header, source}) => {
    return (
        <div className="text-container">
            <h1>{header}</h1>
            <p>{source}</p>
        </div>
    )
}

export default TextBox