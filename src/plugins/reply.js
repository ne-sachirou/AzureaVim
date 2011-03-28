AzureaUtil.mixin(AzureaVim.commands_list, {
    reply: 'reply',
    r: 'reply',
    'ｒ': 'reply',
    '@': 'reply',
    '＠': 'reply',
    quotetweet: 'reply quote',
    qt: 'reply quote',
    'ｑｔ': 'reply quote',
    mrt: 'reply mrt',
    'ｍｒｔ': 'reply mrt'
});
// :reply [option1 [option2 [option3]]]
// 指定tweetを元に、テンプレートに従ってTextAreaに記入する、QT用のコマンドです。
// 基本は、「:reply template "テンプレート" in_reply_toを付与するか否か」です。
// option1は、replyテンプレートの種類（template, all, qt, mrt等）です。
// option1を省略した場合、通常のreply（但しhashtagを引き継ぐ）テンプレートを選択します。


(function() {

AzureaVim.prototype.reply = function() {
    var c1 = {
        template: 'template',
        all: 'all',
        quote: 'quote',
        qt: 'quote',
        mrt: 'mrt',
        masirosiki: 'mrt'
    },
        has_in_reply_to = this.command[3],
        expanded_template;
    
    function callback(response) {
        TextArea.text = expanded_template.text;
        TextArea.in_reply_to_status_id = (has_in_reply_to === true ? this.status_id : 0);
        TextArea.show();
        TextArea.setFocus();
        TextArea.cursor = expanded_template.cursor;
    }
    
    switch (c1[this.command[1]]) {
    case 'template':
        expanded_template = AzureaUtil.template.expand(this.command[2], this);
        Http.sendRequestAsync('http://google.com/', false, callback);
        break;
    case 'all':
        this.command = ['reply', 'template', "@#{screen_name + (status_users.length ? ' @' +status_users.join(' @') : '')} #{}", 'true'];
        this.reply();
        break;
    case 'quote':
        this.command = ['reply', 'template', "@#{screen_name} #{} RT: #{status_text}", 'true'];
        this.reply();
        break;
    case 'mrt':
        if (this.command[2] === 'f' || this.command[2] === 'fav' || this.command[2] === 'favstar') {
            this.command = ['reply', 'template', "#{} MRT: #{'http://favstar.fm/t/' + status_id}", 'false'];
        } else {
            this.command = ['reply', 'template', "#{} MRT: #{'http://twitter.com/' + screen_name + '/status/' + status_id}", 'false'];
        }
        this.reply();
        break;
    default:
        this.command = ['reply', 'template', "@#{screen_name} #{}#{status_hashes.length ? ' ' + status_hashes.join(' ') : ''}", 'true'];
        this.reply();
        break;
    }
}


function reply(status_id) { // @param String:
                            // AzureaVim.prototype.replyと違い、同期処理で別途実装
    var status = TwitterService.status.get(status_id),
        status_user_screen_name = status.user.screen_name,
        status_hashtags = [];//status_hashtags = status.text.match(/#(?:(?:[A-Za-z0-9_]+)|(?:[^\s#]+_))/g);
    
    TwitterService.status.getHashes(status_id, status_hashtags);
    TextArea.text = '@' + status_user_screen_name + ' ' + (status_hashtags.length ? ' ' + status_hashtags.join(' ') : '');
    TextArea.in_reply_to_status_id = status_id;
    TextArea.show();
    TextArea.setFocus();
    TextArea.cursor = status_user_screen_name.length + 2;
}
System.addKeyBindingHandler(0x52, // VK_R
                            0,
                            reply);

})();