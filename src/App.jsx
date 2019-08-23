import * as React from 'react';
import { CoreAdmin, initConfigApp } from '@dgtx/coreui';
import { APP_NAME, API_ENDPOINT, APP_VERSION, UAC_ENDPOINT, OAUTH_ENDPOINT,API_SOCKET ,SOCKET } from './constants';
import i18n from './i18n'
import { dataProvider } from './providers'
import reducers from './reducers'
import { Loading, Page404 } from './views'
import * as auth from "./utils/auth";
import { createLogger } from 'redux-logger'
import { routeProvider } from './routes'
import './cool_scroll_smart.css'
import { LayoutRoot } from './views/shares/layout';
import createSocket from './middlewares/socket'
import announcement from './middlewares/announcement'
import { composeWithDevTools } from 'redux-devtools-extension'
import { upperCaseFirstString } from '@dgtx/core-component-ui';
let middlewaresDev = [];
let compose;

if (process.env['NODE_ENV'] !== 'production') {
    console.error = () => {}
    console.warn = () => {}
    middlewaresDev = [createLogger()];
    // compose = composeWithDevTools;
}
let _socketIO;
export const getSocketIO =()=>{
    return _socketIO;
}
document.title =upperCaseFirstString(APP_NAME);
const App = (props) => {
    const { baseUrl } = props;
    initConfigApp({ appName: APP_NAME, appVersion: APP_VERSION, appURL: baseUrl, apiURL: API_ENDPOINT, uacURL: UAC_ENDPOINT, oauthURI: OAUTH_ENDPOINT })
    auth.configAxios(auth.getAccessToken());
    let { SocketIO, socketMiddleware } = createSocket({ app_name: APP_NAME, url: SOCKET.ENDPOINT, option:{
        reconnectionDelay: SOCKET.RECONNECT_DELAY * 1000,
        reconnectionDelayMax: SOCKET.RECONNECT_DELAY_MAX * 1000,
        timeout: Number(SOCKET.TIMEOUT_MINUTES) * 60 * 1000
    } })
    _socketIO= SocketIO
    return (
        <CoreAdmin
            appURL={baseUrl}
            pages={
                {
                    page404: Page404,
                    PageLoading: Loading
                }
            }
            rootLayout={LayoutRoot}
            reducers={reducers}
            i18n={i18n}
            compose={compose}
            middlewares={[socketMiddleware,announcement]}
            dataProvider={dataProvider}
            middlewaresDev={middlewaresDev}
            routeProvider={routeProvider}
        />
    );
}
export default App;