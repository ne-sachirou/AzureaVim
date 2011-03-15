AzureaUtil.mixin(AzureaVim.commands_list, {
    delay: 'delay'
});
// delay option1 option2
// 

(function() {

if (AzureaUtil.db.get('DelayUseTwitDelay')) {
    AzureaUtil.db.set('DelayUseTwitDelay', '0');
}

function postTwitDelay(text,       // @param String:
                       time,       // @param String: RFC2822
                       callback) { // @param Function:
    Http.postRequestAsync('http://twitdelay.appspot.com/api/post',
                          'user_id=' + AzureaUtil.db.get('UserName') +
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