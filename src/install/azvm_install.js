var RUBY_URI = 'http://ftp.ruby-lang.org/pub/ruby/binaries/mswin32/',
    RUBY_i386 = 'ruby-1.9.2-p136-i386-mswin32.zip',
    RUBY_x64 = 'ruby-1.9.2-p0-x64-mswin64_80.zip',
    RUBY_ZIPFILE_NAME = 'ruby-1.9.2-p-mswin.zip',
    ZLIB_ZIPFILE_URI = 'http://jarp.does.notwork.org/win32/',
    ZLIB_ZIPFILE_NAME = 'zlib-1.1.4-1-mswin32.zip',
    RAKEFILE_URI = 'https://github.com/ne-sachirou/AzureaVim/raw/master/src/install/',
    RAKEFILE_NAME = 'azvm_install.rake';

(function() {
    var wmi = GetObject('winmgmts:\\\\.\\root\\cimv2'),
        os = wmi.ExecQuery('SELECT * FROM Win32_OperatingSystem'),
        osenum = new Enumerator(os),
        item,
        is_notXP = false,
        key = '__uac',
        args = WScript.Arguments,
        i = 0, length = args.length,
        lastArg,
        newArgs = [],
        shell = WScript.CreateObject('Shell.Application');
    
    for (; !osenum.atEnd(); osenum.moveNext()) {
        if (osenum.item().Version.substring(0, 3) < '6.0') {
            is_notXP = true;
        }
    }
    
    if(!is_notXP && key !== lastArg) {
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

var shell = new ActiveXObject('WScript.Shell'),
    env = shell.Environment('SYSTEM'),
    path = env.item('PATH'),
    processor_architecture = env.item('PROCESSOR_ARCHITECTURE'),
    fso = new ActiveXObject('Scripting.FileSystemObject');

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


function downloadBinaryFile(uri,        // @param String:
                            filename) { // @param String:
                                        // @return Hash:
    var stream = new ActiveXObject('ADODB.Stream'),
        xhr = new ActiveXObject('MSXML2.XMLHttp'),
        result;
    
    xhr.open('GET', uri, false);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            try {
                stream.open();
                stream.type = 1;
                stream.write(xhr.responseBody);
                stream.saveToFile(filename, 2);
                result = {
                    ok: true,
                    uri: uri,
                    filename: filename
                };
            } catch (err) {
                result = {
                    error: true,
                    errormessage: err.name + ': ' + err.message,
                    uri: uri,
                    filename: filename
                };
            } finally {
                stream.close();
            }
        } else if (xhr.readyState === 4) {
            result = {
               error: true,
               errormessage: 'HttpError: Status number is ' + xhr.status,
               uri: uri,
               filename: filename
            };
        }
    };
    xhr.send();
    return result;
}


function downloadRuby() {
    downloadBinaryFile(RUBY_URI + (processor_architecture === 'x86' ? RUBY_i386 : RUBY_x64),
                       RUBY_ZIPFILE_NAME);
}


function installRuby() {
    unzip(RUBY_ZIPFILE_NAME, 'C:\\Ruby');
    path = path.split(';');
    path.push('C:\\Ruby\\bin');
    env.item('PATH') = path.join(';');
}


function downloadZlib() {
    downloadBinaryFile(ZLIB_ZIPFILE_URI + ZLIB_ZIPFILE_NAME,
                       ZLIB_ZIPFILE_NAME);
}


function installZlib() {
    var fso = new ActiveXObject('Scripting.FileSystemObject');
    
    unzip(ZLIB_ZIPFILE_NAME, 'zlib-mswin32');
    fso.copyFile('zlib-mswin32\\bin\\zlib.dll', 'C:\\Ruby\\bin\\zlib.dll');
    fso.deleteFolder('zlib-mswin32');
}


function downloadRakefile() {
    var fso = new ActiveXObject('Scripting.FileSystemObject'),
        xhr = new ActiveXObject('MSXML2.XMLHttp');
    
    xhr.open('GET', RAKEFILE_URI + RAKEFILE_NAME, false);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            try {
                stream = fso.createTextFile(RAKEFILE_NAME, true);
                stream.write(xhr.responseText);
            } catch (err) {
                WScript.Echo(err.name + ':\n' + err.message);
            } finally {
                stream.close();
            }
        }
    };
    xhr.send();
}


if (!/\\Ruby[^\\]*\\bin/i.test(path)) {
    WScript.Echo('We\'ll download Ruby and Zlib! Please wait minutes.');
    downloadRuby();
    WScript.Echo('Downdoad finished! We\'ll start install Ruby.');
    installRuby();
    fso.deleteFile(RUBY_ZIPFILE_NAME);
    WScript.Echo('Install finished! Ruby OK.\nNext, we\'ll start install Zlib.');
    downloadZlib();
    installZlib();
    fso.deleteFile(ZLIB_ZIPFILE_NAME);
    WScript.Echo('Zlib OK.');
    shell.Run('C:\\Ruby\\bin\\gem install rubyzip', 1, true);
}
downloadRakefile();
shell.Run('rake -f ' + RAKEFILE_NAME, 1, true);
fso.deleteFile(RAKEFILE_NAME);