// https://gist.github.com/841702
AzureaUtil = {
    mixin: {},
    event: {},
    time: {},
    template: {},
    yank: {}
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


// ======================================== db ========================================
var db = {};

function setDbKey(key,     // @param String:
                  value) { // @param String='':
    System.settings.setValue('user.AzureaVim', key, encodeURIComponent(value));
    db[key] = value;
}


function getDbKey(key) { // @param String:
                         // @return String:
    if (!db[key]) {
        db[key] = decodeURIComponent(System.settings.getValue('user.AzureaVim', key));
    }
    return db[key];
}


function deleteDbKey(key) { // @param String:
    System.settings.setValue('user.AzureaVim', key, '');
    delete db[key];
}


function dbKeys(regex) { // @param RegExp|String='':
                         // @return Array[String]:
    var key, keys = [];
    
    if (typeof regex === 'string' || regex instanceof String) {
        regex = RegExp(regex);
    }
    for (key in db) {
        if (match.test(key)) {
            keys.push(key);
        }
    }
    return keys;
}


mixin(AzureaUtil.db, {
    'get': getDbKey,
    'set': setDbKey,
    'delete': deleteDbKey,
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
    var timeevent_list,
        timeEvent, i = -1;
    
    while (timeEvent = getDbKey('TimeEvent' + (++i))) {
        timeevent_list[timeEvent.substring(0, timeEvent.indexOf(':'))] = [
            timeEvent.substring(timeEvent.indexOf(':') + 1, timeEvent.indexOf('|')),
            eval(timeEvent.substring(timeEvent.indexOf(':')+1)),
            i
        ];
    }
    return timeevent_list;
})();


function attainSchedule() {
    var now = Date().getTime(),
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
    for (id in timeevent_list) {
        if (timeevent_list[id][0] <= now) {
            timeevent_list[id][1]();
            deleteDbKey('TimeEvent' + timeevent_list[2]);
            delete timeevent_list[id];
        }
        
    }
}


addEventListener('PreProcessTimelineStatus', attainSchedule);
addEventListener('PostSendUpdateStatus', attainSchedule);
addEventListener('ReceiveFavorite', attainSchedule);


function setTimeout(fun,  // @param Function:
                    ms) { // @param Number:
                          // @return Strings:
    var id = Math.floor(Math.random() * Date().getTime()).toString(36);
    
    timeout_list[id] = [new Date().getTime() + ms, fun];
    return id;
}


function clearTimeout(id) { // @param Strings:
    delete timeout_list[id];
}


function setInterval(fun,  // @param Function:
                     ms) { // @param Number:
                           // @return Strings:
    var id = Math.floor(Math.random() * Date().getTime()).toString(36);
    
    timeinterval_list[id] = [new Date().getTime() + ms, fun, ms];
    return id;
}


function clearInterval(id) { // @param Strings:
    delete timeinterval_list[id];
}


function setTimeevent(fun,    // @param String:
                      time) { // @param Number: Date().getTime()
                              // @return Strings:
    var id = Math.floor(Math.random() * Date().getTime()).toString(36),
        i = -1;
    
    while (getDbKey(TimeEvent + (++i))) {
    }
    setDbKey('TimeEvent' + i, id + ':' + time + '|' + fun);
    timeevent_list[id] = [time, eval(fun), i];
    return id;
}


function clearTimeevent() {
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