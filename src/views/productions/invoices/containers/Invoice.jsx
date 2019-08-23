import * as React from 'react';
import { withStyles } from '@material-ui/core';

type Props = {};

const styles=(theme)=>{
    return {

    }
}

class Invoice extends React.Component<Props> {
    constructor(props: Props) {
        super(props);

    }

    componentWillMount() {

    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps: Props) {

    }

    shouldComponentUpdate(nextProps: Props, nextState: TM_STATE_TYPE) {

    }

    componentWillUpdate(nextProps: Props, nextState: TM_STATE_TYPE) {

    }

    componentDidUpdate(prevProps: Props, prevState: TM_STATE_TYPE) {

    }

    componentWillUnmount() {

    }

    render() {
        const {match} = this.props
        return (
            <div>
                {JSON.stringify(match)}
            </div>
        );
    }
}

export default withStyles(styles,{withTheme:true})(Invoice) ;