import React from 'react';
import { Route } from 'react-router';

class Productions extends React.Component {
    render() {
        const { routes = [] } = this.props;
        return (
            <section className="without-tabs" role="main">
                {routes.map((route, i) => (
                    <Route
                        key={i}
                        exact={route.exact}
                        path={route.path}
                        render={props => (
                            <route.component
                                {...props}
                                routes={route.routes}
                                muiTheme={this.props.muiTheme}
                            />
                        )}
                    />
                ))}
            </section>
        );
    }
}

export default Productions;
