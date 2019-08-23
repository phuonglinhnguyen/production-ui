import { SocketIO, OptionSocketType } from './SocketIO'
import { getAccessToken, USER_INIT, showNotification } from '@dgtx/coreui'
import message from 'material-ui/svg-icons/communication/message';
type Props = {
    app_name: string,
    url: string,
    option?: OptionSocketType,
}
export default (props: Props) => {
    let _dispatch;
    const socketIO = new SocketIO({
        url: props.url,
        option: props.option,
        onMessage: (message) => {
            _dispatch(message)
        },
        onDisconnect: () => {
            console.log('====================================');
            console.log('Socket Disconnected...');
            console.log('====================================');
        },
        onError: (error) => {
            if(error&&error.type){
                _dispatch(error)
            }else{
                _dispatch(showNotification(`Online:${error}` ,"error"))
            }
        }
    })
    return {
        SocketIO: socketIO,
        socketMiddleware: ({ dispatch, getState }) => (next: Function) => (action) => {
            if (action.type === USER_INIT) {
                _dispatch = dispatch
                let token = getAccessToken()
                socketIO.connect({ token, username: action.payload.username, app_name: props.app_name })
            }
            return next(action)
        }
    }
}