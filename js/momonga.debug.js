// @description Define ES5 extention by ES3
// @author ne_Sachirou http://c4se.sakura.ne.jp/profile/ne.html
// @date 2011
// @license Public Domain


if (!Array.isArray ) {
    Array.isArray = function(obj) { // @param Object:
                                    // @return Boolean: obj is an Array or not
        return Object.prototype.toString.call(obj) === '[object Array]';
    };
}


if (!Array.prototype.every) {
    Array.prototype.every = function(fun,   // @param Function:
                                     obj) { // @param Object: this in fun
                                            // @return Boolean:
        var i = this.length;

        while (i--) {
            if (typeof this[i] !== 'undefined' &&
                !fun.call(obj, this[i], i, this)) {
                return false;
            }
        }
        return true;
    };
}


if (!Array.prototype.filter) {
    Array.prototype.filter = function(fun,   // @param Function:
                                      obj) { // @param Object: this in fun
                                             // @return Array:
        var arr = [],
            i = 0,
            len = this.length;

        for (; i < len; ++i) {
            if (typeof this[i] !== 'undefined' &&
                fun.call(obj, this[i], i, this)) {
                arr.push(this[i]);
         }
        }
        return arr;
    };
}


if (!Array.prototype.forEach) {
    Array.prototype.forEach = function(fun,   // @param Function:
                                       obj) { // @param Object: this in fun
                                              // @return Array: this
        var i = this.length;

        while (i--) {
            if (typeof this[i] !== 'undefined') {
                fun.call(obj, this[i], i, this);
            }
        }
        return this;
    };
}


if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (val,   // @param Object:
                                        num) { // @param Number=0:
                                               // @return Number: not found = -1
        var i,
            len = this.length;

        num = num || 0;
        while (num < 0) {
            num += len - 1;
        }
        for(i = num; i < len; ++i) {
            if (this[i] === val) {
                return i;
            }
        }
        return -1;
    };
}


if (!Array.prototype.lastIndexOf) {
    Array.prototype.lastIndexOf = function(val,   // @param Object:
                                           num) { // @param Number=(this.length-1):
                                                  // @return Number: not found = -1
        var i,
            len = this.length;

        if (typeof num === 'undefined') {
            num = len - 1;
        }
        while (num < 0) {
            num += len - 1;
        }
        i = num;
        for (; i >= 0; --i) {
            if (this[i] === val) {
                return i;
            }
        }
        return -1;
    };
}


if (!Array.prototype.map) {
    Array.prototype.map = function(fun,   // @param Function:
                                   obj) { // @param Object: this in fun
                                          // @return Array:
        var i = this.length,
            arr = new Array(i);

        while (i--) {
            if (typeof this[i] !== 'undefined') {
                arr[i] = fun.call(obj, this[i], i, this);
            }
        }
        return arr;
    };
}


if (!Array.prototype.reduce) {
    Array.prototype.reduce = function(fun,   // @param Function:
                                      val) { // @param Object:
                                             // @return Object:
        var i = 0,
            len = this.length;

        if (typeof val === 'undefined') {
            val = this[0];
            i = 1;
        }
        for (; i < len; ++i) {
            if (typeof this[i] !== 'undefined') {
                val = fun.call(null, val, this[i], i, this);
            }
        }
        return val;
    };
}


if (!Array.prototype.reduceRight) {
    Array.prototype.reduceRight = function(fun,   // @param Function:
                                           val) { // @param Object:
                                                  // @return Object:
        var i = this.length;

        if (typeof val !== 'undefined') {
            val = this[i];
            --i;
        }
        while (i--) {
            if (typeof this[i] !== 'undefined') {
                val = fun.call(null, val, this[i], i, this);
            }
        }
        return val;
    };
}


if (!Array.prototype.some) {
    Array.prototype.some = function(fun,   // @param Function:
                                    obj) { // @param Object:
                                           // @return Boolean:
        var i = this.length;

        while (i--) {
            if (typeof this[i] !== 'undefined' &&
                fun.call(obj, this[i], i, this)) {
                return true;
            }
        }
        return false;
    };
}


