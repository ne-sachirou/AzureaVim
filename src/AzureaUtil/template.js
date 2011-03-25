function expandTemplate(template, // @param String: template
                        view) {   // @param Object: view
                                  // @return Hash: {text: expanded String,
                                  //                cursor: Number of cursor plase}
    var cursor,
        varstring = (function() {
        var key, _view = view, vars = '';
        
        for (key in _view) {
            if (_view.hasOwnProperty(key)) {
                vars += 'var ' + key + '=' + valueToCodeString(_view[key]) + ';';
            }
        }
        return vars;
    })(),
        text = template.replace(/#{([^}]+?)}/g,
                                function(m,        // @param String:
                                         figure) { // @param String:
        return eval('(function(){' + varstring + 'return (' + figure + ')})()');
    });
    
    function valueToCodeString(v) { // @param Object:
                                    // @return String:
        var _v, key, length;
        
        if (typeof v === 'string' || v instanceof String) {
            _v = '"' + v.replace('"', '\\"') + '"';
        } else if (typeof v === 'number' || v instanceof Number) {
            _v = v.toString(10);
        } else if (v === true || v === false) {
            _v = v
        } else if (v === null) {
            _v = 'null';
        } else if (typeof v === 'undefined') {
            _v = 'void(0)';
        } else if (v instanceof Array) {
            _v = '[';
            for (key = 0, length = v.length; key < length; ++key) {
                _v += valueToCodeString(v[key]) + ',';
            }
            _v = _v.replace(/,$/, '') + ']';
        } else {
            _v = '{';
            for (key in v) {
                if (v.hasOwnProperty(key)) {
                    _v += '"' + key + '":' + valueToCodeString(v[key]) + ',';
                }
            }
            _v = _v.replace(/,$/, '') + '}';
        }
        return _v;
    }
    
    text = text.split('#{}');
    if (text.length === 1) {
        cursor = 0;
        text = text[0];
    } else {
        cursor = text[0].length;
        text = text.join('');
    }
    return {
        'text': text,
        'cursor': cursor
    };
}


mixin(AzureaUtil.template, {
    'expand': expandTemplate
});