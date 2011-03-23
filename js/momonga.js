// https://gist.github.com/841702
AzureaUtil = {
    mixin: {},
    ApiProxy: {},
    db: {},
    event: {},
    time: {},
    template: {},
    yank: {},
    notify: {}
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
var API_PROKY_SERVER = 'http://localhost:10080/';

function ApiProxy(mountpoint) { // @param String='':
                                // @return ApiProxy Object:
    if (!(this instanceof ApiProxy)) {
        return new ApiProxy(mountpoint);
    }
    
    mountpoint = mountpoint || '';
    this.uri = API_PROKY_SERVER + mountpoint;
    return this;
};
ApiProxy.prototype = {
    submit: function(filename,   // @param String='':
                     data,       // @param Hash:
                     callback) { // @param Function:
        var result,
            baseuri = this.uri, uri,
            poststring = [], key;
        
        for (key in data) {
            if (data[key]) {
                poststring.push(key + '=' + data[key]);
            }
        }
        poststring = encodeURI(poststring.join('&'));
        
        filename = filename || '';
        if (filename) {
            if (/\/$/.test(baseuri) && filename.charAt(0) === '/') {
                uri = baseuri.substring(1) + filename;
            } else if (!(/\/$/.test(baseuri)) && filename.charAt(0) !== '/') {
                uri = baseuri + '/' + filename;
            } else {
                uri = baseuri + filename;
            }
        } else {
            uri = baseuri;
        }
        
        if (callback && data) {
            Http.postRequestAsync(uri, poststring, false, callback);
        } else if (callback) {
            Http.sendRequestAsync(uri, false, callback);
        } else if (data){
            result = Http.postRequest(uri, poststring, false);
        } else {
            result = Http.sendRequest(uri, false);
        }
        return result;
    }
};

AzureaUtil.ApiProxy = ApiProxy;
var db_cashe = {};

function setDbKey(key,     // @param String:
                  value) { // @param String='':
    System.settings.setValue('user.AzureaVim', key, encodeURIComponent(value));
    db_cashe[key] = value;
}


function getDbKey(key) { // @param String:
                         // @return String:
    if (!db_cashe[key]) {
        db_cashe[key] = decodeURIComponent(System.settings.getValue('user.AzureaVim', key));
    }
    return db_cashe[key];
}


function deleteDbKey(key) { // @param String:
    System.settings.setValue('user.AzureaVim', key, '');
    delete db_cashe[key];
}


function dbKeys(regex) { // @param RegExp|String='':
                         // @return Array[String]:
    var key, keys = [];
    
    if (typeof regex === 'string' || regex instanceof String) {
        regex = RegExp(regex);
    }
    for (key in db_cashe) {
        if (match.test(key)) {
            keys.push(key);
        }
    }
    return keys;
}


mixin(AzureaUtil.db, {
    'get': getDbKey,
    'set': setDbKey,
    'del': deleteDbKey,
    'keys': dbKeys
});
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
    timeevent_list = (function() { // {id: [time, fun, i]}
    var timeevent_list = {},
        timeevent, i = -1;
    
    while (timeevent = getDbKey('TimeEvent' + (++i))) {
        timeevent_list[timeevent.substring(0, timeevent.indexOf(':'))] = [
            timeevent.substring(timeevent.indexOf(':') + 1, timeevent.indexOf('|')) - 0,
            eval('(function(){return ' + timeevent.substring(timeevent.indexOf('|') + 1) + '})()'),
            i
        ];
    }
    return timeevent_list;
})();


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
            interval_list[id][0] = now + interval_list[id][2];
            interval_list[id][1]();
        }
    }
    for (id in timeevent_list) {
        if (timeevent_list[id][0] <= now) {
            timeevent_list[id][1]();
            deleteDbKey('TimeEvent' + timeevent_list[id][2]);
            delete timeevent_list[id];
        }
    }
}


addEventListener('PreProcessTimelineStatus', attainSchedule);
addEventListener('PostSendUpdateStatus', attainSchedule);
addEventListener('ReceiveFavorite', attainSchedule);
//attainSchedule();


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


function setTimeevent(fun,  // @param String: Function = eval(String)
                      ms) { // @param Number: Date().getTime()
                            // @return Strings:
    var id = Math.floor(Math.random() * new Date().getTime()).toString(36),
        i = -1;
    
    while (getDbKey('TimeEvent' + (++i))) {
    }
    setDbKey('TimeEvent' + i, id + ':' + ms + '|' + fun);
    timeevent_list[id] = [ms, eval('(function(){return ' + fun + '})()'), i];
    return id;
}


function clearTimeevent(id) { // @param Strings:
    deleteDbKey('TimeEvent' + timeevent_list[id][2]);
    delete timeevent_list[id];
}


