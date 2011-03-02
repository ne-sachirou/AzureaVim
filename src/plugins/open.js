AzureaUtil.mixin(AzureaVim.commands_list, {
    open: 'open',
    o: 'open',
    'お': 'open',
    url: 'open url',
    'うｒｌ': 'open url'
});
// :open [option1 [option2]]
// webブラウザでurlを開きます。
// option1は、開くurlの種類（url, status, favstar等）です。
// option1を省略した場合、指定statusがurlを含めば0番目を、含まなければ、指定statusを開きます。


AzureaVim.prototype.open = function() {
    var url,
        c1 = {
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
        url: 'url'
    },
        _unshorten = this.unshorten ? this.unshorten.unshorten : function(url) {return url;};
    
    switch (c1[this.command[1]]) {
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
        url = _unshorten(this.status_urls[this.command[2]], true);
        break;
    default:
        if (this.status_urls[0]) {
            url = _unshorten(this.status_urls[0], true);
        } else {
            url = 'https://twitter.com/' + this.screen_name + '/status/' + this.status_id;
        }
        break;
    }
    System.openUrl(url);
}