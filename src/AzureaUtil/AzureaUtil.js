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

// ======================================== mixin ========================================
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


// ======================================== ApiProxy ========================================
var API_PROKY_SERVER = 'http://localhost:10080/';

function ApiProxy(mountpoint) { // @param String:
                                // @return ApiProxy Object:
    if (!(this instanceof ApiProxy)) {
        return new ApiProxy(mountpoint);
    }
    
    this.uri = API_PROKY_SERVER + uri;
    return this;
};
ApiProxy.prototype = {
    submit: function(filename,  // @param String='':
                     callback,  // @param Function: 
                     data)    { // @param Hash: 
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
        if (/\/$/.test(baseuri) && filename.charAt(0) === '/') {
            uri = baseuri.substring(1) + filename;
        } else if (!(/\/$/.test(baseuri)) && filename.charAt(0) !== '/') {
            uri = baseuri + '/' + filename;
        } else {
            uri = baseuri + filename;
        }
        
        if (callback && data) {
            Http.postRequestAsync(uri, poststring, false, callback);
        } else if (callback) {
            Http.sendRequestAsync(uri, false, callback);
        } else if (data){
            result = Http.sendRequest(uri, false);
        } else {
            result = Http.postRequest(uri, poststring, false);
        }
        return result;
    }
};

AzureaUtil.ApiProxy = ApiProxy;


// ======================================== db ========================================
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


// ======================================== event ========================================
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


// ======================================== time ========================================
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


// ======================================== template ========================================
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


// ======================================== yank ========================================
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


// ======================================== notify ========================================
var NOTIFY_USE_GROWL = (System.systemInfo =< 2),
    notify_proxy = new ApiProxy('gntp');

function notifyNative(text) { // @param String:
    System.isActive ? System.showNotice(text) :
                      System.showMessage(text, text, 0x100000);
}


function notifyGrowl(title,        // @param String:
                     text,         // @param Strong:
                     screen_name,  // @param String:
                     sticky)     { // @param Boolean=false:
    notify_proxy.submit({
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