import { worker_script } from "./worker";
import { ServiceWorker } from './service_none_worker';
const LookupWorker = () => {
    if (LookupWorker.instance !== undefined)
        return LookupWorker.instance;
    var worker;
    // eslint-disable-next-line
    var listens = new Map();
    const _loadWorker = () => {
        if (!worker) {
            if (typeof Worker !== 'undefined') {
                worker = new Worker(worker_script);
            } else {
                // eslint-disable-next-line
                worker = new ServiceWorker();
            }
            worker.onmessage = m => {
                const { payload, instanceId } = m.data;
                let _listens = listens.has(instanceId) ? listens.get(instanceId) : [];
                _listens.forEach((_listen) => {
                    _listen(payload);
                });
            }
        }
    }
    const _removeWorker = () => {
        try {
            // eslint-disable-next-line
            worker && worker.terminate & worker.terminate();
        } catch (error) {}
            worker = undefined;
    }
    LookupWorker.instance = {
        loadLookup: (instanceId, metadata) => {
            if (!worker)
                return false;
            worker.postMessage({ instanceId, metadata });
            return true;
        },
        addListener: (instanceId, listen) => {
            if (listens.has(instanceId)) {
                let _listens = listens.get(instanceId);
                if (!_listens.has(listen)) {
                    _listens.add(listen);
                }
            } else {
                let _listens = new Set();
                _listens.add(listen);
                listens.set(instanceId, _listens);
            }
            _loadWorker();
        },
        removeListener: (instanceId, listen) => {
            if (listens.has(instanceId)) {
                if (listen) {

                    let _listens = listens.get(instanceId);
                    if (_listens.has(listen)) {
                        _listens.delete(listen);
                    }
                    if (_listens.size === 0) {
                        listens.delete(instanceId);
                    }
                } else {
                    listens.delete(instanceId);
                }
            }
            if (listens.size === 0) {
                _removeWorker();
            }
        },
        removeWorker: () => {
            _removeWorker();
        }
    };
    return LookupWorker.instance;

}
export const getLookupService = () => {
    return  LookupWorker();
}