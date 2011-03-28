var RUBY_URI = 'http://ftp.ruby-lang.org/pub/ruby/binaries/mswin32/',
    RUBY_i386 = 'ruby-1.9.2-p136-i386-mswin32.zip',
    RUBY_x64 = 'ruby-1.9.2-p0-x64-mswin64_80.zip',
    RUBY_ZIPFILE_NAME = 'ruby-1.9.2-p-mswin.zip',
    RAKEFILE_URI = 'https://github.com/ne-sachirou/AzureaVim/raw/master/install/azvm_install.rake',
    RAKEFILE_NAME = 'azvm_install.rake'
    shell = new ActiveXObject('WScript.Shell'),
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


function downloadRuby() {
    var stream = new ActiveXObject('ADODB.Stream'),
        xhr = new ActiveXObject('MSXML2.XMLHttp');
    
    xhr.open('GET', RUBY_URI + (processor_architecture === 'x86' ? RUBY_i386 : RUBY_x64), false);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            try {
                stream.open();
                stream.type = 1;
                stream.write(xhr.responseBody);
                stream.saveToFile(RUBY_ZIPFILE_NAME, 2);
            } catch (err) {
                WScript.Echo(err.name + ':\n' + err.message);
            } finally {
                stream.close();
            }
        }
    };
    xhr.send();
}


function installRuby() {
    unzip(RUBY_ZIPFILE_NAME, 'C:\\Ruby');
    path = path.split(';')
    path.push('C:\\Ruby\\bin');
    env.item('PATH') = path.join(';');
}


function downloadRakefile() {
    var fso = new ActiveXObject('Scripting.FileSystemObject'),
        xhr = new ActiveXObject('MSXML2.XMLHttp');
    
    xhr.open('GET', RAKEFILE_URI, false);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            try {
                stream = fso.createTextFile(RAKEFILE_NAME, true);
                stream.write(xml_http.responseText);
            } catch (err) {
                WScript.Echo(err.name + ':\n' + err.message);
            } finally {
                stream.close();
            }
        }
    };
    xhr.send();
}


if (!/\\Ruby\\bin/i.test(path)) {
    downloadRuby();
    installRuby();
    fso.deleteFile(RUBY_ZIPFILE_NAME);
}
downloadRakefile();
shell.Run('rake -f azvm_install.rake', 1, true);
fso.deleteFile(RAKEFILE_NAME);