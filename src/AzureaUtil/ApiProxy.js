var API_PROKY_SERVER = 'http://localhost:80/',
    apiproxy_events_list = {
    ready: []
};

function ApiProxy(mountpoint) { // @param String='':
                                // @return ApiProxy Object:
    if (!(this instanceof ApiProxy)) {
        return new ApiProxy(mountpoint);
    }
    
    mountpoint = mountpoint || '';
    this.uri = API_PROKY_SERVER + mountpoint;
    return this;
}
ApiProxy.prototype = {
    submit: function(filename,   // @param String='':
                     data,       // @param Hash:
                     callback) { // @param Function:
        var result,
            baseuri = this.uri, uri,
            poststring = [], key;
        
        for (key in data) {
            if (data.hasOwnProperty(key) && data[key]) {
                poststring.push(key + '=' + data[key]);
            }
        }
        poststring = encodeURI(poststring.join('&'));
        
        filename = filename || '';
        if (filename) {
            if (/\/$/.test(baseuri) && filename.charAt(0) === '/') {
                uri = baseuri.substring(1) + filename;
            } else if (!(/\/$/.test(baseuri)) && filename.charAt(0) !== '/') {
                uri = baseuri + '/' + filename;
            } else {
                uri = baseuri + filename;
            }
        } else {
            uri = baseuri;
        }
        
        if (callback && data) {
            Http.postRequestAsync(uri, poststring, false, callback);
        } else if (callback) {
            Http.sendRequestAsync(uri, false, callback);
        } else if (data){
            result = Http.postRequest(uri, poststring, false);
        } else {
            result = Http.sendRequest(uri, false);
        }
        return result;
    }
};


function apiProxy_addEventListener(eventname,  // @param String: ready
                                   callback) { // @param Function:
    var events_list = apiproxy_events_list[eventname],
        i = events_list.length;
    
    if (events_list) {
        while (i--) {
            if (events_list[i] === callback) {
                events_list.splice(i, 1);
            }
        }
        events_list.push(callback);
    }
}


function apiProxy_removeEventListener(eventname,  // @param String: ready
                                      callback) { // @param Function:
    var events_list = apiproxy_events_list[eventname],
        i = events_list.length;
    
    while (i--) {
        if (events_list[i] === callback) {
            events_list.splice(i, 1);
            break;
        }
    }
}


(function() {
    function callback(response) {
        var events_list, i;
        
        if (200 <= response.statusCode && response.statusCode < 300) {
            events_list = apiproxy_events_list.ready;
            i = events_list.length;
            while (i--) {
                events_list[i]();
            }
            apiproxy_events_list.ready = [];
        } else {
            System.setTimeout(function() {
                Http.sendRequestAsync(API_PROKY_SERVER, false, callback);
            }, 100);
        }
    }
    Http.sendRequestAsync(API_PROKY_SERVER, false, callback);
}());

AzureaUtil.ApiProxy = ApiProxy;
mixin(AzureaUtil.ApiProxy, {
    addEventListener: apiProxy_addEventListener,
    removeEventListener: apiProxy_removeEventListener
});