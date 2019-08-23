import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import CircularProgress from 'material-ui/CircularProgress';
import { Translate } from 'react-redux-i18n';
import RaisedButton from "material-ui/RaisedButton";
import FlatButton from "material-ui/FlatButton";
import Subheader from 'material-ui/Subheader';
import ArrowDown from 'material-ui/svg-icons/navigation/arrow-downward';
import ArrowUp from 'material-ui/svg-icons/navigation/arrow-upward';
import { GridList, GridTile } from 'material-ui/GridList';
import EventListener from 'react-event-listener';
import keycode from 'keycode';

const styles = {
    gridList: {
        width: 450,
        paddingTop: 150,
        color: '#BDBDBD',
        bottom: 20,
        position: 'absolute',
        zIndex:10
    },
    button: {
        fontWeight: 400,
        fontSize: 20,
        paddingLeft: 3,
        paddingRight: 3,
        color: '#FFFFFF',
        lineHeight: '35px'
    },
    label_decription: {
        textAlign: 'right',
        paddingRight: 15
    },
    label_shortcut: {
        color: '#FFFFFF'
    }
}
export default class OverflowGetTask extends Component {
    

    handleKeyDown = (event) => {
        const {getTask} = this.props;
        let key_code = ''
        try {
          key_code = keycode(event).toLowerCase();
        } catch (error) {
          key_code = '';
        }
        if (key_code === 'enter') {
            event.preventDefault();
            getTask(false)
          }

    }
    render() {
        const { getTask, task } = this.props;
       
        return (
            <Paper
                zDepth={1}
                style={{
                    width: 'calc(100%)',
                    height: 'calc(100%)',
                    position: 'relative'
                }}
            >
              <EventListener target="window" onKeyDown={this.handleKeyDown} />
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        display: !task.item ? "flex" : "none",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                        width: "100%",
                        background: "#212121"
                    }}
                >
                    {task.isFetching ? (
                        <RaisedButton
                            icon={<CircularProgress size={25} />}
                            label={<Translate value={"productions.classify.getting_task"} />}
                        />
                    ) : (
                            <div style={{ color: "white" }}>
                                {"Please press ENTER KEY or "}
                                <FlatButton
                                    style={{ minWidth: 80 }}
                                    labelStyle={{
                                        paddingLeft: 1,
                                        paddingRight: 1,
                                        color: "#FFFFFF"
                                    }}
                                    onClick={() => getTask(false)}
                                    label={<Translate value="productions.classify.click_here" />}
                                />
                                {" to get task"}
                            </div>
                        )}
                    <GridList style={styles.gridList} cellHeight={30} cols={2}>
                        <Subheader style={{ color: '#FFFFFF' }}>
                            <Translate value={'productions.verify_key.shortcuts'} />
                        </Subheader>
                        <GridTile style={styles.label_decription}>
                            <Translate value={'productions.verify_key.save_task'} />
                        </GridTile>
                        <GridTile style={styles.label_shortcut}>{'Alt + S'}</GridTile>
                        <GridTile style={styles.label_decription}>
                            <Translate value={'productions.verify_key.select_layout'} />
                        </GridTile>
                       
                        <GridTile>
                            <ArrowDown color="#FFFFFF" />
                            <ArrowUp color="#FFFFFF" />
                        </GridTile>
                    </GridList>
                </div>
            </Paper>
        );
    }
}