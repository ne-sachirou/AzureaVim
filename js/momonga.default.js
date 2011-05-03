Util = {};

(function() {
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
}());
// @description Define ES5 extention by ES3
// @author ne_Sachirou http://c4se.sakura.ne.jp/profile/ne.html
// @date 2011
// @license Public Domain

Array.isArray || (Array.isArray = function(obj) { // @param Object:
                                                  // @param Boolean: obj is an Array or not
    return Object.prototype.toString.call(obj) === '[object Array]';
});

Array.prototype.every || (
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
});

Array.prototype.filter || (Array.prototype.filter = function(fun,   // @param Function:
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
});

Array.prototype.forEach || (Array.prototype.forEach = function(fun,   // @param Function:
                                                               obj) { // @param Object: this in fun
                                                                      // @return Array: this
    var i = this.length;
    
    while (i--) {
        if (typeof this[i] !== 'undefined') {
            fun.call(obj, this[i], i, this);
        }
    }
    return this;
});

Array.prototype.indexOf || (Array.prototype.indexOf = function (val,   // @param Object:
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
});

Array.prototype.lastIndexOf || (Array.prototype.lastIndexOf = function(val,   // @param Object:
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
});

Array.prototype.map || (Array.prototype.map = function(fun,   // @param Function:
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
});

Array.prototype.reduce || (Array.prototype.reduce = function(fun,   // @param Function:
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
});

Array.prototype.reduceRight || (Array.prototype.reduceRight = function(fun,   // @param Function:
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
});

Array.prototype.some || (Array.prototype.some = function(fun,   // @param Function:
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
});


// http://blog.stevenlevithan.com/archives/faster-trim-javascript
String.prototype.trim || (String.prototype.trim = function() { // @return String:
    var str = this.replace(/^\s\s*/, ''),
        ws = /\s/,
        i = str.length;
    
    while (ws.test(str.charAt(--i))) {
    };
    return str.slice(0, i + 1);
});


Object.keys || (Object.keys = function(obj) { // @param Object:
                                              // @return Array[String]:
    var key, result = [];
    
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            result.push(key);
        }
    }
    return result;
});


Date.now || (Date.now = function() {
    return new Date().getTime();
});

Date.prototype.toISOString || (Date.prototype.toISOString = function toISOString() {
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
});
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
    this.target_item = this.target_view.getItemByStatusId(status_id);
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
