AzureaUtil.mixin(AzureaVim.commands_list, {
    open: 'open',
    o: 'open',
    url: 'open url'
});
// :open [option1 [option2]]
//


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
    };
    
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
        url = this.status_urls[this.command[2]];
        break;
    default:
        url = this.status_urls[0] || 'https://twitter.com/' + this.screen_name + '/status/' + this.status_id;
        break;
    }
    System.openUrl(url);
}