function responseURL(xhr) {
    if ('responseURL' in xhr) {
        return xhr.responseURL
    }
    if (/^X-Request-URL:/m.test(xhr.getAllResponseHeaders())) {
        return xhr.getResponseHeader('X-Request-URL')
    }
    return;
}
function headers(xhr) {
    var head = new Headers()
    var pairs = xhr.getAllResponseHeaders().trim().split('\n')
    pairs.forEach(function (header) {
        var split = header.trim().split(':')
        var key = split.shift().trim()
        var value = split.join(':').trim()
        head.append(key, value)
    })
    return head
}

function getXhr() {
    if (typeof XMLHttpRequest !== 'undefined') return new XMLHttpRequest()
    var versions = [
        "MSXML2.XmlHttp.7v.0",
        "MSXML2.XmlHttp.6.0",
        "MSXML2.XmlHttp.5.0",
        "MSXML2.XmlHttp.4.0",
        "MSXML2.XmlHttp.3.0",
        "MSXML2.XmlHttp.2.0",
        "Microsoft.XmlHttp"]
    for (var i = 0, len = versions.length; i < len; i++) {
        try {
            return new ActiveXObject(versions[i]);
        }
        catch (e) { }
    }
}

var xhr;
function load(uri, options, callback) {
    xhr = xhr || getXhr();
    if (xhr.readyState !== 4) {
        xhr.abort();
    }
    var request = new Request(uri, options);

    xhr.onload = function () {
        var status = (xhr.status === 1223) ? 204 : xhr.status
        if (status < 100 || status > 599) {
            callback({ xhr: xhr, status: status })
            return;
        }
        var options = { status: status, statusText: xhr.statusText, headers: headers(xhr), url: responseURL(xhr) }
        var body = 'response' in xhr ? xhr.response : xhr.responseText;
        new Response(body, options).json().then((data) => {
            callback(null, data);
        }).catch(e => {
            callback(e, null);
        });
    };
    xhr.onerror = function (e) {
        callback({ xhr: xhr, status: xhr.status });
    }
    xhr.open(request.method, request.url, true)

    if (request.credentials === 'include') xhr.withCredentials = true
    if ('responseType' in xhr && typeof Request.prototype.blob === 'function') {
        xhr.responseType = 'blob'
    }
    request.headers.forEach(function (value, name) {
        xhr.setRequestHeader(name, value)
    })
    xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
}


var dataSpecialCharacter;
var with_land = [];
function analysisData(datas) {
    var keys = {};
    var values = {};
    datas.forEach(function (data) {
        values[data.value] = values[data.value] || [data.field];
        keys[data.field] = keys[data.field] || [];
        keys[data.field].push(data.value)
    })
    var all = []
    Object.keys(values).forEach(function (valueKey) {
        all.push(valueKey);
        let _value = values[valueKey]; //like ['a']
        let _keyOfValue = _value[0]; // like 'a';
        let _valuesOf = keys[_keyOfValue].filter(_val => _val !== valueKey);// like [a,a,a,a];
        values[valueKey] = _value.concat(_valuesOf);
    })
    return {
        specicalCharacter: Object.assign({}, keys, values),
        all: all
    };
}

function send(instanceId, lookupDatas, metadata){
    postMessage(JSON.parse(JSON.stringify({ instanceId: instanceId, payload: { lookupDatas: lookupDatas, metadata: metadata } })));
}

function getSpecial(special, instanceId, metadata) {
    if(special.isFull){
        send(instanceId,[dataSpecialCharacter.all],metadata)
    }else if(special.land&&special.land.length>0&&!special.land.includes('All')) {
        var lookupDatas = with_land.filter(function(item){
            return special.character===item.field&&special.land.includes(item.land);
        }).map(function(item){
            return item.value
        }) 
        send(instanceId,[lookupDatas],metadata)
    }else{
        var lookupDatas = dataSpecialCharacter.specicalCharacter[special.character];
        send(instanceId,[lookupDatas],metadata)
    }
}
this.onmessage = function (e) {
    var instanceId = e.data.instanceId;
    var metadata = e.data.metadata;
    var special = metadata.special;
    if (special) {
        if (!dataSpecialCharacter) {
            load(special.uri, metadata, function (error, data) {
                with_land = data.with_land;
                dataSpecialCharacter = analysisData(data.without_land);
                getSpecial(special, instanceId, metadata)
            })
        } else {
            getSpecial(special, instanceId, metadata)
        }
    } else {
        var lookupConfig = metadata.lookupConfig;
        if (lookupConfig.argument_details) {
            var data = lookupConfig.argument_details.map(function (item) {
                return {
                    data_value: item.value
                }
            })
            var lookupDatas = [data];
            send(instanceId,lookupDatas,metadata);
        } else {
            var uri = lookupConfig.lookupUrl + "/" + metadata.params;
            load(uri, e.data.metadata, function (error, data) {
                if (!error) {
                    var lookupDatas;
                    if (Array.isArray(data.json_single)) {
                        if (lookupConfig.allow_multiple && Array.isArray(data.json_multi) && data.json_multi.length > 0) {
                            lookupDatas = [data.json_single, data.json_multi];
                        } else {
                            lookupDatas = [data.json_single];
                        }
                    }
                    send(instanceId,lookupDatas,metadata)
                } else {
                    postMessage(JSON.parse(JSON.stringify({ instanceId: instanceId, payload: { error: error, metadata: metadata } })));
                }

            })
        }

    }
};
