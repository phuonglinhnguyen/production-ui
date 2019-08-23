import React from 'react'
import { withStyles } from '@material-ui/core/styles';

import styles from './styles';
function ViewRichText(props) {
    const {value='' } = props
    return (
        <div className="rich-text-input">
            <div className="ql-container ql-snow">
                <div className="ql-editor" dangerouslySetInnerHTML={{ __html: value }} />
            </div>
        </div>
    )
}

export default withStyles(styles)(ViewRichText)