// http://blog.stevenlevithan.com/archives/faster-trim-javascript
if (!String.prototype.trim) {
    String.prototype.trim = function() { // @return String:
        var str = this.replace(/^\s\s*/, ''),
            ws = /\s/,
            i = str.length;

        while (ws.test(str.charAt(--i))) {
        }
        return str.slice(0, i + 1);
    };
}


if (!Object.keys) {
    Object.keys = function(obj) { // @param Object:
                                  // @return Array[String]:
        var key, result = [];

        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                result.push(key);
            }
        }
        return result;
    };
}


if (!Date.now) {
    Date.now = function() {
        return new Date().getTime();
    };
}


if (!Date.prototype.toISOString) {
    Date.prototype.toISOString = function toISOString() {
        return (this.getUTCFullYear() < 1000 ?
                this.getUTCFullYear() < 100 ?
             this.getUTCFullYear() < 10 ?
                '000' :
                '00' :
                '0' :
                '') + this.getUTCFullYear() + '-' +
               (this.getUTCMonth() + 1 < 10 ? '0' : '') + (this.getUTCMonth() + 1) + '-' +
               (this.getUTCDate() < 10 ? '0' : '') + this.getUTCDate() + 'T' +
               (this.getUTCHours() < 10 ? '0' : '') + this.getUTCHours() + ':' +
               (this.getUTCMinutes() < 10 ? '0' : '') + this.getUTCMinutes() + ':' +
               (this.getUTCSeconds() < 10 ? '0' : '') + this.getUTCSeconds() + 'Z';
    };
}
Util = {};

