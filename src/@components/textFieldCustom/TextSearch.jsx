import React from 'react';
import PropTypes from 'prop-types';
import keycode from 'keycode';
import compose from 'recompose/compose';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import Input from '@material-ui/core/Input';
import SearchIcon from '@material-ui/icons/Search';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';



const styles = theme => ({
    root: {
        fontFamily: theme.typography.fontFamily,
        position: 'relative',
        marginRight: theme.spacing.unit * 2,
        marginLeft: theme.spacing.unit,
        //, fade(theme.palette.common.white, 0.15),

        '&:hover': {
            background: fade(theme.palette.common.white, 0.25),
        },
        '& $inputInput': {
            transition: theme.transitions.create('width'),
            width: 250,
            '&:focus': {
                width: 550,
            },
        },
    },
    search: {
        width: theme.spacing.unit * 9,
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        top:-2,
        left:-14,
        zIndex:1,
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: `${theme.spacing.unit}px ${theme.spacing.unit}px ${theme.spacing.unit}px ${theme.spacing.unit * 9}px`,
        borderRadius: 4,
        // border: '1px solid #ced4da',
        marginTop:8,
        fontSize: 20,
        padding: '10px 12px 10px 42px',
        width: 'calc(100% - 48px)',
        background: 'rgba(0,0,0,0.04)',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&:focus': {
            borderColor: '#80bdff',
        },
    },
});

const TextSearch = (props) => {
    const { classes, width, value = '', onChange } = props;
    return (
        <div className={classes.root} style={{ display: isWidthUp('sm', width) ? 'block' : 'none' }}>
            <div className={classes.search}>
                <SearchIcon />
            </div>
            <Input
                onChange={event => { event.preventDefault(); onChange(event.target.value) }}
                onKeyDown={this.handleKeyDown}
                disableUnderline
                placeholder="Search…"
                value={value}
                classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                }}
            />
        </div>
    );
}

TextSearch.propTypes = {
    classes: PropTypes.object.isRequired,
    width: PropTypes.string.isRequired,
};

export default compose(
    withStyles(styles),
    withWidth(),
)(TextSearch);