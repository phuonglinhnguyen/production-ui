import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router';
import { URL_MODULE } from '../constants';
import KeyingContainer from './keying_container';
import { resetALL } from '../actions';
class Keying extends Component {
    componentWillUnmount() {
        this.props.dispatch(resetALL());
    }
    render() {
        return (
            <Switch>
                <Route
                    path={`/${URL_MODULE}/:projectId/:layoutName/:sectionName/:taskId/:taskInstanceId`}
                    component={KeyingContainer}
                />
                <Route
                    path={`/${URL_MODULE}/:projectId/:layoutName/:sectionName/:taskId`}
                    component={KeyingContainer}
                />
                <Route
                    path={`/training/${URL_MODULE}/:projectId/:layoutName/:sectionName/:taskId/:taskInstanceId`}
                    component={KeyingContainer}
                />
                <Route
                    path={`/training/${URL_MODULE}/:projectId/:layoutName/:sectionName/:taskId`}
                    component={KeyingContainer}
                />
            </Switch>
        );
    }
}
export default connect()(Keying);
