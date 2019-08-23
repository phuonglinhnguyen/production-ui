import axios from 'axios';
export class RestAPI {
    METHOD = {
        GET: 'get',
        POST: 'post',
        PUT: 'put',
        PATCH: 'patch',
        DELETE: 'delete'
    }
    __getResult(res) {
        return {
            payload: res.data,
            ...res
        }
    }
    __getError(error) {
        let _res = error.response;
        if (_res) {
            return {
                error: true,
                payload: _res.data,
                ..._res
            }
        } else {
            let message = error.message;
            return {
                error: true,
                status: 500,
                payload: message,
                ...error
            }
        }
    }
    __func = async(method, url, data, options) => {
        try {
            options = options || {}
            let _res = await axios[method](url, data, options)
            return this.__getResult(_res);
        } catch (error) {
            return this.__getError(error);
        }
    }
    get = (url) => {
        return this.__func(this.METHOD.GET, url);
    }
    post = (url, data, options) => {
        return this.__func(this.METHOD.POST, url, data, options);
    }
    patch = (url, data, options) => {
        return this.__func(this.METHOD.PATCH, url, data, options);
    }
    put = (url, data, options) => {
        return this.__func(this.METHOD.PUT, url, data, options);
    }
    delete = (url, options) => {
        return this.__func(this.METHOD.DELETE, url,null, options);
    }
}
export default RestAPI;