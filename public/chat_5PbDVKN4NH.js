! function () {
    function e(e, t, o, n) {
        function a(t) {
            if ("[object Object]" === Object.prototype.toString.call(e.wix_context) && "[object Object]" === Object.prototype.toString.call(e.jivo_wix) && Object.assign(t, e.jivo_wix), e.jivo_config = O = t, g()) throw new Error("Placing widget is forbidden on " + e.top.location.host);
            return H && O.disable_mobile ? void (console.log && console.log("Jivo: disable mobile widget")) : (i(), void u())
        }

        function i() {
            V.src = "javascript:false", V.title = "", V.role = "presentation", V.setAttribute("name", "jivo_container"), V.setAttribute("id", "jivo_container"), V.setAttribute("frameborder", "no"), W.className += "jivo-no-transition", "undefined" == typeof SVGRect && (W.className += " no-svg"), (V.frameElement || V).style.cssText = "width:100%;height:100%;border:0", e.jivo_init = function () {
                G = 0, P = !1;
                var o = t.createEvent("Event");
                o.initEvent("jBeforeunload", !0, !0), e.dispatchEvent(o), r()
            }, e.atob && "complete" !== t.readyState ? l(e, "load", r) : r(), l(e, "message", function (o) {
                if (!o) return void (console && console.log && console.log("Error receive postMessage, window message event is empty."));
                var n, a, i = o.data;
                if ("in_node_webkit" == i.name && (n || (n = o.source, a = o.origin), n && a)) {
                    e.jivo_cobrowse = {
                        source: n,
                        origin: a
                    };
                    var r = "jv_" + encodeURIComponent("langpack") + "_" + O.widget_id + "=" + encodeURIComponent(JSON.stringify(i.langpack));
                    O.cookie_domain && (r += "; domain=" + O.cookie_domain), r += "; path=/", t.cookie = r, n.postMessage({
                        name: "widget_ready"
                    }, a)
                }
                "iframe_url_changed" != i.name && "iframe_url_changed" != i || s()
            }, !1)
        }

        function r() {
            var e = t.getElementsByTagName("head")[0],
                o = t.createElement("script"),
                n = O.bundle_folder ? O.bundle_folder : "",
                a = v() + n + "/js/bundle_" + O.locale + ".js?rand=" + O.build_number;
            F = F || (new Date).getTime(), o.type = "text/javascript", o.async = !0, o.charset = "UTF-8", o.className = "js-jivo-bundle", o.src = a, L.bundleSrc = a, e.appendChild(o), o.onerror = function () {
                m("error")
            }, _()
        }

        function c() {
            D = t.body.lastChild, W.style && (W.style.opacity = "0", W.style.visibility = "hidden"), W.setAttribute("id", "jivo-iframe-container"), W.appendChild(V), D ? D.parentNode.insertBefore(W, D.nextSibling) : t.body.appendChild(W), s()
        }

        function s() {
            if (!(G++ > 3)) {
                if (!R) return G-- , r();
                try {
                    A = V.contentWindow.document
                } catch (e) {
                    U = t.domain, V.src = "javascript:var d=document.open();d.domain='" + U + "';void(0);", A = V.contentWindow.document
                }
                A.write('<!doctype HTML><head><meta name="google" content="notranslate"><meta http-equiv="X-UA-Compatible" content="IE=edge" /><script type="text/javascript">' + R + '</script></head><body class="notranslate"><div id="widget"></div><div id="player"></div></body>'), A.close()
            }
        }

        function l(t, o, n) {
            t.addEventListener ? t.addEventListener(o, n, !1) : t.attachEvent && (t.attachEvent("on" + o, function (t) {
                return function () {
                    n.call(t, e.event)
                }
            }(t)), t = null)
        }

        function d() {
            if (L.hasStorage) var e = parseInt(localStorage.getItem("jv_store_cdn_resolve_time"), 10);
            return e && e >= (new Date).getTime() || L.cdnUnavailableState
        }

        function v() {
            return O.static_host && !d() ? "//" + O.static_host : O.base_url
        }

        function g() {
            return O.host_blacklist !== n && O.host_blacklist.indexOf(e.location.host) >= 0
        }

        function u() {
            O.cp_tracker_id && O.cp_tracker_url && (e._cp = {
                trackerId: O.cp_tracker_id
            }, w(O.cp_tracker_url))
        }

        function m(e) {
            clearTimeout(M), ++Z >= z || P || (L.hasStorage && (localStorage.setItem("jv_store_cdn_resolve_time", ((new Date).getTime() + X).toString()), localStorage.setItem("jv_store_cdn_unavailable", e)), L.cdnUnavailableState = !0, r())
        }

        function _() {
            d() || (M = setTimeout(function () {
                !P && m("timeout")
            }, J))
        }

        function p(e) {
            if (!P) {
                clearTimeout(M), P = !0, R = e;
                var t = (new Date).getTime() - F;
                L.hasStorage && t > 6e3 && localStorage.setItem("jv_store_cdn_load_time", t), c()
            }
        }

        function f(e) {
            e.globalStore = L, h()
        }

        function h() {
            R = null;
            for (var e = t.getElementsByTagName("head")[0], o = e.getElementsByClassName("js-jivo-bundle"), n = 0; n < o.length; n++) o[n].parentNode && (o[n].parentNode.removeChild(o[n]), o[n] = null);
            o = null
        }

        function w(e, o) {
            var n = o || t,
                a = n.getElementsByTagName("script"),
                i = a[0],
                r = n.createElement("script");
            T(r), i.parentNode.insertBefore(r, i).src = e
        }

        function j(e) {
            var t;
            return t = e.responseType && "text" !== e.responseType ? "document" === e.responseType ? e.responseXML : e.response : e.responseText
        }

        function b() {
            L.hasStorage && localStorage.setItem("jv_deleted_" + I + "_resolve_time", ((new Date).getTime() + q).toString()), S()
        }

        function y() {
            var e = !1;
            if (L.hasStorage) {
                var t = localStorage.getItem("jv_deleted_" + I + "_resolve_time");
                t && parseInt(t) >= (new Date).getTime() && (e = !0, S())
            }
            return e
        }

        function S() {
            var e = "This widget is permanently removed";
            console.error ? console.error(e) : console.log ? console.log(e) : void 0
        }

        function E(e) {
            if (!y()) {
                var o = new XMLHttpRequest;
                o.onreadystatechange = function () {
                    if (4 == o.readyState && 200 == o.status) {
                        var e = t.getElementsByTagName("script"),
                            n = e[0],
                            a = t.createElement("script");
                        T(a), n.parentNode.insertBefore(a, n).innerHTML = j(o)
                    }
                }, o.open("GET", e + "?rnd=" + Math.random(), !0), o.send(null)
            }
        }

        function T(e) {
            return e.type = "text/javascript", e.async = !0, e.charset = "UTF-8", e
        }
        if ("undefined" == typeof e.jivo_magic_var) {
            e.jivo_magic_var = !0;
            var I, k, L = {
                hasStorage: e.__hasStorage,
                cdnUnavailableState: !1,
                jivoLoaderVersion: o,
                loadScript: w
            };
            try {
                throw new Error("Get script URL")
            } catch (e) {
                for (var N = e.stack.split("\n"), x = N.length, B = 0; B < x; B++)
                    if (!I) {
                        var C = N[B].match(/https?:\/\/(\S+)\/script\/widget\/([A-Za-z0-9]+)/);
                        C && C.length > 1 && (k = C[1], I = C[2])
                    }
            }
            if (!I || !k) throw new Error("Failed to evaluate the widgetId or configHost");
            var O, U, A, D, M, P, R, F, H = /iPhone|iPad|iPod|Android|Windows Phone/i.test(navigator.userAgent),
                V = t.createElement("iframe"),
                W = t.createElement("div"),
                G = 0,
                J = 1e4,
                X = 12e4,
                q = 6048e5,
                z = 3,
                Z = 0;
            e.__jivoConfigOnLoad = a, e.__jivoBundleOnLoad = p, e.__jivoBundleInit = f, E("//" + k + "/script/widget/config/" + I), e.__jivoCacheDeletedWidget = b
        }
    }
    var t = .1;
    window.__hasStorage = !1;
    try {
        localStorage.setItem("testLocalStorage", "ok"), localStorage.removeItem("testLocalStorage"), window.__hasStorage = !0
    } catch (e) { }
    var o = e,
        n = null;
    if (window.__hasStorage) {
        try {
            n = JSON.parse(localStorage.getItem("__jivoLoader"))
        } catch (e) { }
        n && n.version >= t && (o = new Function("window", "document", "jivoLoaderVersion", "(" + n.code + ")(window, document, jivoLoaderVersion)"))
    }
    o(window, document, t)
}(window, document);