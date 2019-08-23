import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router';
import { URL_MODULE } from '../constants';
import KeyingContainer from './keying_layout_container';
import { resetALL } from '../actions';
class MixedKeying extends Component {
    componentWillUnmount() {
        this.props.dispatch(resetALL());
    }
    render() {
        return (
            <div>
                <Route
                    exact
                    path={`/${URL_MODULE}/:projectId/:layoutName/:taskId`}
                    component={KeyingContainer}
                />
                <Route
                    exact
                    path={`/${URL_MODULE}/:projectId/:layoutName/:taskId/:taskInstanceId`}
                    component={KeyingContainer}
                />
                <Route
                    exact
                    path={`/training/${URL_MODULE}/:projectId/:layoutName/:taskId`}
                    component={KeyingContainer}
                />
                <Route
                    exact
                    path={`/training/${URL_MODULE}/:projectId/:layoutName/:taskId/:taskInstanceId`}
                    component={KeyingContainer}
                />
            </div>
        );
    }
}
export default connect()(MixedKeying);
