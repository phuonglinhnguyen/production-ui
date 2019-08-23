function responseURL(xhr) {
    if ('responseURL' in xhr) {
        return xhr.responseURL;
    }
    if (/^X-Request-URL:/m.test(xhr.getAllResponseHeaders())) {
        return xhr.getResponseHeader('X-Request-URL');
    }
    return;
}
function headers(xhr) {
    var head = new Headers();
    var pairs = xhr.getAllResponseHeaders().trim().split('\n');
    pairs.forEach(function (header) {
        var split = header.trim().split(':');
        var key = split.shift().trim();
        var value = split.join(':').trim();
        head.append(key, value);
    });
    return head;
}

function getXhr() {
    if (typeof XMLHttpRequest !== 'undefined') return new XMLHttpRequest();
    if (window.ActiveXObject) {
        var versions = ["MSXML2.XmlHttp.7v.0", "MSXML2.XmlHttp.6.0", "MSXML2.XmlHttp.5.0", "MSXML2.XmlHttp.4.0", "MSXML2.XmlHttp.3.0", "MSXML2.XmlHttp.2.0", "Microsoft.XmlHttp"];
        for (var i = 0, len = versions.length; i < len; i++) {
            try {
                return new window.ActiveXObject(versions[i]);
            } catch (e) { }
        }
    }
}
function analysisData(datas) {
    var keys = {};
    var values = {};
    datas.forEach(function (data) {
        values[data.value] = values[data.value] || [data.field];
        keys[data.field] = keys[data.field] || [];
        keys[data.field].push(data.value);
    });
    var all = [];
    Object.keys(values).forEach(function (valueKey) {
        all.push(valueKey);
        var _value = values[valueKey]; //like ['a']
        var _keyOfValue = _value[0]; // like 'a';
        var _valuesOf = keys[_keyOfValue].filter(function (_val) {
            return _val !== valueKey;
        }); // like [a,a,a,a];
        values[valueKey] = _value.concat(_valuesOf);
    });
    return {
        specicalCharacter: Object.assign({}, keys, values),
        all: all
    };
}

function load(xhr, uri, metadata, callback) {
    if (xhr.readyState !== 4) {
        xhr.abort();
    }
    var request = new Request(uri, { method: 'GET' });
    xhr.onload = function () {
        var status = xhr.status === 1223 ? 204 : xhr.status;
        if (status < 100 || status > 599) {
            callback({ xhr: xhr, status: status });
            return;
        }
        var options = { status: status, statusText: xhr.statusText, headers: headers(xhr), url: responseURL(xhr) };
        var body = 'response' in xhr ? xhr.response : xhr.responseText;
        new Response(body, options).json().then(function (data) {
            callback(null, data);
        }).catch(function (e) {
            callback(e, null);
        });
    };
    xhr.onerror = function (e) {
        callback({ xhr: xhr, status: xhr.status });
    };
    xhr.open(request.method, request.url, true);

    if (request.credentials === 'include') xhr.withCredentials = true;
    if ('responseType' in xhr && typeof Request.prototype.blob === 'function') {
        xhr.responseType = 'blob';
    }
    request.headers.forEach(function (value, name) {
        xhr.setRequestHeader(name, value);
    });
    xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
}
export function ServiceWorker() {
    this.xhr = getXhr();
    this.dataSpecialCharacter = null;
    this.onmessage = () => { }
    var self = this;
    this.postMessage = async ({ instanceId, metadata }) => {
        var special = metadata.special;
        if (special) {
            var character = special.character;
            if (!self.dataSpecialCharacter) {
                load(self.xhr, special.uri, metadata, function (error, data) {
                    self.dataSpecialCharacter = analysisData(data.without_land);
                    var lookupDatas = special.isFull ? self.dataSpecialCharacter.all : self.dataSpecialCharacter.specicalCharacter[character];
                    self.onmessage({ data: { instanceId: instanceId, payload: { lookupDatas: [lookupDatas], metadata: metadata } } });
                });
            } else {
                var lookupDatas = special.isFull ? self.dataSpecialCharacter.all : self.dataSpecialCharacter.specicalCharacter[character];
                self.onmessage({ data: { instanceId: instanceId, payload: { lookupDatas: [lookupDatas], metadata: metadata } } });
            }
        } else {
            var lookupConfig = metadata.lookupConfig;
            if (lookupConfig.argument_details) {
                var data = lookupConfig.argument_details.map(function (item) {
                    return {
                        data_value: item.value
                    }
                })
                var lookupDatas = [data]; //eslint-disable-line
                self.onmessage({ data: { instanceId: instanceId, payload: { lookupDatas: lookupDatas, metadata: metadata } } });
            } else {
                var uri = lookupConfig.lookupUrl + "/" + metadata.params;
                load(self.xhr, uri, metadata, function (error, data) {
                    if (!error) {
                        var lookupDatas;
                        if (Array.isArray(data.json_single)) {
                            if (lookupConfig.allow_multiple && Array.isArray(data.json_multi) && data.json_multi.length > 0) {
                                lookupDatas = [data.json_single, data.json_multi];
                            } else {
                                lookupDatas = [data.json_single];
                            }
                        }
                        self.onmessage({ data: { instanceId: instanceId, payload: { lookupDatas: lookupDatas, metadata: metadata } } });
                    } else {
                        self.onmessage({ data: { instanceId: instanceId, payload: { error: error, metadata: metadata } } });
                    }
                });
            }
        }
    }
    return this;
}



