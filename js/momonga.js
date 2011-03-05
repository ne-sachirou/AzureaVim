// https://gist.github.com/841702
AzureaUtil = {
    mixin: {},
    event: {},
    time: {}
};

(function() {

function mixin(hash1,       // @param Hash:
               hash2,       // @param Hash:
               overwrite) { // @param Boolean=true:
    var key;
    
    if (overwrite == null) { // null or undefined
        overwrite = true;
    }
    for (key in hash2) {
        if (overwrite || typeof hash1[key] === 'undefined') {
            hash1[key] = hash2[key];
        }
    }
}
AzureaUtil.mixin = mixin;


var events_list = {
    PreProcessTimelineStatuses: [],
    PreProcessTimelineStatus: [],
    PreFilterProcessTimelineStatus: [],
    PostFilterProcessTimelineStatus: [],
    PostProcessTimelineStatus: [],
    PostProcessTimelineStatuses: [],
    PreSendUpdateStatus: [],
    PostSendUpdateStatus: [],
    ReceiveFavorite: []
};

function addEventListener(eventname, // @param String:
                          fun) {     // @param Function:
    var listener = events_list[eventname],
        i = -1;
    
    while (listener[++i]) {
        if (listener[i] === fun) {
            listener.splice(i, 1);
        }
    }
    listener.push(fun);
}


function removeEventListener(eventname, // @param String:
                             fun) {     // @param Function:
    var listener = events_list[eventname],
        i = -1;
    
    while (listener[++i]) {
        if (listener[i] === fun) {
            listener.splice(i, 1);
            break;
        }
    }
}


mixin(AzureaUtil.event, {
    'PreProcessTimelineStatuses': events_list.PreProcessTimelineStatuses,
    'PreProcessTimelineStatus': events_list.PreProcessTimelineStatus,
    'PreFilterProcessTimelineStatus': events_list.PreFilterProcessTimelineStatus,
    'PostFilterProcessTimelineStatus': events_list.PostFilterProcessTimelineStatus,
    'PostProcessTimelineStatus': events_list.PostProcessTimelineStatus,
    'PostProcessTimelineStatuses': events_list.PostProcessTimelineStatuses,
    'PreSendUpdateStatus': events_list.PreSendUpdateStatus,
    'PostSendUpdateStatus': events_list.PostSendUpdateStatus,
    'ReceiveFavorite': events_list.ReceiveFavorite,
    'addEventListener': addEventListener,
    'removeEventListener': removeEventListener
});


var timeout_list = {},// {id: [time, fun]}
    interval_list = {};// {id: [time, fun, interval]}
//    timeevent_list = (function() {
//    var timeevent_list,
//        timeEvent;
//    
//    for () {
//        timeEvent = System.settings.getValue('user.AzureaUtil', 'TimeEvent' + i);
//        timeevent_list[]
//    }
//    return timeevent_list;
//})();


function attainSchedule() {
    var now = new Date().getTime(),
        id;
    
    for (id in timeout_list) {
        if (timeout_list[id][0] <= now) {
            timeout_list[id][1]();
            delete timeout_list[id];
        }
    }
    for (id in interval_list) {
        if (interval_list[id][0] <= now) {
            interval_list[id][0] += interval_list[id][2];
            interval_list[id][1]();
        }
    }
    //for (id in timeevent_list) {
    //    if (timeevent_list[id][0] <= now) {
    //        timeevent_list[id][1]();
    //        delete timeevent_list[id];
    //        System.settings.getValue('user.AzureaUtil', 'TimeEvent' + i);
    //    }
    //    
    //}
}


addEventListener('PreProcessTimelineStatus', attainSchedule);
addEventListener('PostSendUpdateStatus', attainSchedule);
addEventListener('ReceiveFavorite', attainSchedule);


function setTimeout(fun,  // @param Function:
                    ms) { // @param Number:
                          // @return Strings:
    var id = Math.floor(Math.random() * new Date().getTime()).toString(36);
    
    timeout_list[id] = [new Date().getTime() + ms, fun];
    return id;
}


function clearTimeout(id) { // @param Strings:
    delete timeout_list[id];
}


function setInterval(fun,  // @param Function:
                     ms) { // @param Number:
                           // @return Strings:
    var id = Math.floor(Math.random() * new Date().getTime()).toString(36);
    
    timeinterval_list[id] = [new Date().getTime() + ms, fun, ms];
    return id;
}


function clearInterval(id) { // @param Strings:
    delete timeinterval_list[id];
}


//function setTimeevent(fun,  // @param Function:
//                      ms) { // @param Number:
//                            // @return Strings:
//    
//}
//
//
//function clearTimeevent() {}


mixin(AzureaUtil.time, {
    'setTimeout': setTimeout,
    'clearTimeout': clearTimeout,
    'setInterval': setInterval,
    'clearInterval': clearInterval
});

})();


