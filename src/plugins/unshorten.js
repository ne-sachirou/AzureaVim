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
};

function _isPossibleUnshorten(url) { // @param String: shortend URL
                                    // @return Boolean:
    var services = azvm_unshorten_services,
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
    
    if (_isPossibleUnshorten(url)) {
        if (cashe[url]) {
            result = cashe[url];
        } else if (async) {
            try {
                Http.sendRequestAsync('http://untiny.me/api/1.0/extract/?url=' + url + '&format=text', false,
                                      function(response) {
                    AzureaVim.prototype.unshorten.cashe[url] = /^error/.test(response.body) ? url : response.body;
                });
            } catch (e) {}
        } else {
            try {
                response = Http.sendRequest('http://untiny.me/api/1.0/extract/?url=' + url + '&format=text', false);
                result = /^error/.test(response.body) ? url : response.body;
                cashe[url] = result;
            } catch (e) {}
        }
    }
    return result;
}


function azvm_unshorten() { // @return String: unshortened URL
    var url = this.status_urls[this.command[1] || 0],
        unurl = _unshorten(url);
    
    System.inputBox(url, unurl, false);
    return unurl;
}


AzureaUtil.event.addEventListener('PreProcessTimelineStatus', function(status) { // @param Status Object:
    status.text = status.text.replace(/https?:\/\/[0-9A-Za-z._\-^~\/&%?]+/g,
                                      function(url) {
        return _unshorten(url, true);
    });
});
AzureaVim.prototype.unshorten = azvm_unshorten;
AzureaVim.prototype.unshorten.services = azvm_unshorten_services;
AzureaVim.prototype.unshorten.cashe = azvm_unshorten_cashe;
AzureaVim.prototype.unshorten.unshoeten = _unshorten;
try {
    Http.sendRequestAsync('http://untiny.me/api/1.0/services/?format=text', true,
                          function(response) { // @param HttpResponce Object:
        AzureaVim.prototype.unshorten.services = response.body.split(', ');
    });
} catch (e) {}

})();