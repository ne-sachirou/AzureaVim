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

function azvm_reply() {
    var has_in_reply_to = this.command[3] === 'true',
        in_reply_to_status_id = this.status_id,
        expanded_template;
    
    function callback(response) {
        TextArea.text = expanded_template.text;
        TextArea.in_reply_to_status_id = (has_in_reply_to === true ? in_reply_to_status_id : 0);
        TextArea.show();
        TextArea.setFocus();
        TextArea.cursor = expanded_template.cursor;
    }
    
    if (this.command[1] === 'template') {
        expanded_template = AzureaUtil.template.expand(this.command[2], this);
        Http.sendRequestAsync('http://google.com/', false, callback);
        //System.setTimeout(callback, 10);
    } else {
        redirect = this.reply.templates[this.reply.c1[this.command[1]]] ||
                   ["@#{screen_name} #{}#{status_hashes.length ? ' ' + status_hashes.join(' ') : ''}", true];
        if (typeof redirect === 'function') {
            redirect = redirect.call(this);
        }
        this.command = ['reply', 'template', redirect[0], redirect[1] ? 'true' : 'false'];
        this.reply();
    }
}

azvm_reply.c1 = {
    template: 'template',
    all: 'all',
    quote: 'quote',
    qt: 'quote',
    mrt: 'mrt',
    masirosiki: 'mrt'
};

azvm_reply.templates = {
    all: ["@#{screen_name + (status_users.length ? ' @' +status_users.join(' @') : '')} #{}", true],
    quote: ["@#{screen_name} #{} RT: #{status_text}", true],
    mrt: function() {
        var redirect;
        
        if (this.command[2] === 'f' || this.command[2] === 'fav' || this.command[2] === 'favstar') {
            redirect = ['reply', 'template', "#{} MRT: #{'http://favstar.fm/t/' + status_id}", 'false'];
        } else {
            redirect = ['reply', 'template', "#{} MRT: #{'http://twitter.com/' + screen_name + '/status/' + status_id}", 'false'];
        }
        return redirect;
    }
};

AzureaVim.prototype.reply = azvm_reply;


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