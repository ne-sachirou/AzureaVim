//https://gist.github.com/833567
(function() {

var commands_list = {};


function focusInput(status_id) { // @param String: ststus id
    TextArea.text = ':';
    TextArea.in_reply_to_status_id = status_id;
    TextArea.show();
    TextArea.setFocus();
    TextArea.setCursor(1);
}


System.addKeyBindingHandler(0xBA, // VK_OEM_1 (:)
                            0, focusInput);
System.addContextMenuHandler(':vim', 0, focusInput);
AzureaUtil.event.addEventListener('PreSendUpdateStatus', function(status) { // @param StatusUpdate Object:
    var azvim, flag = false;
    
    try {
        if (/^:/.test(status.text)) {
            flag = true;
            azvim = new AzureaVim(status);
            TextArea.text = '';
            TextArea.in_reply_to_status_id = 0;
            azvim.run();
        }
    } catch (e) {
        System.alert(e.name + ':\n' + e.message);
        flag = true;
    }
    return flag;
});


function pearse(text) { // @reply String:
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
AzureaVim = function(status) { //@param StatusUpdate Object:
    this.command_text = status.text.slice(1);
    this.command = pearse(this.command_text);
    this.status_id = status.in_reply_to_status_id;
    this.screen_name = TwitterService.status.get(this.status_id).user.screen_name;
    this.status_text = TwitterService.status.get(this.status_id).text;
    this.status_urls = [];
    this.status_hashes = [];
    this.status_users = [];
    TwitterService.status.getUrls(this.status_id, this.status_urls);
    TwitterService.status.getHashes(this.status_id, this.status_hashes);
    TwitterService.status.getUsers(this.status_id, this.status_users);
}


AzureaVim.commands_list = commands_list;


AzureaVim.prototype.run = function() {
    var command = commands_list[this.command[0]];
    
    if (/ /.test(command)) {
        this.command.shift();
        this.command = command.split(' ').concat(this.command);
    } else {
        this.command[0] = command;
    }
    this[this.command[0]]();
}

})();