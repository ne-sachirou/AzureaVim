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

var azvm_unshorten_services = [],
    azvm_unshorten_cashe = {
    'http://c4se.tk/': 'http://c4se.sakura.ne.jp/'
},
    azvm_postly_cashe = {
};


function resits_services(response) { // @param HttpResponce Object:
    azvm_unshorten_services = response.body.split(', ');
    azvm_unshorten_services.push('htn.to');
}
try {
    Http.sendRequestAsync('http://untiny.me/api/1.0/services/?format=text', true, resits_services);
} catch (err) {
}


function _isPossibleUnshorten(url) { // @param String: shortend URL
                                     // @return Boolean:
    var services = azvm_unshorten_services,
        i = services.length, is_possible = false;
    
    while (i--) {
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
    var cashe = azvm_unshorten_cashe, result = url;
    
    function callback_htnto(response) { // @param HttpResponce Object:
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
    } else if (url.indexOf('htn.to') !== -1) {
        if (async) {
            try {
                Http.sendRequestAsync(url, false, callback_htnto);
            } catch (err0) {
            }
        } else {
            try {
                result = callback_htly(Http.sendRequest(url, false));
            } catch (err1) {
            }
        }
    } else if (_isPossibleUnshorten(url)) {
        if (async) {
            try {
                Http.sendRequestAsync('http://untiny.me/api/1.0/extract/?url=' + url + '&format=text', false, callback);
            } catch (err2) {
            }
        } else {
            try {
                result = callback(Http.sendRequest('http://untiny.me/api/1.0/extract/?url=' + url + '&format=text', false));
            } catch (err3) {
            }
        }
    }
    return result;
}


function expand_postly(url,     // @param String: post.ly url
                       async) { // @param Boolean=false:
                                // @return String: post.ly text
    var cashe = azvm_postly_cashe,
        id = url.match(/^https?:\/\/post\.ly\/(.+)$/)[1],
        result = url;
    
    function callback(response) { // @param HttpResponce Object:
                                  // @return String:
        var text = response.body.match(/<body>([\s\S]*?)<\/body>/m)[1],
            _m;
        
        if (_m = text.match(/<!\[CDATA\[([\s\S]*?)\]\]>/m)) {
            text = _m[1].replace(/<\/(?:p|div|blockquote)>/g, '\n').replace(/<[\s\S]+?>/mg, '');
        }
        text += '\n' + url;
        cashe[id] = text;
        return text;
    }
    
    if (cashe[id]) {
        result = cashe[id];
    } else if (async) {
        try {
            Http.sendRequestAsync('http://posterous.com/api/getpost?id=' + id, false, callback);
        } catch (err0) {
        }
    } else {
        try {
            result = callback(Http.sendRequest('http://posterous.com/api/getpost?id=' + id, false));
        } catch (err1) {
        }
    }
    return result;
}


function azvm_unshorten() { // @return String: unshortened URL
    var url = this.status_urls[this.command[1] || 0],
        text;
    
    if (url.indexOf('post.ly') !== -1) {
        text = this.status_text.replace(url, expand_postly(url, false));
    } else {
        text = this.status_text.replace(url, _unshorten(url, false));
    }
    this.item.text = text;
}


TwitterService.addEventListener('preProcessTimelineStatus', function(status) { // @param Status Object:
    status.text = status.text.replace(/https?:\/\/[0-9A-Za-z._\-^~\/&%?]+/g,
                                      function(url) {
        var expanded;
        
        if (url.indexOf('post.ly') !== -1) {
            expanded = expand_postly(url, true);
        } else {
            expanded = _unshorten(url, true);
        }
        return expanded;
    });
});
AzureaVim.prototype.unshorten = azvm_unshorten;
AzureaVim.prototype.unshorten.unshorten = _unshorten;

}());