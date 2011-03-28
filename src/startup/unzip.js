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