(function() {
var _debug_LOGFILE = 'Scripts/momonga.js/log.txt',
    _debug_SCRIPTFILE = 'Scripts/momonga.debug.js',
    debug_console;


function debug_console_log(message) { // @param String:
    new ActiveXObject('Scripting.fileSystemObject').openTextFile(_debug_LOGFILE, 8, true, TristateTrue).write(message + '\n');
}


function debug_console_error(kind,      // @param String:
                             stack,     // @param Array:
                             message) { // @param String:
    debug_console_log(kind + ' Error:\n\t' + message + '\n\tfrom: ' + stack.join('/'));
}


function debug_reload_script() {
    eval(new ActiveXObject('Scripting.FileSystemObject').openTextFile(_debug_SCRIPTFILE, 1).readAll());
}
System.showNotice('Loading AzureaVim.');


System.addKeyBindingHandler(0xBA, 7, function(status_id) {debug_reload_script();});


debug_console = {
    log: debug_console_log,
    error: debug_console_error
};
Util.debug = {
    console: debug_console,
    reload_script: debug_reload_script
};
function mixin(hash1,       // @param Hash: target
	           hash2,       // @param Hash: source
	           overwrite) { // @param Boolean=true: Force overwrite or not.
    var key;
    
    if (overwrite == null) { // null or undefined
        overwrite = true;
    }
    for (key in hash2) {
	    if (hash2.hasOwnProperty(key)) {
            if (overwrite || typeof hash1[key] === 'undefined') {
                hash1[key] = hash2[key];
            }
	    }
    }
}

Util.mixin = mixin;    
var _url_unshroten_unityme_services = [],
    _url_unshorten_cache = {};


function _url_unshorten_unityme_services_init(response) { // @param HttpResponce Object:
    _url_unshorten_unityme_services = response.body.split(', ');
}
Http.sendRequestAsync('http://untiny.me/api/1.0/services/?format=text',
                      false,
                      _url_unshorten_unityme_services_init);


function _url_unshorten_clear_cache() {
    var url,
        cache = _url_unshorten_cache,
        timelimit = Date.now() - 3600000;

    for (url in cache) {
        if (cache.hasOwnProperty(url)) {
            if (cache[url][1] < timelimit) {
                delete cache[url];
            }
        }
    }
    System.setTimeout(_url_unshorten_clear_cache, 1800000);
}
System.setTimeout(_url_unshorten_clear_cache, 1800000);


function _url_unshorten_unityme_is_possible(url) { // @param String: shortened URL
                                                   // @return Boolean:
    var services = _url_unshroten_unityme_services,
        i = services.length;

    while (i--) {
        if (url.indexOf(services[i]) !== -1) {
            return true;
        }
    }
    return false;
}


function _url_unshorten_unityme(url) { // @param String:
    function callback(response) { // @param HttpResponse Object:
        _url_unshorten_cache[url] = [/^error/.test(response.body) ? url : response.body, Date.now()];
    }

    try {
       Http.sendRequestAsync('http://untiny.me/api/1.0/extract/?url=' + url + '&format=text',
                             false,
                             callback); 
    } catch (err) {
    }
}


function _url_unshorten_htnto(url) { // @param String:
    function callback(response) { // @param HttpResponse Object:
        response = response.header.match(/Location: ([^\n]+)\n/);
        _url_unshorten_cache[url] = [response ? response[1] : url, Date.now()];
    }

    try {
        Http.sendRequestAsync(url, false, callback);
    } catch (err) {
    }
}


function url_unshorten(url) { // @param String: shortened URL
                              // @return String: unshortened URL
    if (_url_unshorten_cache[url]) {
        return _url_unshorten_cache[url][0];
    }
    if (_url_unshorten_unityme_is_possible(url)) {
        _url_unshorten_unityme(url);
    } else if (url.indexOf('htn.to') !== -1) {
        _url_unshorten_htnto(url);
    }
    return url;
}


Util.url = {
    unshorten: url_unshorten
};
}());
(function(_scope) {

var _env = {},
    _commands_list = {},
    _regex_string = /"[^\\"]*(?:\\.[^\\"]*)*"/g,
    _regex_command = new RegExp('\\s*([^"\\s]+|' + _regex_string.source + ')\\s*', 'g'),
    _regex_commands = new RegExp('[^|"]+(?:' + _regex_string.source + '[^|"]+)*', 'g');


function _parse_single(text) { // @param String:
                               // @return Array:
    var command = [],
        match;

    while (match = _regex_command.exec(text)) {
        match = match[0].trim();
        if (match.charAt(0) === '"') {
            match = match.slice(1, -1);
        }
        command.push(match);
    }
    return command;
}


function _parse(text) { // @param String:
                        // @return Array:
    var commands = [],
        match;

    text = text.trim();
    while (match = _regex_commands.exec(text)) {
        commands.push(_parse_single(match[0].trim()));
    }
    return commands;
}


function AzureaVim(status) { // @param Hash: fake StatusUpdate Object
                             //   {in_reply_to_status_id: status id
                             //    text: status text}
    var TwitterService_status = TwitterService.status,
        status_id = status.in_reply_to_status_id,
        target_status = TwitterService_status.get(status_id);

    if (!this instanceof AzureaVim) {
        return new AzureaVim(status);
    }
    this.commands = _parse(status.text);
    this.target_status = target_status;
    this.target_view = _env.target_view;
    if (status_id !== '0') {
         this.target_item = this.target_view.getItemByStatusId(status_id);
    } else {
        this.target_item = null;
    }
    this.target_status_text = target_status.text;
    this.target_user = target_status.user;
    TwitterService_status.getUrls(status_id, this.target_status_urls = []);
    TwitterService_status.getHashes(status_id, this.target_status_hashes = []);
    TwitterService_status.getUsers(status_id, this.target_status_users = []);
}


AzureaVim.add_commands = function(lists) {
    Util.mixin(_commands_list, lists, true);
};


AzureaVim.prototype = {
    run: function() {
        var azvm = this;

        this.commands.reduce(function(input,     // @param Object:
                                      command) { // @param Array:
            return azvm.exec(command, input);
        }, null);
    },

    exec: function(command, // @param Array:
                   input) { // @param Object=void 0:
                            // @return Object:
        var command_name = _commands_list[command[0]];

        if (command_name.indexOf(' ') !== -1) {
            command.shift();
            command = command_name.split(' ').concat(command);
        } else {
            command[0] = command_name;
        }
        return this[command[0]](command.slice(1), input);
    }
};


function _focusInput(status_id){ // @param String: status id
    _env.target_view = System.views.currentView;
    TextArea.text = ':';
    TextArea.in_reply_to_status_id = status_id;
    TextArea.show();
    TextArea.setFocus();
    TextArea.cursor = 1;
}


function _focusInputBox(status_id) { // @param String: status id
    var command_text = System.inputBox('command', '', true);

    _env.target_view = System.views.currentView;
    new AzureaVim({
        text: command_text,
        in_reply_to_status_id: status_id || selected_view.selectedStatusId
    }).run();
}


System.addKeyBindingHandler(0xBA, // VK_OME_1 (:)
                            0,
                            _focusInput);
System.addKeyBindingHandler(0xBA, // VK_OME_1 (:)
                            2, // Ctrl
                            _focusInputBox);
TwitterService.addEventListener('preSendUpdateStatus', function(status) { // @param StstusObject:
    if (status.text === ':') {
    } else if (status.text.charAt(0) === ':') {
        try {
            status.text = status.text.slice(1);
            new AzureaVim(status).run();
            TextArea.text = '';
            TextArea.in_reply_to_status_id = 0;
        //} catch (err) {
        //    System.alert(e.name + ':\n' + e.message);
        } finally {
            return true;
        }
    }
});
_scope.AzureaVim = AzureaVim;

}(this));
AzureaVim.add_commands({
    test: 'test',
    t: 'test',
    test2: 'test 2'
});

AzureaVim.prototype.test = function(option,  // @param Arrzy:
                                    input) { // @param String:
    System.alert('Test has done!\noption: ' + option + '\ninput: ' + input);
    return 'test';
};
AzureaVim.add_commands({
    u: 'unshorten',
    unshorten: 'unshorten',
    '‚¤‚ñ‚µ‚å‚’‚Ä‚Ž': 'unshorten'
});


(function() {

var _unshorten_url = Util.url.unshorten,
    _postly_cache = {};


function _clear_cache() {
    var url,
        cache = _postly_cache,
        timelimit = Date.now() - 3600000;

    for (url in cache) {
        if (cache.hasOwnProperty(url)) {
            if (cache[url][1] < timelimit) {
                delete cache[url];
            }
        }
    }
    System.setTimeout(_clear_cache, 1800000);
}
System.setTimeout(_clear_cache, 1800000);


function _expand_postly(url) { // @param String: post.ly url
                               // @return String: post.ly text
    var id = url.match(/^https?:\/\/post\.ly\/(.+)$/)[1],
        result = url;
    
    function callback(response) { // @param HttpResponce Object:
        var text = response.body.match(/<body>([\s\S]*?)<\/body>/m)[1],
            match;
        
        if (match = text.match(/<!\[CDATA\[([\s\S]*?)\]\]>/m)) {
            text = match[1].replace(/<\/(?:p|div|blockquote)>/g, '\n').replace(/<[\s\S]+?>/mg, '');
        }
        text += '\n' + url;
        _postly_cache[id] = [text, Date.now()];
    }
    
    if (_postly_cache[id]) {
        return _postly_cache[id][0];
    }
    try {
        Http.sendRequestAsync('http://posterous.com/api/getpost?id=' + id, false, callback);
    } catch (err) {
    }
    return url;
}


AzureaVim.prototype.unshorten = function(option,  // @param Array:
                                         input) { // @hidden Object:
                                                  // @return String:
    var url = this.target_status_urls[option[0] || 0],
        text;

    if (url.indexOf('post.ly') !== -1) {
        text = this.target_status_text.replace(url, _expand_postly(url));
    } else {
        text = this.target_status_text.replace(url, _unshorten_url(url));
    }System.showNotice(text);
    this.target_item.text = text;
};


TwitterService.addEventListener('preProcessTimelineStatus', function(status) { // @param Status Object
    status.text = status.text.replace(/https?:\/\/[0-9A-Za-z._\-\^~\/&%?]+/g,
                                      function(url) {
        var expanded;
        
        if (url.indexOf('post.ly') !== -1) {
            expanded = _expand_postly(url);
        } else {
            expanded = _unshorten_url(url);
        }
        return expanded;
    });
});

}());
