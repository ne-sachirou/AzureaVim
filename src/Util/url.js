var _url_unshroten_unityme_services = [],
    _url_unshorten_cache = {};


function _url_unshorten_unityme_services_init(response) { // @param HttpResponce Object:
    _url_unshorten_unityme_services = response.body.split(', ');
}
Http.sendRequestAsync('http://untiny.me/api/1.0/services/?format=text',
                      false,
                      _url_unshorten_unityme_services_init);


function _url_unshorten_clear_cache() {
    var url,
        cache = _url_unshorten_cache,
        timelimit = Date.now() - 3600000;

    for (url in cache) {
        if (cache.hasOwnProperty(url)) {
            if (cache[url][1] < timelimit) {
                delete cache[url];
            }
        }
    }
    System.setTimeout(_url_unshorten_clear_cache, 1800000);
}
System.setTimeout(_url_unshorten_clear_cache, 1800000);


function _url_unshorten_unityme_is_possible(url) { // @param String: shortened URL
                                                   // @return Boolean:
    var services = _url_unshroten_unityme_services,
        i = services.length;

    while (i--) {
        if (url.indexOf(services[i]) !== -1) {
            return true;
        }
    }
    return false;
}


function _url_unshorten_unityme(url) { // @param String:
    function callback(response) { // @param HttpResponse Object:
        _url_unshorten_cache[url] = [/^error/.test(response.body) ? url : response.body, Date.now()];
    }

    try {
       Http.sendRequestAsync('http://untiny.me/api/1.0/extract/?url=' + url + '&format=text',
                             false,
                             callback); 
    } catch (err) {
    }
}


function _url_unshorten_htnto(url) { // @param String:
    function callback(response) { // @param HttpResponse Object:
        response = response.header.match(/Location: ([^\n]+)\n/);
        _url_unshorten_cache[url] = [response ? response[1] : url, Date.now()];
    }

    try {
        Http.sendRequestAsync(url, false, callback);
    } catch (err) {
    }
}


function url_unshorten(url) { // @param String: shortened URL
                              // @return String: unshortened URL
    if (_url_unshorten_cache[url]) {
        return _url_unshorten_cache[url][0];
    }
    if (_url_unshorten_unityme_is_possible(url)) {
        _url_unshorten_unityme(url);
    } else if (url.indexOf('htn.to') !== -1) {
        _url_unshorten_htnto(url);
    }
    return url;
}


Util.url = {
    unshorten: url_unshorten
};
