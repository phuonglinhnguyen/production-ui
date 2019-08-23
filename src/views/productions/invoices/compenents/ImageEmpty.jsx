// @flow strict

import * as React from 'react';
import { withStyles, Button, GridList, GridListTile, ListSubheader, CircularProgress } from '@material-ui/core';
import { Translate } from 'react-redux-i18n';
import { ArrowBack, ArrowForward, ArrowUpward, ArrowDownward } from '@material-ui/icons'
import EventListener from 'react-event-listener';


type Props = {||};

const styles = (theme) => {
    return {
        main: {
            alignItems: 'center',
            background: '#212121',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            height: '100%',
            top: 0,
            width: '100%',
            zIndex: 1,
        }, button: {
            fontWeight: 400,
            fontSize: 20,
            paddingLeft: 3,
            paddingRight: 3,
            color: '#FFFFFF',
            lineHeight: '35px'
        },
        gridList: {
            width: 450,
            paddingTop: 50,
            color: '#BDBDBD'
        },
        label_decription: {
            textAlign: 'right',
            paddingRight: 15
        },
        label_shortcut: {
            color: '#FFFFFF'
        }
    }
}

const ImageEmpty = (props) => {
    const { classes, loading, getTask } = props;
    const handleKeyDown = ({ code }) => {
        if (!loading && code === 'Enter') {
            getTask()
        }
    }
    if (!loading) {
        return (
            <div className={classes.main}>
                <EventListener target="window" onKeyDown={handleKeyDown} />
                <div
                    style={{
                        color: 'white',
                        fontSize: 20
                    }}
                >
                    {'Please press ENTER KEY or '}
                    <Button className={classes.button}
                        color="primary"
                        onClick={event => { getTask() }}
                    >
                        <Translate value="productions.click_here" />
                    </Button>
                    {' to get task'}
                </div>

                <GridList cellHeight={30} cols={2} className={classes.gridList}>
                    <GridListTile key="Subheader" cols={2} style={{ height: 'auto', color: '#FFFFFF' }}>
                        <Translate value={'productions.keying_invoice.shortcuts'} />
                    </GridListTile>
                    <GridListTile className={classes.label_decription}>
                        <Translate value={'productions.keying_invoice.save_task'} />
                    </GridListTile>
                    <GridListTile className={classes.label_shortcut}>
                        <span>
                            {'Alt + S'}
                        </span>
                    </GridListTile >
                    <GridListTile className={classes.label_decription}>
                        <Translate value={'productions.keying_invoice.go_next_back_up_down'} />
                    </GridListTile>
                    <GridListTile>
                        <span>
                            <ArrowBack />
                            <ArrowForward />
                            <ArrowUpward />
                            <ArrowDownward />
                        </span>
                    </GridListTile>
                </GridList>
            </div>
        );
    }
    return (
        <div className={classes.main}>
            <div
                style={{
                    color: 'white',
                    fontSize: 20
                }}
            >
                <CircularProgress size={80} />
            </div>
        </div>
    )
}

export default withStyles(styles, { withTheme: true })(ImageEmpty);