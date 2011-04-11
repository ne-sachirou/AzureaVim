//https://gist.github.com/833567
AzureaVim = {};

(function() {

var azvm_commands_list = {},
    selected_item;


function _focusInput(status_id) { // @param String: status id
    var selected_view = System.views.currentView,
        selected_item_id = selected_view.selectedItemId;
    
    selected_item = selected_view.getItem(selected_item_id);
    AzureaUtil.yank.set(null, TextArea.text);
    TextArea.text = ':';
    TextArea.in_reply_to_status_id = status_id;
    TextArea.show();
    TextArea.setFocus();
    TextArea.cursor = 1;
}


function _focusInputBox(status_id) { // @param String: status id
    var command_text = System.inputBox('command', '', true),
        azvm,
        selected_view = System.views.currentView,
        selected_item_id = selected_view.selectedItemId;
    
    selected_item = selected_view.getItem(selected_item_id);
    AzureaUtil.yank.set(null, command_text);
    azvm = new azvm_AzureaVim({
        text: ':' + command_text,
        in_reply_to_status_id: status_id || selected_view.selectedStatusId
    });
    azvm.run();
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
    
    this.item = selected_item;
    this.command_text = status.text.slice(1);
    this.command = _pearse(this.command_text);
    this.status_id = status_id;
    this.user = status_obj.user;
    this.screen_name = status_obj.user.screen_name;
    this.status = status_obj;
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
                            0,
                            _focusInput);
System.addKeyBindingHandler(0xBA, // VK_OEM_1 (:)
                            2, // Ctrl
                            _focusInputBox);
System.addContextMenuHandler(':vim', 0, _focusInputBox);
TwitterService.addEventListener('preSendUpdateStatus', function(status) { // @param StatusUpdate Object:
    var azvm, do_notpost = false;
    
    try {
        if (status.text === ':') {
            do_notpost = true;
            System.setTimeout(function() {
                TextArea.text = AzureaUtil.yank.get(null);
                TextArea.show();
            }, 10);
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

}());