//function PreProcessTimelineStatuses() {}
function PreProcessTimelineStatus(status) {
    var listener = AzureaUtil.event.PreProcessTimelineStatus,
        i = -1;
    
    while (listener[++i]) {
        listener[i](status);
    }
}
function PreFilterProcessTimelineStatus(status) {
    var listener = AzureaUtil.event.PreFilterProcessTimelineStatus,
        i = -1, r, flag = false;
    
    while (listener[++i]) {
        r = listener[i](status);
        flag = flag || r;
    }
    return flag;
}
//function PostFilterProcessTimelineStatus() {}
//function PostProcessTimelineStatus() {}
//function PostProcessTimelineStatuses() {}
function PreSendUpdateStatus(status) {
    var listener = AzureaUtil.event.PreSendUpdateStatus,
        i = -1, r, flag = false;
    
    while (listener[++i]) {
        r = listener[i](status);
        flag = flag || r;
    }
    return flag;
}
function PostSendUpdateStatus() {
    var listener = AzureaUtil.event.PostSendUpdateStatus,
        i = -1;
    
    while (listener[++i]) {
        listener[i]();
    }
}
function ReceiveFavorite(source,
                         target,
                         target_object) {
    var listener = AzureaUtil.event.ReceiveFavorite,
        i = -1;
    
    while (listener[++i]) {
        listener[i](source, target, target_object);
    }
}
//https://gist.github.com/833567
AzureaVim = {};

