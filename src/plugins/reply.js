AzureaUtil.mixin(AzureaVim.commands_list, {
    reply: 'reply',
    r: 'reply',
    '@': 'reply',
    quotetweet: 'reply quote',
    qt: 'reply quote',
    mrt: 'reply mrt'
});
// :reply [option1 [option2 [option3]]]
// 


(function() {

function _expandTemplate(template, // String:
                         view) {   // Object:
                                   // String: has Number [cursor] property
    var cursor,
        text = template.replace(/#{([^}]+?)}/g, function() {
        with (view) {
            return eval(arguments[1]);
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
    text.cursor = cursor;
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
            this.command = ['reply', 'template', "#{} MRT: #{'http://twitter.com/' + screen_name + '/ststus/' + status_id}", 'false'];
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