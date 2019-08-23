import RestAPI from './rest_api';
import _registers from '../registers';
function XClient(registers = _registers, restAPI = RestAPI) {
    this._requestMethods = this._prepMethods(restAPI);
    this._prepResources(registers, this._requestMethods);
}

XClient.prototype = {
    _prepResources: function (registers, requestMethods) {
        for (var name in registers) {
            this[
                name[0].toLowerCase() + name.substring(1)
            ] = new registers[name](requestMethods);
        }
    },
    register: (name, api, requestMethods) => {
        let _requestMethods = requestMethods || this._requestMethods;
        if (name && name.length) {
            this[name] = new api(_requestMethods);
        }
    },
    _prepMethods: function (restAPI) {
        let _restAPI = new restAPI();
        return _restAPI;
    }
}

export default XClient;
