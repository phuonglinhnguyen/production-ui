
import * as React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { redirectApp, getAppURL } from '@dgtx/coreui';


const styles = theme => ({
    button: {
        margin: theme ? theme.spacing.unit : 8,
    },
    input: {
        display: 'none',
    },
});

function error404(props) {
    const { classes } = props;
    return (
        <div style={{ textAlign: 'center' }}>
            <h1>404</h1>
            <h2> URL:{props.location.pathname}</h2>
            Permission deny OR not exist
            <Button color="primary" className={classes.button}
                autoFocus={true}
                onClick={e => { redirectApp(getAppURL()) }}
            >
                Goto HomePage
             </Button>
        </div>
    );
};
error404.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(error404);