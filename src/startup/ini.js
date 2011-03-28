// http://d.hatena.ne.jp/mobitan/20101014/1287089275
INI = {};

(function() {

function getini(filename,  // @param String:
                section,   // @param String:
                key)     { // @param String=null:
                           // @return String|Hash:
                           //         getini(filename, section, key): そのエントリの値を取得
                           //         getini(filename, section): そのセクションの全エントリをハッシュとして取得
                           //         getini(filename): 全セクションの全エントリをハッシュのハッシュとして取得
    var data = [],
        fso = new ActiveXObject('Scripting.FileSystemObject'),
        f = fso.OpenTextFile(filename, 1, false),
        pos = 0, // 0:セクション前  1:セクション内
        line, m, v, s;
   
    section = (typeof(section) == "undefined") ? null : strip(section);
    key     = (typeof(key)     == "undefined") ? null : strip(key);
    try {
        while (!f.AtEndOfStream) {
            line = f.ReadLine();
            if (!line.match(/^\s*;/)) {
                if (m = line.match(/^\s*\[([^\]]*)\]/)) {
                    if (section === null) {
                        data[strip(m[1])] = [];
                    } else if (pos == 0 && casecmp(strip(m[1]), section)) {
                        pos = 1;
                    } else if (pos == 1) {
                        break;
                    }
                } else if (pos == 1 && (m = line.match(/^\s*(.*?)=(.*)$/))) {
                    v = strip(m[2]).replace(/^(["'])(.*)\1$/, "$2");//"
                    if (key === null) {
                        data[strip(m[1])] = v;
                    } else if (casecmp(strip(m[1]), key)) {
                        data = v; // typeof(data) == "string"
                        break;
                    }
                }
            }
        }
        f.Close();
    } catch(err) {
        if (err.number != -0x7ff5ffcb) {    // 「ファイルが見つかりません」以外のエラー
            WScript.Echo(WScript.ScriptFullName + "\n" + filename + "\n" + err.description);
        }
    }
    if (section === null) {
        for (s in data) {
            data[s] = getini(filename, s);
        }
    } else if (key !== null && typeof(data) != "string") {
        data = null;
    }
    return data;
}


function putini(filename,  // @param String:
                section,   // @param String:
                key,       // @param String=null:
                value)   { // @param String=null:
                           //        putini(filename, section, key, value): そのエントリに値を設定
                           //        putini(filename, section, key, null): そのエントリを削除
                           //        putini(filename, section, null, null): そのセクションを削除
    var fso = new ActiveXObject('Scripting.FileSystemObject'),
        f = fso.OpenTextFile(filename, 1, true), // 読み込み／新規作成
        upper = "",
        lower = "",
        pos = 0, // 0:セクション前  1:セクション内  2:セクション後
        line;
    
    if (typeof key === "undefined") {
        return false;
    }
    if (typeof value  === "undefined") {
        return false;
    }
    section = strip(section);
    key = strip(key);
    try {
        while (!f.AtEndOfStream) {
            line = f.ReadLine();
            if (!line.match(/^\s*;/)) {
                if (m = line.match(/^\s*\[([^\]]*)\]/)) {
                    if (pos == 0 && casecmp(strip(m[1]), section)) {
                        pos = 1;
                        if (key === null) continue;
                        upper += line + "\n";
                        continue;
                    } else if (pos == 1) {
                        pos = 2;
                    }
                } else if (pos == 1 && (m = line.match(/^(.*?)=(.*)$/))) {
                    if (key === null) continue;
                    upper += lower;
                    lower = "";
                    if (casecmp(strip(m[1]), key)) {
                        key = m[1];
                        break;
                    }
                    upper += line + "\n";
                    continue;
                }
            }
            lower += line + "\n";
            if (pos >= 2) break;
        }
        if (key !== null && value !== null) {
            if (pos) {    // エントリを追加／置換
                upper += key + "=" + value + "\n";
            } else {    // セクションとエントリを追加
                lower += "[" + section + "]\n" + key + "=" + value + "\n";
            }
        }
        if (!f.AtEndOfStream) {
            lower += f.ReadAll();
        }
        f.Close();
        f = fso.OpenTextFile(filename, 2, true); // 書き込み
        f.Write(upper + lower);
        f.Close();
    } catch(e) {
        WScript.Echo(WScript.ScriptFullName + "\n" + filename + "\n" + e.description);
    }
    return upper + lower;
}


function strip(arg) { // @param String:
                      // @return String:
    return (typeof arg === "string") ? arg.replace(/^\s+|\s+$/g, "") : arg;
}


function casecmp(arg1,
                 arg2) {
    if (typeof arg1 === "string") {
        arg1 = arg1.toLowerCase();
    }
    if (typeof arg2  === "string") {
        arg2 = arg2.toLowerCase();
    }
    return (arg1 == arg2);
}


INI.getini = getini;
INI.putini = putini;

})();