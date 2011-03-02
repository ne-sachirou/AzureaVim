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

function _expandTemplate(template, // String: template
                         view) {   // Object: view
                                   // Hash: {text: expanded string,
                                   //        cursor: number of cursor plase}
    var cursor,
        text = template.replace(/#{([^}]+?)}/g, function(m, figure) {
        with (view) {
            return eval(figure);
        }
    });
    
    text = text.split('#{}');
    if (text.length === 1) {
        cursor = 0;
        text = text[0];
    } else {
        cursor = text[0].length;
        text = text.join('');
    }
    return {
        'text': text,
        'cursor': cursor
    };
}


AzureaVim.prototype.reply = function() {
    var c1 = {
        template: 'template',
        all: 'all',
        quote: 'quote',
        qt: 'quote',
        mrt: 'mrt',
        masirosiki: 'mrt'
    },
        t;
    
    switch (c1[this.command[1]]) {
    case 'template':
        t = _expandTemplate(this.command[2], this);
        Http.sendRequestAsync('http://google.com/', false,
                              new Function("TextArea.text = '" + t.text.replace("'", "\\'") + "';" +
            "TextArea.in_reply_to_status_id = '" + (this.command[3] === 'true' ? this.status_id : 0) + "';" +
            "TextArea.show();" +
            "TextArea.setFocus();" +
            "TextArea.setCursor(" + t.cursor + ");"));
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

})();