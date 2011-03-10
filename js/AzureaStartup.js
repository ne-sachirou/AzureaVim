// @date 2011-03-10

// const
var APPLICATION_NAME = 'Azurea.exe',
    APPLICATION_PATH = APPLICATION_NAME,
    SCRIPTS_PATH = 'Scripts',
    STARTUPSCRIPT_UPDATE_URL = 'https://github.com/ne-sachirou/AzureaVim/raw/master/js/AzureaStartup.js',
    STARTUPSCRIPT_BACKUP_PATH = 'bak/StartupScript/AzureaStartup.js',
    STARTUPSCRIPT_TARGET_PATH = 'AzureaStartup.js';


function echo(message) {
    //WScript.Echo(message);
}


// http://d.hatena.ne.jp/hetappi/20080819/1219157144
function unzip(zipfile,    // @param String: Zipped file path
               unzipdir) { // @param String: Unzip target directory path
    var fso = new ActiveXObject('Scripting.FileSystemObject'),
        shell = new ActiveXObject('Shell.Application'),
        dst, zip;
    
    if (!unzipdir) {
        unzipdir = '.';
    }
    if (!fso.FolderExists(unzipdir)) {
        fso.CreateFolder(unzipdir);
    }
    dst = shell.NameSpace(fso.getFolder(unzipdir).Path);
    zip = shell.NameSpace(fso.getFile(zipfile).Path);
    if (fso.FileExists(zipfile)) {
        dst.CopyHere(zip.Items(), 4 + 16);
    }
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
        echo('Updating ' + file_name);
        meta_local = getMeta(fso.OpenTextFile(file_name, 1).ReadAll());
        
        if (/\.js$/.test(file_name) && meta_local.scriptUrl && meta_local.date) {
            xml_http.open('GET', meta_local.scriptUrl + files.item().Name ,false);
            xml_http.onreadystatechange = function() {
                echo('_____ok'.substring(0, xml_http.readyState));
                if (xml_http.readyState === 4 && xml_http.status === 200) {
                    try {
                        meta_remote = getMeta(xml_http.responseText);
                        if (meta_remote.date > meta_local.date) {
                            stream = fso.createTextFile(file_name, true);
                            stream.write(xml_http.responseText);
                            stream.close();
                        }
                        echo(file_name + '_____ok');
                    } catch (e) {
                        echo(e.message);
                    }
                } else if (xml_http.readyState === 4 && xml_http.status > 200) {
                    echo(xml_http.status + ' ' + xml_http.statusText);
                }
            }
            xml_http.send();
        }
    }
}


//function updateAzurea() {
//    var url = 'http://azurea.refy.net/ja/wiki/index.php?%E3%83%AA%E3%83%AA%E3%83%BC%E3%82%B9',
//        regex_date_remote = /<div id="lastmodified">Last-modified: (\d{4})-(\d{2})-(\d{2}) \(.\) (\d{2}):(\d{2}):(\d{2})/,
//        regex_downloads = /<a href="(.+?\.(?:zip|CAB))"/g,
//        fso = new ActiveXObject('Scripting.FileSystemObject'),
//        xml_http = new ActiveXObject('MSXML2.XMLHttp'),
//        match, downloads, archive_remote, stream;
//    
//    date_local = new Date(fso.getFile('Azurea.exe').DateLastModified).getTime();
//    
//    xml_http.open('GET', url, false);
//    xml_http.onreadystatechange = function() {
//        if (xml_http.readyState === 4 && xml_http.status === 200) {
//            try {
//                date_remote = xml_http.responseText.match(regex_date_remote)
//                date_remote = new Date(date_remote[1], date_remote[2], date_remote[3], date_remote[4], date_remote[5], date_remote[6]).getTime();
//                if (date_remote > date_local) {
//                    while (match = ragex_downloads.exec(xml_http.responseText)) {
//                        // [安定版Windows Mobile(ARMv5), 安定版Windows PC(x86), 開発版Windows Mobile(ARMv5), 開発版Windows PC(x86)]
//                        downloads.push(m[1]);
//                    }
//                    archive_remote = downloads[3];
//                }
//            } catch (e) {
//                echo(e.message);
//            }
//        } else if (xml_http.readyState === 4 && xml_http.status > 200) {
//            echo(xml_http.status + ' ' + xml_http.statusText);
//        }
//    }
//    xml_http.send();
//    
//    if (archive_remote) {
//        xml_http.open('GET', archive_remote, false);
//        xml_http.onreadystatechange = function() {
//            if (xml_http.readyState === 4 && xml_http.status === 200) {
//                try {
//                    stream = fso.CreateFile('bak/Azurea/AzureaWin.zip');
//                    stream.write(xml_http.responseBody);
//                    stream.close();
//                    unzip('bak/Azurea/AzureaWin.zip', 'bak/Azurea');
//                    fso.DeleteFile('bak/Azurea/AzureaWin.zip');
//                } catch (e) {
//                    echo(e.message);
//                }
//            } else if (xml_http.readyState === 4 && xml_http.status > 200) {
//                echo(xml_http.status + ' ' + xml_http.statusText);
//            }
//        }
//        xml_http.send();
//    }
//}
//
//
//function attachUpdateAzurea() {
//    var fso = new ActiveXObject('Scripting.FileSystemObject'),
//        files = new Enumerator(fso.GetFolder('bak/Azurea').Files),
//        file;
//    
//    for (; !files.atEnd(); files.moveNext()) {
//        file = files.item();
//        
//    }
//}


