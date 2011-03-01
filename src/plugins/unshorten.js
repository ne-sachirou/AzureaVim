AzureaUtil.mixin(AzureaVim.commands_list, {
    unshorten: 'unshorten'
});
// :unshorten option1
//

// https://gist.github.com/835563
(function() {

AzureaVim.prototype.unshorten = function() { // @return String: unshortened URL
    var url = this.status_urls[this.command[1] || 0],
        unurl = unshorten(url);
    
    System.inputBox(url, unurl, false);
    return unurl;
}


AzureaVim.prototype.unshorten.services = [];
AzureaVim.prototype.unshorten.cashe = {
    'http://c4se.tk/': 'http://c4se.sakura.ne.jp/'
};

try {
    Http.sendRequestAsync('http://untiny.me/api/1.0/services/?format=text', true,
                          function(response) { // @param HttpResponce Object:
        AzureaVim.prototype.unshorten.services = response.body.split(', ');
    });
} catch (e) {}


function isPossibleUnshorten(url) { // @param String: shortend URL
                                    // @return Boolean:
    var services = AzureaVim.prototype.unshorten.services,
        i = -1, is_possible = false;
    
    while (services[++i]) {
        if (url.indexOf(services[i]) !== -1) {
            is_possible = true;
            break;
        }
    }
    return is_possible;
}


function unshorten(url,     // @param String: shortened URL
                   async) { // @param Boolean=false:
                            // @return String: unshortened URL
    var cashe = AzureaVim.prototype.unshorten.cashe,
        response, result = url;
    
    if (isPossibleUnshorten(url)) {
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
AzureaVim.prototype.unshorten.unshorten = unshorten;


AzureaUtil.event.addEventListener('PreProcessTimelineStatus', function(status) { // @param Status Object:
    status.text = status.text.replace(/https?:\/\/[0-9A-Za-z._\-^~\/&%?]+/g,
                                      function(url) {
        return unshorten(url, true);
    });
});

})();