(function() {

var azvm_commands_list = {};

function _focusInput(status_id) { // @param String: status id
    TextArea.text = ':';
    TextArea.in_reply_to_status_id = status_id;
    TextArea.show();
    TextArea.setFocus();
    TextArea.setCursor(1);
}


function _pearse(text) { // @reply String: command text
                        // @return Array:
    var command = [], match, regex = /[^\s"]+|\s+|"[^\\"]*(?:\\.[^\\"]*)*"/g; //"
    
    text = text.replace(/^\s+|\s+$/g, '');
    while (match = regex.exec(text)) {
        if (!/^\s/.test(match[0])) {
            command.push(match[0].replace(/^"|"$/g, ''));
        }
    }
    return command;
}


//AzureaVim Class
function azvm_AzureaVim(status) { //@param StatusUpdate Object:
    var TwitterService_status = TwitterService.status,
        status_id = status.in_reply_to_status_id,
        status_obj = TwitterService_status.get(status_id);
    
    this.command_text = status.text.slice(1);
    this.command = _pearse(this.command_text);
    this.status_id = status_id;
    this.screen_name = status_obj.user.screen_name;
    this.status_text = status_obj.text;
    this.status_urls = [];
    this.status_hashes = [];
    this.status_users = [];
    TwitterService_status.getUrls(status_id, this.status_urls);
    TwitterService_status.getHashes(status_id, this.status_hashes);
    TwitterService_status.getUsers(status_id, this.status_users);
}


function azvm_run() {
    var _my_command = this.command,
        command = azvm_commands_list[this.command[0]];
    
    if (command) {
        if (command.indexOf(' ') !== -1) {
            _my_command.shift();
            _my_command = this.command = command.split(' ').concat(_my_command);
            command = _my_command[0];
        }
        this[command]();
    } else {
        System.showNotice(':' + _my_command[0] + ' command is undefined.');
    }
}


System.addKeyBindingHandler(0xBA, // VK_OEM_1 (:)
                            0, _focusInput);
System.addContextMenuHandler(':vim', 0, _focusInput);
AzureaUtil.event.addEventListener('PreSendUpdateStatus', function(status) { // @param StatusUpdate Object:
    var azvm, do_notpost = false;
    
    try {
        if (/^(?::|：)/.test(status.text)) {
            do_notpost = true;
            azvm = new azvm_AzureaVim(status);
            TextArea.text = '';
            TextArea.in_reply_to_status_id = 0;
            azvm.run();
        }
    } catch (e) {
        System.alert(e.name + ':\n' + e.message);
        do_notpost = true;
    }
    return do_notpost;
});
AzureaVim = azvm_AzureaVim;
AzureaVim.commands_list = azvm_commands_list;
AzureaVim.prototype = {
    run: azvm_run
};

})();
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
AzureaVim.prototype.unshorten.services = [];//azvm_unshorten_services;
AzureaVim.prototype.unshorten.cashe = azvm_unshorten_cashe;
AzureaVim.prototype.unshorten.unshorten = _unshorten;
try {
    Http.sendRequestAsync('http://untiny.me/api/1.0/services/?format=text', true,
                          function(response) { // @param HttpResponce Object:
        AzureaVim.prototype.unshorten.services = response.body.split(', ');
    });
} catch (e) {}

})();
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
        _unshorten = this.unshorten ?
                     this.unshorten.unshorten :
                     function(url, async) {return url;};
    
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
AzureaUtil.mixin(AzureaVim.commands_list, {
    retweet: 'retweet',
    rt: 'retweet',
    'ｒｔ': 'retweet'
});
// :retweet
// 指定statusをRetweetします。


AzureaVim.prototype.retweet = function() {
    TwitterService.retweet.create(this.status_id);
}
AzureaUtil.mixin(AzureaVim.commands_list, {
    settings: 'settings',
    setting: 'settings',
    'set': 'settings',
    'せｔ': 'settings',
    'get': 'settings',
    'げｔ': 'settings'
});
// :settings option1
// optinon1は、設定式です。
// 設定式は、
//     「iniセクション名::キー=値」
// 或いは
//     「iniセクション名::キー」
// の形を取ります。
// ex. :settings Misc :: FontSize
//     :settings Misc::EnableAutoRefresh=1
//
// :get option1
// option1は、設定式です。
// 設定式の「=値」は無視します。

AzureaVim.prototype.settings = function() {
    var figure, value;
    
    figure = this.command.slice(1).join('');
    figure = figure.split('::');
    figure = [figure[0]].concat(figure[1].split('='));
    if (/^(?:get|げｔ)/.test(this.command[0])) {
        figure.length = 2;
    }
    if (figure[2]) {
        System.settings.setValue(figure[0], figure[1], figure[2]);
        System.showNotice('Setting done: ' + figure[0] + '::' + figure[1] + '=' + figure[2]);
    } else {
        System.showNotice('Getting done: ' + figure[0] + '::' + figure[1] + '=' + System.settings.getValue(figure[0], figure[1]));
    }
    //System.settings.reconfigure();
}
AzureaUtil.mixin(AzureaVim.commands_list, {
    shindan: 'shindanmaker',
    'しんだｎ': 'shindanmaker'
});
// :shindan [option1]
// 該当statusが含む診断メーカーに問い合わせ、結果をTextAreaに記入します。
// option1は、診断する物の名前です。
// option1を省略した場合、自分のscreen nameで診断します。


