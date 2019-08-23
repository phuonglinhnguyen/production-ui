import * as React from 'react'
import { DecorateAutoSizer } from '../common'
import { stopEvent } from '../utils/event'
import DashboardActions from './DashboardActions'
import { compose } from 'recompose';
import classnames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme) => ({
    root: {
        width: 'calc(100% - 16px)',
        position: 'relative',
        paddingTop: 16,
        paddingLeft: 16,
        overflowX: 'hidden',
        overflowY: 'auto',
        display: 'flex',
        flexWrap: 'wrap',
        textAlign: 'center',
    },
    content: {
        position: 'relative',
        display: 'flex',
        flexWrap: 'wrap',
        textAlign: 'center',
        width: '100%',
        height: 'calc(100vh - 125px)',
        margin: '0px auto',
    }
})


type Props = {
    datas: Array<Object>,
    width: Number,
    height: Number,
    onClickItem: Function
}
@compose(withStyles(styles))
@DecorateAutoSizer()
export default class Dashboard extends React.PureComponent<Props> {
    static defaultProps = {
        datas: [],
        onClickItem: () => undefined
    }
    state = {
        selecting: -1,
        redirecting: -1,
        cols: 1,
        width_content: 336,
    }

    componentDidMount = () => {
        const { width } = this.props;
        let cols = Math.floor(width / 290);
        let width_content = cols * 286;
        this.setState({
            cols, width_content
        })
        if (window) {
            window.addEventListener('keydown', this.handlekeyDown)
        }
    }
    componentWillMount() {
        if (window) {
            window.removeEventListener('keydown', this.handlekeyDown)
        }
    }
    handleMouseOut = (event) => {
        this.setState({ selecting: -1 });
    }
    handlekeyDown = (event) => {
        const { datas, onClickItem } = this.props;
        const { cols, selecting } = this.state;
        let key = event.key.toLowerCase();
        if (selecting === -1) {
            if (['arrowright', 'arrowdown'].includes(key)) {
                this.setState({ selecting: 0 })
            } else if (['arrowleft', 'arrowup'].includes(key)) {
                this.setState({ selecting: datas.length - 1 })
            }
        }
        switch (key) {
            case 'arrowleft':
                if (selecting === 0) {
                    this.setState({ selecting: datas.length - 1 })
                } else {
                    this.setState({ selecting: selecting - 1 })
                }
                stopEvent(event)
                break;
            case 'arrowright':
                if (selecting === datas.length - 1) {
                    this.setState({ selecting: 0 })
                } else {
                    this.setState({ selecting: selecting + 1 })
                }
                stopEvent(event)

                break;
            case 'arrowup':
                if (selecting - cols >= 0) {
                    this.setState({ selecting: selecting - cols })
                } else {
                    this.setState({ selecting: datas.length - 1 })
                }
                stopEvent(event)

                break;
            case 'arrowdown':
                if (selecting + cols >= datas.length) {
                    let index = selecting % cols;
                    this.setState({ selecting: index })
                } else {
                    this.setState({ selecting: selecting + cols })
                }
                stopEvent(event);
                break;

            case 'enter':
                if (selecting >= 0) {
                    onClickItem(datas[selecting])
                }
                break;
            default:
                break;
        }
    }

    componentWillReceiveProps = (nextProps) => {
        const { width } = nextProps;
        let cols = Math.floor(width / 320);
        let width_content = cols * 306;
        this.setState({
            cols, width_content
        })
    }
    handleHoverChild = (event, index) => {
        this.setState({ selecting: index })
    }
    handleOnClickItem = (data) => {
        const { onClickItem } = this.props;
        onClickItem(data)
    }
    render() {
        const { classes } = this.props;
        return (
            <div className={classnames(classes.root)} onMouseOut={this.handleMouseOut}>
                <DashboardActions />
                <div className={classnames(classes.content)}>
                </div>
            </div>
        )
    }
}
