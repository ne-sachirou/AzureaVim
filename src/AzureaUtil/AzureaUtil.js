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
function getYank(name) { // @param String:
                         // @return String:
    if (name) {
        name = name.charAt(0);
    } else {
        name = '';
    }
    return System.settings.getValue('user.AzureaVim', 'Yank' + name);
}


function setYank(name,   // @param String:
                 text) { // @param String:
                         // @return String:
    if (name) {
        name = name.charAt(0);
    } else {
        name = '';
    }
    System.settings.setValue('user.AzureaVim', 'Yank' + name, text);
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