// https://gist.github.com/831901
AzureaVim.prototype.shindanmaker = function() {
    var url, i = -1,
        _unshorten = this.unshorten ? this.unshorten.unshorten : function(url) {return url;};
    
    while (url = _unshorten(this.status_urls[++i], true)) {
        if (url.match('^http://shindanmaker.com/[0-9]+')) {
            break;
        }
    }
    if (url) {
        Http.postRequestAsync(url,
                              "u=" + encodeURI(this.command[1] || TwitterService.currentUser().screen_name),
                              false,
                              function(response) {
            response.body.match('<textarea.*?>(.*?)</textarea>');
            TextArea.text = RegExp.$1;
            TextArea.in_reply_to_status_id = 0;
            TextArea.show();
            TextArea.setFocus();
        });
    }
}
AzureaUtil.mixin(AzureaVim.commands_list, {
    translate: 'translate',
    ja: 'translate ja',
    'じゃ': 'translate ja'
});
// :translate [option1]
// Google翻訳APIで指定statusを翻訳します。
// option1は、翻訳先言語です。ISOの言語コードを指定します。
// option1がを省略した場合、jaへ翻訳します。

AzureaVim.prototype.translate = function() {
    if (!this.command[1]) {
        this.command[1] = 'ja';
    }
    Http.sendRequestAsync('https://www.googleapis.com/language/translate/v2?key=' +
                                     'AIzaSyCva1yUIFIBRqXOZDJ0nrbGbm0bz3FIksc' +
                                     '&q=' +
                                     encodeURI(this.status_text) +
                                     '&target=' + this.command[1],
                                     false,
                                     function(response) { // @param HttpResponce Object:
        if (response.statusCode !== 200) {
            throw Error('Google Translate API Error. statusCode is ' + response.statusCode + '.');
        }
        System.showMessage(response.body.match(/"translatedText"\s*:\s*"(.*)"/)[1],
                           response.body.match(/"detectedSourceLanguage"\s*:\s*"(.*)"/)[1] + '-> ',// + this.command[1],
                           0);
    });
}
AzureaUtil.mixin(AzureaVim.commands_list, {
    view: 'view',
    v: 'view',
    home: 'view home',
    'ほめ': 'view home',
    user: 'view user',
    'うせｒ': 'view user'
});
// :view option1 [option2]
// Azurea内のviewを移動します。
// option1は、移動先viewです。
// option1にuser, search, matchを指定した場合、option2を取ります。
// :v userで、option2を省略した場合は、指定statusから補完します。


AzureaVim.prototype.view = function() {
    var c1 = {
        home: 'home',
        timeline: 'home',
        h: 'home',
        
        mention: 'mention',
        reply: 'mention',
        r: 'mention',
        m: 'mention',
        '@': 'mention',
        
        message: 'message',
        dm: 'message',
        d: 'message',
        
        user: 'user',
        u: 'user',
        
        search: 'search',
        
        favorite: 'favorite',
        fav: 'favorite',
        f: 'favorite',
        
        match: 'match',
        
        following: 'following',
        follow: 'following',
        
        followers: 'followers',
        follower: 'followers',
        followed: 'followers'
    },
        views = System.apiLevel >= 11 ? System.views : System;
    
    switch (c1[this.command[1]]) {
    case 'home':
        views.openTimeline();
        break;
    case 'mention':
        views.openMention();
        break;
    case 'message':
        views.openMessage();
        break;
    case 'user':
        views.openUserTimeline(this.command[2] || this.screen_name, false);
        break;
    case 'search':
        views.openSearch(this.command[2], false);
        break;
    case 'favorite':
        views.openFavorite();
        break;
    case 'match':
        views.openMatch(this.command[2], false);
        break;
    case 'following':
        views.openFollwoing();
        break;
    case 'followers':
        views.openFollowers();
        break;
    default:
        break;
    }
}
