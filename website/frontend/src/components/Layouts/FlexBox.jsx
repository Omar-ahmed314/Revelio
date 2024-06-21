import { Fragment } from "react"
import '../../styles/Layouts/FlexBox.css'

const FlexBox = ({children, settings}) => {
    return (
        <Fragment>
            <div className="flex-box" style={{
                marginLeft: settings?.marginLeft + '%',
                marginRight: settings?.marginRight + '%',
                marginTop: settings?.marginTop + '%',
                marginBottom: settings?.marginBottom + '%',
                }}>

                {children.map((value, index) => 
                    <section style={{
                        margin: settings?.innerMargin + '%',
                        
                    }}>
                        {value}
                    </section>
                )}
            </div>
        </Fragment>
    )
}

export default FlexBox