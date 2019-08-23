import { debounce } from './debounce';

export type GetDataType = (dispatch: Function, getState: Function) => Object;
const StoreService = () => {
    if (StoreService.instance !== undefined)
        return StoreService.instance;
    var listens = new Map();
    var sending = new Map();
    StoreService.instance = {
        sendStore: (key: string, data: Object | GetDataType, id) => {
            if (listens.has(key)) {
                let _listen = listens.get(key);
                if (id && sending.get(key) !== id) {
                    _listen.flush();
                    sending.set(key, id);
                }
                _listen(data);
            }
        },
        addListener: (key: string, listen, time = 2000) => {
            let _listen = debounce(listen, time);
            _listen.clear()
            listens.set(key, _listen);
        },
        clear: (key) => {
            if (listens.has(key)) {
                let _listen = listens.get(key);
                _listen.clear();
            }
        },
        flush: (key) => {
            if (listens.has(key)) {
                let _listen = listens.get(key);
                _listen.flush();
            }
        },
        flushAll: () => {
            listens.forEach((listen, key) => {
                listen.flush();
            });
        },
        clearAll: () => {
            listens.forEach((listen, key) => {
                listen.clear();
            });
        },
        removeListener: (key) => {
            if (listens.has(key)) {
                let _listen = listens.get(key);
                _listen.flush();
                listens.delete(key);
            }
        },

        removeAll: (flush: Boolean = true) => {
            let fnc = flush ? 'flush' : 'clear';
            listens.forEach((listen, key) => {
                listen[fnc]();
            });
            listens.clear();
        }
    };
    return StoreService.instance;

}
export const getStoreService = () => {
    return new StoreService();
}