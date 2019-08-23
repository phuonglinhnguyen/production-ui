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
 function Duplicate(props) {
    const { classes } = props;
  return (
    <div style={{ textAlign: 'center' }}>
            <h1>Permission deny</h1>
            <h2>This username have been using on another web browser</h2>
            <Button color="primary" className={classes.button}
                autoFocus={true}
                onClick={e => { redirectApp('home') }}
            >
                Goto HomePage
             </Button>
        </div>
  )
}
Duplicate.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Duplicate);