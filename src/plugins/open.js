AzureaUtil.mixin(AzureaVim.commands_list, {
    open: 'open',
    o: 'open',
    'お': 'open',
    url: 'open url',
    'うｒｌ': 'open url'
});
// :open [option1 [option2]]
// Azurea内蔵のプレビューか、webブラウザで、urlを開きます。
// option1は、開くurlの種類（url, status, favstar等）です。
// option1を省略した場合、指定statusがurlを含めば0番目を、含まなければ、指定statusを開きます。

(function() {

var unshorten = AzureaVim.prototype.unshorten ?
                AzureaVim.prototype.unshorten.unshorten :
                function(url, async) {return url;};


function open(url) { // @param String: URI
    var previewurl;
    
    url = unshorten(url, true);
    previewurl = System.getPreviewUrl(url);
    if (previewurl) {
        System.showPreview(url, previewurl);
    } else {
        System.openUrl(url);
    }
}


function azvm_open() {
    var url;
    
    switch (azvm_open.c1[this.command[1]]) {
    case 'status':
        url = 'https://twitter.com/' + this.screen_name + '/status/' + this.status_id;
        break;
    case 'favstar':
        url = 'http://favstar.fm/t/' + this.status_id;
        break;
    case 'favotter':
        url = 'http://favotter.net/status.php?id=' + this.status_id;
        break;
    case 'favlook':
        url = 'http://favlook.osa-p.net/status.html?status_id=' + this.status_id;
        break;
    case 'twistar':
        url = 'http://twistar.cc/' + this.screen_name + '/status/' + this.status_id;
        break;
    case 'favolog':
        url = 'http://favolog.org/' + (this.command[2] || this.screen_name);
        break;
    case 'twilog':
        url = 'http://twilog.org/' + (this.command[2] || this.screen_name);
        break;
    case 'user':
        url = 'http://twitter.com/' + (this.command[2] || this.screen_name);
        break;
    case 'url':
        if (!this.command[2]) {
            this.command[2] = 0;
        }
        url = this.status_urls[this.command[2]];
        break;
    default:
        if (this.status_urls[0]) {
            url = this.status_urls[0];
        } else {
            url = 'https://twitter.com/' + this.screen_name + '/status/' + this.status_id;
        }
        break;
    }
    open(url);
};
azvm_open.c1 = {
    status: 'status',
    favstar: 'favstar',
    fav: 'favstar',
    f: 'favstar',
    favotter: 'favotter',
    favlook: 'favlook',
    twistar: 'twistar',
    favolog: 'favolog',
    twilog: 'twilog',
    user: 'user',
    u: 'user',
    url: 'url'
};

AzureaVim.prototype.open = azvm_open;

// https://gist.github.com/802965
System.addKeyBindingHandler(0xBE, // .
                            0,
                            function(status_id) {
    TwitterService.status.update(':o', status_id);
});

})();