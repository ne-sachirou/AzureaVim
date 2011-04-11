var interval_list = {};// {id: true}
    /*timeevent_list = (function() { // {id: [time, fun, i]}
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
}());*/


function setInterval(fun,  // @param Function:
                     ms) { // @param Number:
                           // @return Number:
    var id;
    
    function callback() {
        if (interval_list[id]) {
            fun();
            System.setTimeout(fun, ms);
        }
    }
    
    id = System.setTimeout(callback, ms);
    interval_list[id] = true;
    return id;
}

function clearInterval(id) { // @param Strings:
    delete timeinterval_list[id];
}


function setTimeevent(fun,  // @param String: Function = eval(String)
                      ms) { // @param Number: Date().getTime()
                            // @return Strings:
    var id, i = -1;
    
    function callback() {
        if (new RegExp('^' + id + ':').test(getDbKey('TimeEvent' + i))) {
            fun();
            deleteDbKey('TimeEvent' + i);
        }
    }
    
    while (getDbKey('TimeEvent' + (++i))) {
    }
    id = System.setTimeout(callback, ms - Date.getTime());
    setDbKey('TimeEvent' + i, id + ':' + ms + '|' + fun);
    return id;
}


function clearTimeevent(id) { // @param Strings:
    var timeevent_list = dbKeys(/^TimeEvent\d+/),
        timeevent, i = -1;
    
    while (timeevent = timeevent_list[++i]) {
        if (new RegExp('^' + id + ':').test(getDbKey(timeevent))) {
            deleteDbKey('TimeEvent' + timeevent_list[id][1]);
        }
    }
}


mixin(AzureaUtil.time, {
    'setTimeout': function(callback, ms) {return System.setTimeout(callback, ms);},
    'clearTimeout': function(timer_id) {return System.clearTimeout(timer_id);},
    'setInterval': setInterval,
    'clearInterval': clearInterval/*,
    'setTimeevent': setTimeevent,
    'clearTimeevent': clearTimeevent*/
});