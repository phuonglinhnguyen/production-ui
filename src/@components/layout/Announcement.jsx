import * as React from 'react'
import { withStyles } from '@material-ui/core';

import Drawer from '@material-ui/core/Drawer'
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';

import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CardActions from '@material-ui/core/CardActions';

import Button from '@material-ui/core/Button';
import { green, red, orange } from '@material-ui/core/colors';
import ViewRichText from '../ViewRichText';

const getType = (key) => {
    let result = green[500];
    switch (key) {
        case 'warning':
            result = orange[500]
            break;
        case 'error':
            result = red[500]
            break;
        default:
            break;
    }
    return result;
}

const styles = theme => ({
});

function Announcement(props) {
    const { open, notify, onClose,classes } = props;
    const { subject = '',
        content = '',
        task = '',
        type = '' } = notify
    return (
        <Drawer anchor="top" open={open}>
            <Card className={classes.card}>
                <CardHeader
                    style={{
                        background: getType(type)
                    }}
                    title={subject ? subject : 'UnSubject'}
                />
                <CardContent
                    style={{
                        maxHeight: '56vh',
                        overflow: 'auto'
                    }}
                >
                    <ViewRichText value={content} />
                    {/* <Typography component="p">
                        <div className="rich-text-input ql-editor" dangerouslySetInnerHTML={{ __html: content }} />
                    </Typography> */}
                </CardContent>
                <CardActions style={{ justifyContent: 'flex-end' }}>
                    <Button variant="contained" onClick={onClose} color="primary">
                        Close
                        </Button>
                </CardActions>
            </Card>
        </Drawer>
    )
}
export default withStyles(styles)(Announcement);