function updateStartupScript() {
    var fso = new ActiveXObject('Scripting.FileSystemObject'),
        xml_http = new ActiveXObject('MSXML2.XMLHttp'),
        date_local, date_remote, stream;
    
    date_local = fso.OpenTextFile(fso.FileExists(STARTUPSCRIPT_BACKUP_PATH) ? STARTUPSCRIPT_BACKUP_PATH :
                                                                              STARTUPSCRIPT_TARGET_PATH, 1)
                    .ReadAll()
                    .match(/\/\/ @date (.+)\n/)[1]
                    .split('-');
    date_local = new Date(date_local[0], date_local[1], date_local[2]).getTime();
    xml_http.open('GET', STARTUPSCRIPT_UPDATE_URL, false);
    xml_http.onreadystatechange = function() {
        if (xml_http.readyState === 4 && xml_http.status === 200) {
            try {
                date_remote = xml_http.responseText.match(/\/\/ @date (.+)\n/)[1].split('-');
                date_remote = new Date(date_remote[0], date_remote[1], date_remote[2]).getTime();
                if (date_remote > date_local) {
                    stream = fso.createTextFile(STARTUPSCRIPT_BACKUP_PATH, true);
                    stream.write(xml_http.responseText);
                    stream.close();
                }
            } catch (e) {
                echo(e.message);
            }
        } else if (xml_http.readyState === 4 && xml_http.status > 200) {
            echo(xml_http.status + ' ' + xml_http.statusText);
        }
    }
    xml_http.send();
}


function attachUpdateStartupScript() {
    var fso = new ActiveXObject('Scripting.FileSystemObject');
    
    if (fso.FileExists(STARTUPSCRIPT_BACKUP_PATH)) {
        fso.GetFile(STARTUPSCRIPT_TARGET_PATH).Name = '_' + STARTUPSCRIPT_TARGET_PATH;
        fso.MoveFile(STARTUPSCRIPT_BACKUP_PATH, STARTUPSCRIPT_TARGET_PATH);
        fso.DeleteFile('_' + STARTUPSCRIPT_TARGET_PATH);
    }
}


function update() {
    updateScripts(SCRIPTS_PATH);
    //updateAzurea();
    updateStartupScript();
}


function attachUpdate() {
    //attachUpdateAzurea();
    attachUpdateStartupScript();
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


/* ========== MAIN ========== */
var fso = new ActiveXObject('Scripting.FileSystemObject'),
    i;

new ActiveXObject('WScript.Shell').Run(APPLICATION_PATH, 1, false);
if (!fso.FolderExists('bak')) {
    fso.CreateFolder('bak');
    fso.getFolder('bak').Attributes = 2;
}
//if (!fso.FolderExists('bak/Azurea')) {
//    fso.CreateFolder('bak/Azurea');
//}
if (!fso.FolderExists('bak/StartupScript')) {
    fso.CreateFolder('bak/StartupScript');
}
WScript.sleep(6000);
mainloop:
    while (true) {
    update();
    for (i = 0; i < 60; ++i) {
        WScript.sleep(60000);
        if (!isActive(APPLICATION_NAME)) {
            break mainloop;
        }
    }
}
update();
attachUpdate();