import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Search from '@material-ui/icons/Search'

const toolbarStyles = theme => ({
    root: {
        paddingRight: theme.spacing.unit,
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85),
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark,
            },
    spacer: {
        flex: '1 1 auto',
    },
    actions: {
        color: theme.palette.text.secondary,
    },
    title: {
        flex: '1 1 auto',
    },
    button: {
        margin: theme.spacing.unit,
    },
    margin: {
        margin: theme.spacing.unit,
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing.unit * 2,
    },
});

let EnhancedTableToolbar = props => {
    const { buttonActions, selectView, keySearchs, numSelected, classes, handleSearch, viewActionToolbar } = props;

    return (
        <React.Fragment>
            <Toolbar
                className={classNames(classes.root, {
                    [classes.highlight]: numSelected > 0,
                })}
            >
                <div className={classes.spacer} >
                    <Grid container spacing={8} alignItems="flex-end">
                        {viewActionToolbar.search ?
                            (
                                <React.Fragment>
                                    <Grid item>
                                        <TextField
                                            id="name"
                                            labselectViewel="Search"
                                            typselectViewe="search"
                                            claselectViewssName={classes.textField}
                                            marselectViewgin="normal"
                                            value={keySearchs}
                                            onChange={handleSearch}
                                            placeholder="Search"
                                        />
                                    </Grid>
                                    <Grid item>
                                        <Search />
                                    </Grid>
                                </React.Fragment>
                            ) : ''}

                        {viewActionToolbar.checkbox ?
                            <Grid item>
                                <div className={classes.title}>
                                    {numSelected > 0 ? (
                                        <Typography color="inherit" variant="subheading">
                                            {numSelected} selected
                                </Typography>
                                    ) : ''}
                                </div>
                            </Grid>
                            :
                            <Grid item>
                                    {buttonActions ? buttonActions : ''}
                            </Grid>
                        }
                    </Grid>
                </div>

                <div className={classes.actions}>
                    {numSelected > 0 ? (
                        <div >
                            {buttonActions ? buttonActions : ''}
                        </div>
                    ) :
                        selectView ? selectView : ''
                    }
                </div>
            </Toolbar>
        </React.Fragment>
    );
};

EnhancedTableToolbar.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
};

export default EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);