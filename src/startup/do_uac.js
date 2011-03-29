(function() {

var wmi = GetObject('winmgmts:\\\\.\\root\\cimv2'),
    os = wmi.ExecQuery('SELECT * FROM Win32_OperatingSystem'),
    item,
    is_notXP = false,
    key = '__uac',
    args = WScript.Arguments,
    i = 0, length = args.length,
    lastArg,
    newArgs = [],
    shell = WScript.CreateObject('Shell.Application');

for (item in os) {
    if (item.Version.substring(0, 3) < '6.0') {
        is_notXP = true;
    }
}

if(is_notXP && key !== lastArg) {
    if (length !== 0) {
        lastArg = args(length - 1);
    }
    for (; i < length; ++i) {
        newArgs.push(args(i));
    }
    newArgs.push(key);
    shell.ShellExecute('wscript.exe', '"' + WScript.ScriptFullName + '" ' + newArgs.join(' '), '', 'runas', 1);
    WScript.Quit(0);
}

})();