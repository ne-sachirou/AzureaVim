AzureaUtil.mixin(AzureaVim.commands_list, {
    unshorten: 'unshorten',
    'うんしょｒてｎ': 'unshorten'
});
// :unshorten [option1]
// untiny.meのAPIを使用して、短縮urlを伸展します。inputBox中に伸展urlを表示します。
// 受信tweetが含む短縮urlは、事前に非同期で伸展urlを取得し、キャッシュしています（UIをblockしません）。
// 二度目以降の受信時には、初めから、伸展したurlをstatusに表示します。
// option1は、指定tweetが含むurlの番号（0から始まる自然数）です。
// option1を省略した場合、0を使用します。

// https://gist.github.com/835563
(function() {

var azvm_services,
    azvm_unshorten_cashe = {
    'http://c4se.tk/': 'http://c4se.sakura.ne.jp/'
},
    azvm_postly_cashe = {
};


function resits_services(response) { // @param HttpResponce Object:
    azvm_services = response.body.split(', ');
    azvm_services.push('htn.ly');
}
try {
    Http.sendRequestAsync('http://untiny.me/api/1.0/services/?format=text', true, resits_services);
} catch (err) {
}


function _isPossibleUnshorten(url) { // @param String: shortend URL
                                     // @return Boolean:
    var services = azvm_services,
        i = -1, is_possible = false;
    
    while (services[++i]) {
        if (url.indexOf(services[i]) !== -1) {
            is_possible = true;
            break;
        }
    }
    return is_possible;
}


function _unshorten(url,     // @param String: shortened URL
                    async) { // @param Boolean=false:
                             // @return String: unshortened URL
    var cashe = azvm_unshorten_cashe,
        response, result = url;
    
    function callback_htly(response) { // @param HttpResponce Object:
                                       // @return String:
        var result;
        
        response = response.header.match(/Location: ([^\n]+)\n/);
        cashe = response ? response[1] : url;
        result = response ? response[1] : url;
        cashe[url] = result;
        return result;
    }
    
    function callback(response) { // @param HttpResponce Object:
                                  // @return String:
        var result;
        
        result = /^error/.test(response.body) ? url : response.body;
        cashe[url] = result;
        return result;
    }
    
    if (cashe[url]) {
        result = cashe[url];
    } else if (url.indexOf('htn.ly') !== -1) {
        if (async) {
            try {
                Http.sendRequestAsync(url, false, callback_htly);
            } catch (err) {
            }
        } else {
            try {
                result = callback_htly(Http.sendRequest(url, false));
            } catch (err) {
            }
        }
    } else if (_isPossibleUnshorten(url)) {
        if (async) {
            try {
                Http.sendRequestAsync('http://untiny.me/api/1.0/extract/?url=' + url + '&format=text', false, callback);
            } catch (err) {
            }
        } else {
            try {
                result = callback(Http.sendRequest('http://untiny.me/api/1.0/extract/?url=' + url + '&format=text', false));
            } catch (err) {
            }
        }
    }
    return result;
}


function expand_postly(url,     // @param String: post.ly url
                       async) { // @param Boolean=false:
                                // @return String: post.ly text
    var cashe = azvm_postly_cashe,
        id = url.match(/^https?:\/\post\.ly\/(.+)$/)[1],
        result = url;
    
    function callback(response) { // @param HttpResponce Object:
                                  // @return String:
        var text = response.body.match(/<body>(.*?)</body>/)[1],
            _m;
        
        if (_m = text.match(/<!\[CDATA\[(.*?)]]>/)) {
            text = _m[1].replace(/<\/p|div|blockquote>/, '\n')
                        .replace(/<.+?>/, '');
        }
        text += '\n' + url;
        cashe[id] = text;
        return text;
    }
    
    if (cashe[id]) {
        return cashe[id];
    } else if (async) {
        try {
            Http.sendRequestAsync('http://posterous.com/api/getpost?id=' + id, false, callback);
        } catch (err) {
        }
    } else {
        try {
            result =  callback(Http.sendRequest('http://posterous.com/api/getpost?id=' + id, false));
        } catch (err) {
        }
    }
    return result;
}


function azvm_unshorten() { // @return String: unshortened URL
    var url = this.status_urls[this.command[1] || 0],
        text;
    
    if (url.indexOf('post.ly') !== -1) {
        text = expand_postly(url);
    } else {
        text = _unshorten(url);
    }
    this.item.text = text;
}


AzureaUtil.event.addEventListener('PreProcessTimelineStatus', function(status) { // @param Status Object:
    status.text = status.text.replace(/https?:\/\/[0-9A-Za-z._\-^~\/&%?]+/g,
                                      function(url) {
        if (url.indexOf('post.ly') !== -1) {
            return expand_postly(url, true);
        } else {
            return _unshorten(url, true);
        }
    });
});
AzureaVim.prototype.unshorten = azvm_unshorten;
AzureaVim.prototype.unshorten.unshorten = _unshorten;

})();