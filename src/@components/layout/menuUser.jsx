import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import moment from 'moment';
import { blue100, blue300 } from 'material-ui/styles/colors';
import RefreshIcon from '@material-ui/icons/Refresh';


const styles = {
    media: {
        height: 140,
    },
    number: {
        color: "rgb(103, 58, 183)",
        padding: "0 15px 0 15px",
        fontSize: 35
    },
    body_popup: {
        minWidth: 300,
        height: "auto",
        position: "fixed",
        right: 10,
        boxShadow:
            "rgba(0, 0, 0, 0.16) 0px 3px 10px, rgba(0, 0, 0, 0.23) 0px -4px 10px"
    },
    card: {
        float: "right",
        width: 180,
        height: 76,
        textAlign: "right"
    },
    card_number: {
        color: blue300,
        height: 43,
        lineHeight: "48px",
        fontSize: 32
    }
};

function MenuUser(props) {
    const { classes, onLogout, user = {}, show_report, is_ajax, showReport, total_keyed_characters = 0, speed_second_per_char = 0 } = props;
    return (
        <div style={{ width: 350 }}>
            <CardContent>
                <Typography gutterBottom variant="headline" component="h2">
                    {user.username}
                </Typography>
                <Typography component="p">

                </Typography>
            </CardContent>

            <CardActions>
                <Button size="small" color="primary" onClick={e => { e.preventDefault(); showReport(); }}>
                    Thống kê trong ngày ({`${moment(new Date()).format("YYYY/MM/DD")}`}) <RefreshIcon />
                </Button>
            </CardActions>
            {show_report && !is_ajax && (
                <CardContent>
                    <Typography gutterBottom component="h6">
                        Total keyed chars: {total_keyed_characters}
                    </Typography>
                    <Typography gutterBottom component="h6">
                        Speed per char(sec): {speed_second_per_char}
                    </Typography>
                </CardContent>
            )}
            {show_report && is_ajax && (
                <div style={{ textAlign: "center" }}>
                    <CircularProgress className={classes.progress} color="secondary" size={50} />
                </div>
            )}

            <CardActions>
                <Button size="small" color="primary" onClick={e => { e.preventDefault(); onLogout() }}>
                    LOGOUT
                </Button>
            </CardActions>
        </div>
    );
}

MenuUser.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MenuUser);