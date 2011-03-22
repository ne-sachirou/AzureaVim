var API_PROKY_SERVER = 'http://localhost:10080/';

function ApiProxy(mountpoint) { // @param String:
                                // @return ApiProxy Object:
    if (!(this instanceof ApiProxy)) {
        return new ApiProxy(mountpoint);
    }
    
    this.uri = API_PROKY_SERVER + uri;
    return this;
};
ApiProxy.prototype = {
    submit: function(filename,  // @param String='':
                     callback,  // @param Function: 
                     data)    { // @param Hash: 
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
        if (/\/$/.test(baseuri) && filename.charAt(0) === '/') {
            uri = baseuri.substring(1) + filename;
        } else if (!(/\/$/.test(baseuri)) && filename.charAt(0) !== '/') {
            uri = baseuri + '/' + filename;
        } else {
            uri = baseuri + filename;
        }
        
        if (callback && data) {
            Http.postRequestAsync(uri, poststring, false, callback);
        } else if (callback) {
            Http.sendRequestAsync(uri, false, callback);
        } else if (data){
            result = Http.sendRequest(uri, false);
        } else {
            result = Http.postRequest(uri, poststring, false);
        }
        return result;
    }
};

AzureaUtil.ApiProxy = ApiProxy;