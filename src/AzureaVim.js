(function(_scope) {

var _env = {},
    regex_string = /"[^\\"]*(?:\\.[^\\"]*)*"/g,
    regex_command = new RegExp('\s*([^"\\s]+|' + regex_string.source + ')\s*', 'g'),
    regex_commands = new RegExp('[^|"]+(?:' + regex_string.source + '[^|"]+)*', 'g');

function _parse_single(text) { // @param String:
                               // @return Array:
    var command = [],
        match;

    while (match = regex_command.exec(text)) {
        command.push(match[0]);
    }
    return command;
}


function _parse(text) { // @param String:
                        // @return Array:
    var commands = [],
        match;

    text = text.trim();
    while (match = regex_commands.exec(text)) {
        commands.push(_parse_single(match[0]));
    }
    return commands;
}


function AzureaVim(status) { // @param Hash:
                             //   {in_reply_to_status_id: status id
                             //    text: status text}
    var TwitterService_status = TwitterService.status,
        status_id = status.inreply_to_status_id,
        status_obj = TwitterService_status.get(status_id);

    if (!this instanceof AzureaVim) {
        return new AzureaVim(status);
    }
    this.command = _parse(status.text);
    this.target_status = status_obj;
    this.target_view = _env.selected_view;
    this.target_item = this.view.getItemByStatusId(status_id);
    this.target_status_text = status_obj.text;
    this.target_user = status_obj.user;
    TwitterServise_status.getUrls(status_id, this.target_status_urls = []);
    TwitterServise_status.getHashes(status_id, this.target_status_hashes = []);
    TwitterServise_status.getUsers(status_id, this.target_status_users = []);
}

AzureaVim.prototype = {
    run: function() {

    }
};


function _focusInput(){
    _env.selected_view = System.views.currentView;
    TextArea.text = ':';
    TextArea.in_reply_to_status_id = status_id;
    TextArea.show();
    TextArea.setFocus();
    TextArea.cursor = 1;
}


function _focusInputBox(status_id) { // @param String: status id
    var command_text = System.inputBox('command', '', true);

    _env.selected_view = System.views.currentView;
    selected_item = selected_view.getItem(selected_item_id);
    AzureaUtil.yank.set(null, command_text);
    new AzureaVim({
        text: command_text,
        in_reply_to_status_id: status_id || selected_view.selectedStatusId
    }).run();
}


System.addKeyBindingHandler(0xBA, // VK_OME_1 (:)
                            0,
                            _fucusInput);
System.addKeyBindingHandler(0xBA, // VK_OME_1 (:)
                            2, // Ctrl
                            _focusInputBox);
TwitterService.addEventListener('preSendUpdateStatus', function(status) { // @param StstusObject:

}
_scope.AzureaVim = AzureaVim;

}(this));
