import React, { Component } from 'react';

import _ from 'lodash'
import CircularProgress from 'material-ui/CircularProgress';
import { Translate } from 'react-redux-i18n';
import RaisedButton from "material-ui/RaisedButton";
import FlatButton from "material-ui/FlatButton";
const styles = {
    main: {
        position: "absolute",
        top: 0,
        zIndex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        width: "100%",
        background: "#212121"
    },
    gridList: {
        width: 450,
        paddingTop: 150,
        color: "#BDBDBD",
        bottom: 20,
        position: "fixed"
    },
    button: {
        fontWeight: 400,
        fontSize: 20,
        paddingLeft: 3,
        paddingRight: 3,
        color: "#FFFFFF",
        lineHeight: "35px"
    },
    label_decription: {
        textAlign: "right",
        paddingRight: 15
    },
    label_shortcut: {
        color: "#FFFFFF"
    }
};

export default class VerifyQcImageEmpty extends Component {
    constructor(props) {
        super(props);

        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    handleKeyDown(event) {

        const charCode = event.charCode;
        const tag = event.target.tagName.toLowerCase();

        if (tag === "input") {
            return;
        }

        if (charCode === 13) {
            this.props.getTask(false);
        }
    }

    componentDidMount() {
          window.addEventListener("keypress", this.handleKeyDown);
    }

    componentWillUnmount() {
           window.removeEventListener("keypress", this.handleKeyDown);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.props, nextProps);
    }
    render() {
        const {

            is_fetching_tasks,
            getTask

        } = this.props;
        if (is_fetching_tasks) {
            return (
                <div style={styles.main}>
                    <RaisedButton
                        icon={<CircularProgress size={25} />}
                        label={<Translate value={"productions.classify.getting_task"} />}
                    />
                </div>
            );
        }

        return (
            <div style={styles.main}>
                <div
                    style={{
                        color: "white",
                        fontSize: 20
                    }}
                >
                    {"Please press ENTER KEY or "}
                    <FlatButton
                        style={{ minWidth: 80 }}
                        labelStyle={styles.button}
                        onClick={() => getTask(false)}
                        label={<Translate value="productions.classify.click_here" />}
                    />
                    {" to get task"}
                </div>


            </div>
        );
    }
}