var API_PROKY_SERVER = 'http://localhost:10080/';

function ApiProxy(mountpoint) { // @param String='':
                                // @return ApiProxy Object:
    if (!(this instanceof ApiProxy)) {
        return new ApiProxy(mountpoint);
    }
    
    mountpoint = mountpoint || '';
    this.uri = API_PROKY_SERVER + mountpoint;
    return this;
};
ApiProxy.prototype = {
    submit: function(filename,   // @param String='':
                     data,       // @param Hash:
                     callback) { // @param Function:
        var result,
            baseuri = this.uri, uri,
            poststring = [], key;
        
        for (key in data) {
            if (data[key]) {
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

AzureaUtil.ApiProxy = ApiProxy;