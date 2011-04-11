var db_cashe = {};

function setDbKey(key,     // @param String:
                  value) { // @param String='':
    System.settings.setValue('user.AzureaVim', key, encodeURIComponent(value));
    db_cashe[key] = value;
}


function getDbKey(key) { // @param String:
                         // @return String:
    if (!db_cashe[key]) {
        db_cashe[key] = decodeURIComponent(System.settings.getValue('user.AzureaVim', key));
    }
    return db_cashe[key];
}


function deleteDbKey(key) { // @param String:
    System.settings.setValue('user.AzureaVim', key, '');
    delete db_cashe[key];
}


function dbKeys(regex) { // @param RegExp|String='':
                         // @return Array[String]:
    var key, keys = [];
    
    if (typeof regex === 'string' || regex instanceof String) {
        regex = RegExp(regex);
    }
    for (key in db_cashe) {
        if (match.test(key)) {
            keys.push(key);
        }
    }
    return keys;
}


/*(function() {
    var iniproxy = new ApiProxy('ini');
    
    apiProxy_addEventListener('ready', function() {
        iniproxy.submit(null, null, function(response) { // @param HttpResponse Object:
            mixin(db_cashe, JSON.parse(response.body), false);
        });
    });
}());*/

mixin(AzureaUtil.db, {
    'get': getDbKey,
    'set': setDbKey,
    'del': deleteDbKey,
    'keys': dbKeys
});