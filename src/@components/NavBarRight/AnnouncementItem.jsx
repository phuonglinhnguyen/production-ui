
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { green, red, orange } from '@material-ui/core/colors';
import Moment from 'moment'

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
const styles = {
    card: {
        maxWidth: 'calc(100%)',
        margin: '0px'
    },
    text: {
        width: 'calc(100% - 6px)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
    }
};




function AnnouncementItem(props) {
    const {
        dir,
        classes,
        announcement,
        onClick,
    } = props;
    let data = document.createElement("P");
    data.innerHTML = announcement.content;
    return (
        <Card className={classes.card} square={true}
            onClick={event => onClick(event)}
            elevation={announcement.seen ? 2 : 3} style={{ borderLeft: '3px solid' + getType(announcement.type) }}>
            <CardActionArea>
                <CardContent>
                    <Typography variant="h5" component="h4" className={classes.text} style={{ color: announcement.seen ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 1)' }}>
                        {announcement.subject ? announcement.subject : 'UnSubject'}
                    </Typography>
                    <Typography  component="p" className={classes.text} style={{ color: announcement.seen ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 1)' }}>
                        {announcement.project_name}
                    </Typography>
                    <Typography component="div" dir={dir} className={classes.text} style={{ color: announcement.seen ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 1)' }}>
                        {data.innerText}
                    </Typography>
                    <p
                        style={{
                            textAlign: 'right',
                            display: 'block',
                            position: 'absolute',
                            bottom: '-10px',
                            right: '5px',
                            fontSize:'10px',
                            color: announcement.seen ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 1)' 
                        }}
                    >
                        {Moment(announcement.created_date).format("YYYY/MM/DD HH:mm")}
                    </p>
                </CardContent>
            </CardActionArea>
        </Card >
    )
}

AnnouncementItem.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AnnouncementItem);