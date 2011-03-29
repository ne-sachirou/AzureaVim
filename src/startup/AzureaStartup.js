var APPLICATION_NAME = 'Azurea.exe',
    APPLICATION_PATH = APPLICATION_NAME,
    SCRIPTS_PATH = 'Scripts';


function echo(message) {
    //WScript.Echo(message);
}


function getMeta(script_text) { // @param String: AzureaScript text
                                // @return Hash: Meta infomation
    var regex_begin_meta = new RegExp('^\\s*//\\s*==AzureaScript=='),
        regex_end_meta = new RegExp('^\\s*//\\s*==/AzureaScript=='),
        i = 0, match, meta = {};
    
    script_text = script_text.split('\n');
    if (regex_begin_meta.test(script_text[0])) {
        while (!regex_end_meta.test(script_text[++i])) {
            match = script_text[i].match(/^\s*\/\/\s*@(.+)/)[1].split(/\s+/);
            meta[match[0]] = match[1];
        }
    }
    if (meta.scriptUrl) {
        meta.scriptUrl = meta.scriptUrl.replace(/[^\/]*$/, '');
    }
    if (meta.date) {
        meta.date = meta.date.replace(/\s.*$/, '').split('-');
        meta.date = new Date(Number(meta.date[0]), Number(meta.date[1]), Number(meta.date[2])).getTime();
        if (meta.date > new Date().getTime()) {
            meta.date = new Date().getTime();
        }
    }
    return meta;
}


function updateScripts(path) { // @param String: AzureaScript folder path
    var fso = new ActiveXObject('Scripting.FileSystemObject'),
        files = new Enumerator(fso.GetFolder(path).Files),
        xml_http = new ActiveXObject('MSXML2.XMLHttp'),
        file_name, meta_local, meta_remote, stream;
    
    for (; !files.atEnd(); files.moveNext()) {
        file_name = path + '\\' + files.item().Name;
        //echo('Updating ' + file_name);
        meta_local = getMeta(fso.OpenTextFile(file_name, 1).ReadAll());
        
        if (/\.js$/.test(file_name) && meta_local.scriptUrl && meta_local.date) {
            xml_http.open('GET', meta_local.scriptUrl + files.item().Name ,false);
            xml_http.onreadystatechange = function() {
                //echo('_____ok'.substring(0, xml_http.readyState));
                if (xml_http.readyState === 4 && xml_http.status === 200) {
                    try {
                        meta_remote = getMeta(xml_http.responseText);
                        if (meta_remote.date > meta_local.date) {
                            stream = fso.createTextFile(file_name, true);
                            stream.write(xml_http.responseText);
                            stream.close();
                        }
                        //echo(file_name + '_____ok');
                    } catch (e) {
                        //echo(e.message);
                    }
                } else if (xml_http.readyState === 4 && xml_http.status > 200) {
                    //echo(xml_http.status + ' ' + xml_http.statusText);
                }
            }
            xml_http.send();
        }
    }
}


function isActive(application_name) { // @param Script: Process name
                                      // @return Boolean:
    var wmi = GetObject('winmgmts:\\\\.\\root\\cimv2'),
        procset = wmi.ExecQuery('Select * From Win32_Process'),
        procenum = new Enumerator(procset),
        proc, is_active = false;

    for (; !procenum.atEnd(); procenum.moveNext()) {
        proc = procenum.item();
        //echo(proc.ProcessId +'\n'+ proc.Caption +'\n'+ proc.Name);
        if (proc.Name.indexOf(application_name) !== -1) {
            is_active = true;
            break;
        }
    }
    return is_active;
}

function exitApiProxy() {
    var xhr = new ActiveXObject('MSXML2.XMLHttp');
    
    xhr.open('GET', 'http://localhost:80/exit', false);
    xhr.send();
}


/* ========== MAIN ========== */
var fso = new ActiveXObject('Scripting.FileSystemObject'),
    shell = new ActiveXObject('WScript.Shell'),
    i;

shell.run('cmd /C ruby "' + WScript.ScriptFullName.replace(/[^\\]+$/, '') + 'data\\apiproxy\\apiproxy.rb"', 1, false);
shell.run(APPLICATION_PATH, 1, true);
mainloop:
    while (true) {
    updateScripts(SCRIPTS_PATH);
    for (i = 0; i < 60; ++i) {
        WScript.sleep(12000);
        if (!isActive(APPLICATION_NAME)) {
            break mainloop;
        }
    }
}
exitApiProxy();
updateScripts(SCRIPTS_PATH);