mixin(AzureaUtil.time, {
    'setTimeout': setTimeout,
    'clearTimeout': clearTimeout,
    'setInterval': setInterval,
    'clearInterval': clearInterval,
    'setTimeevent': setTimeevent,
    'clearTimeevent': clearTimeevent
});
function expandTemplate(template, // @param String: template
                        view) {   // @param Object: view
                                  // @return Hash: {text: expanded String,
                                  //                cursor: Number of cursor plase}
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


mixin(AzureaUtil.template, {
    'expand': expandTemplate
});
function getYank(name) { // @param String='':
                         // @return String:
    if (name) {
        name = name.charAt(0);
        if (/[0-9A-Za-z]/.test(name)) {
            name = '';
        }
    } else {
        name = '';
    }
    return getDbKey('Yank' + name);
}


function setYank(name,   // @param String='':
                 text) { // @param String:
                         // @return String:
    if (name) {
        name = name.charAt(0);
        if (/[0-9A-Za-z]/.test(name)) {
            name = '';
        }
    } else {
        name = '';
    }
    setDbKey('Yank' + name, text);
    return text;
}


mixin(AzureaUtil.yank, {
    'get': getYank,
    'set': setYank
});
var NOTIFY_USE_GROWL = false,//(System.systemInfo <= 2),
    notify_proxy = new ApiProxy('gntp');

function notifyNative(text) { // @param String:
    System.isActive ? System.showNotice(text) :
                      System.showMessage(text, text, 0x100000);
}


function notifyGrowl(title,        // @param String:
                     text,         // @param Strong:
                     screen_name,  // @param String:
                     sticky)     { // @param Boolean=false:
    notify_proxy.submit(null, {
        "title": title,
        "text": text,
        "twitter_screen_name": screen_name,
        "sticky": sticky ? 'on' : null
    },
                        function(response) {
        var re = eval(response.body);
        
        if (re.error) {
            notifyNative(re.request.text);
        }
    });
}


function notify(text,         // @param String:
                title,        // @param String:
                screen_name,  // @param String:
                sticky)     { // @param Boolean=false:
    try {
        if (NOTIFY_USE_GROWL) {
            notifyGrowl(title, text, screen_name, sticky);
        } else {
            notifyNative(text);
        }
    } catch (err) {
        notifyNative(text);
    }
}


AzureaUtil.notify = notify;
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
    AzureaUtil.yank.set(null, TextArea.text);
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
System.addContextMenuHandler(':vim', 0, function() {
    var command_text = System.inputBox('command', '', true), azvm;
    
    AzureaUtil.yank.set(null, command_text);
    azvm = new azvm_AzureaVim({
        text: ':' + command_text,
        in_reply_to_status_id: System.views.selectedStatusId
    });
    azvm.run();
});
AzureaUtil.event.addEventListener('PreSendUpdateStatus', function(status) { // @param StatusUpdate Object:
    var azvm, do_notpost = false;
    
    try {
        if (status.text === ':') {
            do_notpost = true;
            AzureaUtil.time.setTimeout(function() {
                TextArea.text = AzureaUtil.yank.get(null);
                TextArea.show();
            }, 0);
            //status.text = '';
            //TextArea.text = AzureaUtil.yank.get(null);
        }else if (/^(?::|：)/.test(status.text)) {
            do_notpost = true;
            AzureaUtil.yank.set(null, status.text);
            azvm = new azvm_AzureaVim(status);
            TextArea.text = '';
            TextArea.in_reply_to_status_id = 0;
            azvm.run();
        } else {
            AzureaUtil.yank.set(null, status.text);
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
        t = AzureaUtil.template.expand(this.command[2], this);
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
    TextArea.setCursor(status_user_screen_name.length + 2);
}
System.addKeyBindingHandler(0x52, // VK_R
                            0,
                            reply);

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
AzureaUtil.mixin(AzureaVim.commands_list, {
    earthquake: 'earthquake',
    jisin: 'earthquake',
    'えあｒｔｈくあけ': 'earthquake',
    'じしｎ': 'earthquake'
});
// :earthquake [set [option2]]
// チャーハン諸島風地震なう機能です。Ctrl+↓で、設定した文を、時刻付きでpostします。
// option1にsetを入れた場合、option2に投稿文を設定します。
// option2を省略した場合、inputBoxで、現在の設定投稿文を元に編集出来ます。


(function() {

if (!AzureaUtil.db.get('EarthquakeMessage')) {
    AzureaUtil.db.set('EarthquakeMessage', '地震なう #{Date()}');
}


function _getMessage(view) { // @param Hash:
                             // @return String:
    var result = AzureaUtil.db.get('EarthquakeMessage');
    
    if (view != null) { // not null or undefined
        result = AzureaUtil.template.expand(result, view).text;
    }
    return result;
}


function _setMessage(text) { // @param String:
                             // @return String:
    text = text || AzureaUtil.db.get('EarthquakeMessage');
    AzureaUtil.db.set('EarthquakeMessage', text);
    return text;
}


function setEarthquakeMessage() { // @return String:
    var text = System.inputBox('地震なう投稿文', _getMessage(), false);
    
    _setMessage(text);
    return text;
}


AzureaVim.prototype.earthquake = function() { // @return String:
    var result, geo;
    
    switch (this.command[1]) {
    case 'set':
        if (this.command[2]) {
            result = _setMessage(this.command[2]);
        } else {
            result = setEarthquakeMessage();
        }
        break;
    default:
        //if (GeoLocation.enabled) {
        //    geo = GeoLocation.current();
        //    this.geo = {
        //        lat: geo.latitude,
        //        lon: geo.longitude
        //    };
        //}
        TwitterService.status.update(_getMessage(this), 0);
        break;
    }
    return result;
}


System.addKeyBindingHandler(0x28, // VK_DOWN ↓
                            2, // Ctrl
                            function() {
    TwitterService.status.update(':earthquake', 0);
});

})();
AzureaUtil.mixin(AzureaVim.commands_list, {
    delay: 'delay',
    'でぁｙ': 'delay'
});
// :delay option1 option2
// 指定時間後にstatus updateします。
// option1はポストする時間です。
//   ^(?:(?:(\d{4})-)?(\d{1,2})-(\d{1,2}) )?(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?$
// 形式を記述した場合、setTimeeventを使い、指定時後にポストします。
// setTimeeventは、Azureaのセッションを越えて設定を保存、実行します（再起動しても有効です）。
// 其れ以外の記述であった場合、単一の数値と見做して、setTimeoutで指定時間経過後にpostします。
// option1が空白を含む場合、ダブルクオーテーションで囲って下さい。
// option2は、ポストする文です。空白を含められます。
// AzureaVimの仕様上、option2が:から始まる場合、AzureaVimのコマンドとして、該当コマンドが実行されます。
// 遅延投稿時のin_reply_to_status_idは、:delay実行時の物を使用します。

(function() {

if (AzureaUtil.db.get('DelayUseTwitDelay')) {
    AzureaUtil.db.set('DelayUseTwitDelay', '0');
}

function postTwitDelay(text,       // @param String:
                       time,       // @param String: RFC2822
                       callback) { // @param Function:
    Http.postRequestAsync('http://twitdelay.appspot.com/api/post',
                          'user_id=' + TwitterService.currentUser.id +
                          '&api_key=' + AzureaUtil.db.get('DelayTwitDelayApiKey') +
                          '&status=' + text +
                          '&at=' + time,
                          false,
                          callback);
}


AzureaVim.prototype.delay = function() {
    var regex_date = /^(?:(?:(\d{4})-)?(\d{1,2})-(\d{1,2}) )?(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?$/,
        m1, d, type;
    
    if (m1 = this.command[1].match(regex_date)) {
        var d = new Date();
        m1[1] && d.setFullYear(m1[1]);
        m1[2] && d.setMonth(m1[2] - 1);
        m1[3] && d.setDate(m1[3]);
        d.setHours(m1[4]);
        d.setMinutes(m1[5]);
        d.setSeconds(0);
        m1[6] && d.setSeconds(m1[6]);
        this.command[1] = d.getTime();
        type = 2;
        this.command[2] = this.command.slice(2).join(' ');
    } else {
        this.command[1] = new Date().getTime() + (this.command[1] - 0);
        type = 1;
        this.command[2] = this.command.slice(2).join(' ');
    }
    if (AzureaUtil.db.get('DelayUseTwitDelay')) {
        d = new Date(this.command[1]);
        postTwitDelay(this.command[2],
                      d.getUTCDate() + ' ' + d.getUTCMonth() + ' ' + d.getUTCFullYear() + ' ' + d.getUTCHours() + ':' + d.getUTCMinutes() + ':' + d.getUTCSeconds() + ' +0000',
                      function() {});
    } else {
        if (type === 1) {
            AzureaUtil.time.setTimeout((function(obj) {
                return function() {
                    TwitterService.status.update(obj.command[2], obj.status_id);
                }
            })(this),
                                       this.command[1] - new Date().getTime());
        } else {
            AzureaUtil.time.setTimeevent('function() {TwitterService.status.update("' + this.command[2] + '", "' + this.status_id + '");}',
                                         this.command[1]);
        }
    }
}

})();
AzureaUtil.mixin(AzureaVim.codelist, {
});
//


System.addKeyBindingHandler(0x43, // VK_C
                            2, // Ctrl
                            function(status_id) { // @param String:
    var text = TwitterService.status.get(status_id).text;
    
    System.clipboard = text;
    AzureaUtil.yank.set(null, text);
});
AzureaUtil.mixin(AzureaVim.commands_list, {
    eval: '_evaluate'
});
// :eval code
// 任意のAzureaScriptを実行し、返値をinputBoxで表示します。
// AzureaVimのグローバルスコープで実行されます。
// codeは空白を含められます。連続した空白は、一つの半角空白に置き換えられます。
// 自由に空白を含めたい場合は、ダブルクオーテーションでcode全体を囲って下さい。
// コマンドパーサーの制限として、ダブルクオーテーションで囲わないcodeの中では、
// ダブルクオーテーションを使用出来ません。（囲ったcode中では、エスケープして使
// 用出来ます。）


AzureaVim.prototype._evaluate = function() {
    this.command[1] = this.command.slice(1).join(' ');
    System.inputBox(this.command[1], eval(this.command[1]), false);
}
