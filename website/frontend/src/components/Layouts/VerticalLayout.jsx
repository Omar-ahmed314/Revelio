import { Fragment, Children } from "react"
import '../../styles/Layouts/VerticalLayout.css'

/**
 * Vertical layout acts like a container to hold components inside in 
 * a vertical axis
 * @param {*} children The inner tags that vertical layout contains 
 * @returns Vertical layout
 */
const VerticalLayout = ({children, settings}) => {
    return (
        <Fragment>
            <div className="vertical-layout" style={{
                marginLeft: settings?.marginLeft + '%',
                marginRight: settings?.marginRight + '%',
                marginTop: settings?.marginTop + '%',
                marginBottom: settings?.marginBottom + '%'}}>

                {Children.map(children, (value, index) => 
                    <section style={{
                        margin: settings?.innerMargin + '%'
                    }}>
                        {value}
                    </section>
                )}
            </div>
        </Fragment>
    )
}

export default VerticalLayout