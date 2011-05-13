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
