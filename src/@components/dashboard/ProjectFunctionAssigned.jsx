import React from 'react';
import PropTypes from 'prop-types';
import { Translate, I18n } from 'react-redux-i18n';
import { isEqual } from 'lodash'
import { getDataObject } from '@dgtx/coreui'
import { Close as CloseIcon } from '@material-ui/icons'
import {
    IconButton,
    Button,
    Switch,
    TextField,
    SelectField,
    MenuItem,
    AutoComplete,
    Card,
    CardContent,
    Typography,
    CardActions,
    FormControlLabel,
} from '@material-ui/core'

import { DashBoardCard } from '../dashboardCard'

class ProjectFunctions extends React.Component {
    handleClickFunc = (item) => {
        const {
            project,
            onClickItem=()=>null
        } = this.props;
         onClickItem(item, project)
    }
    render() {
        const {
            project,
            functions,
            onClose,
            onClickItem
        } = this.props;
        
        return (
            <React.Fragment>
                    <CardContent>
                        <div style={{ position: 'absolute', top: 8, right: 16, zIndex: 1000 }}>
                            <IconButton
                                style={{ margin: 8 }}
                                tooltip='Close'
                                onClick={onClose}
                            >
                                <CloseIcon />
                            </IconButton>
                        </div>
                        <Typography gutterBottom variant="subtitle2">
                            PROJECT TASKS
                    </Typography>
                        <Typography style={{ marginBottom: 12 }} color="textSecondary">
                            {`Project:${project.name}`}
                        </Typography>
                    </CardContent>
                    <div className='cool_scroll_smart' style={{
                        height: 'calc(100% - 100px)',
                        minWidth: '420px',
                        overflow: 'auto',
                        background: 'rgba(255,255,255,0.4)',
                        position: 'relative'

                    }}>
                        <DashBoardCard
                            datas={functions}
                            onClickItem={this.handleClickFunc}
                        />
                    </div>
            </React.Fragment >
        );
    }
}


export default ProjectFunctions;