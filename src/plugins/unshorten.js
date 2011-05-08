AzureaVim.add_commands({
    u: 'unshorten',
    unshorten: 'unshorten',
    '‚¤‚ñ‚µ‚å‚’‚Ä‚Ž': 'unshorten'
});


(function() {

var _unshorten_url = Util.url.unshorten,
    _postly_cache = {};


function _clear_cache() {
    var url,
        cache = _postly_cache,
        timelimit = Date.now() - 3600000;

    for (url in cache) {
        if (cache.hasOwnProperty(url)) {
            if (cache[url][1] < timelimit) {
                delete cache[url];
            }
        }
    }
    System.setTimeout(_clear_cache, 1800000);
}
System.setTimeout(_clear_cache, 1800000);


function _expand_postly(url) { // @param String: post.ly url
                               // @return String: post.ly text
    var id = url.match(/^https?:\/\/post\.ly\/(.+)$/)[1],
        result = url;
    
    function callback(response) { // @param HttpResponce Object:
        var text = response.body.match(/<body>([\s\S]*?)<\/body>/m)[1],
            match;
        
        if (match = text.match(/<!\[CDATA\[([\s\S]*?)\]\]>/m)) {
            text = match[1].replace(/<\/(?:p|div|blockquote)>/g, '\n').replace(/<[\s\S]+?>/mg, '');
        }
        text += '\n' + url;
        _postly_cache[id] = [text, Date.now()];
    }
    
    if (_postly_cache[id]) {
        return _postly_cache[id][0];
    }
    try {
        Http.sendRequestAsync('http://posterous.com/api/getpost?id=' + id, false, callback);
    } catch (err) {
    }
    return url;
}


AzureaVim.prototype.unshorten = function(option,  // @param Array:
                                         input) { // @hidden Object:
                                                  // @return String:
    var url = this.target_status_urls[option[0] || 0],
        text;

    if (url.indexOf('post.ly') !== -1) {
        text = this.target_status_text.replace(url, _expand_postly(url));
    } else {
        text = this.target_status_text.replace(url, _unshorten_url(url));
    }System.showNotice(text);
    this.target_item.text = text;
};


TwitterService.addEventListener('preProcessTimelineStatus', function(status) { // @param Status Object
    status.text = status.text.replace(/https?:\/\/[0-9A-Za-z._\-\^~\/&%?]+/g,
                                      function(url) {
        var expanded;
        
        if (url.indexOf('post.ly') !== -1) {
            expanded = _expand_postly(url);
        } else {
            expanded = _unshorten_url(url);
        }
        return expanded;
    });
});

}());
