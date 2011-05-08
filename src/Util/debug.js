var _debug_LOGFILE = 'Scripts/momonga.js/log.txt',
    _debug_SCRIPTFILE = 'Scripts/momonga.debug.js',
    debug_console;


function debug_console_log(message) { // @param String:
    new ActiveXObject('Scripting.fileSystemObject').openTextFile(_debug_LOGFILE, 8, true, TristateTrue).write(message + '\n');
}


function debug_console_error(kind,      // @param String:
                             stack,     // @param Array:
                             message) { // @param String:
    debug_console_log(kind + ' Error:\n\t' + message + '\n\tfrom: ' + stack.join('/'));
}


function debug_reload_script() {
    eval(new ActiveXObject('Scripting.FileSystemObject').openTextFile(_debug_SCRIPTFILE, 1).readAll());
}
System.showNotice('Loading AzureaVim.');


System.addKeyBindingHandler(0xBA, 7, function(status_id) {debug_reload_script();});


debug_console = {
    log: debug_console_log,
    error: debug_console_error
};
Util.debug = {
    console: debug_console,
    reload_script: debug_reload_script
};
