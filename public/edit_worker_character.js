var specicalCharacter;
var all = [];
function analysisData(datas) {
    var keys = {};
    var values = {};
    datas.forEach(function (data) {
        values[data.value] = values[data.value] || [data.field];
        keys[data.field] = keys[data.field] || [];
        keys[data.field].push(data.value)
    })
    Object.keys(values).forEach(function (valueKey) {
        all.push(valueKey);
        let _value = values[valueKey]; //like ['a']
        let _keyOfValue = _value[0]; // like 'a';
        let _valuesOf = keys[_keyOfValue].filter(_val => _val !== valueKey);// like [a,a,a,a];
        values[valueKey] = _value.concat(_valuesOf);
    })
    specicalCharacter = Object.assign({}, keys, values)
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
function load(uri, callback) {
    var xhr = getXhr();
    xhr.onload = function () {
        var status = (xhr.status === 1223) ? 204 : xhr.status;
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
    }
    xhr.onerror = function (e) {
        callback({ xhr: xhr, status: xhr.status });
    }
    xhr.open('GET', uri, true);
    xhr.send(null);
}
this.onmessage = function (e) {
    var uri = e.data.uri;
    var name =e.data.name;
    var metadata = e.data.metadata;
    var character = metadata.character;
    var isAll = metadata.isAll;
    if (!specicalCharacter) {
        load(uri, function (error, data) {
            analysisData(data.without_land);
            var lookups = isAll ? all : specicalCharacter[character];
            postMessage({name:name,payload:{ characterDatas: lookups, metadata: metadata }});
        })
    } else {
        var lookups = isAll ? all : specicalCharacter[character];
        postMessage({name:name,payload:{ characterDatas: lookups, metadata: metadata }});
    }
};