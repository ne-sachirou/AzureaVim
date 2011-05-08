var _keyBinding_VKCODE = {
    ' ': 0x20,
    '←': 0x25, '↑': 0x26, '→': 0x27, '↓': 0x28,
    '0': 0x30, '1': 0x31, '2': 0x32, '3': 0x33, '4': 0x34, '5': 0x35, '6': 0x36, '7': 0x37, '8': 0x38, '9': 0x39,
    'a': 0x41, 'b': 0x42, 'c': 0x43, 'd': 0x44, 'e': 0x45, 'f': 0x46, 'g': 0x47, 'h': 0x48,
    'i': 0x49, 'j': 0x4A, 'k': 0x4B, 'l': 0x4C, 'm': 0x4D, 'n': 0x4E, 'o': 0x4F, 'p': 0x50,
    'q': 0x51, 'r': 0x52, 's': 0x53, 't': 0x54, 'u': 0x55, 'v': 0x56, 'w': 0x57, 'x': 0x58,
    'y': 0x59, 'z': 0x5A,
    '?': 0x5B,
    //'0': 0x60, '1': 0x61, '2': 0x62, '3': 0x63, '4': 0x64, '5': 0x65, '6': 0x66, '7': 0x67, '8': 0x68, '9': 0x69,
    '*': 0x6A, '+': 0x6B,
    //',': 0x6C,
    '-': 0x6D,
    //'.': 0x6E, '/': 0x6F,
    ':': 0xBA, ';': 0xBB, ',': 0xBC,
    //'-^': 0xBD,
    '.': 0xBE, '/': 0xBF,
    '@': 0xC0, '[': 0xDB, '\\': 0xDC, ']': 0xDD, '^': 0xDE
    //'\\': 0xE2
} ,
    _keyBinding_default_handlers = {
    'g': {
        'f': function(status_id) {
            System.views.openView(3);
        },

        'r': function(status_id) {
            System.views.openView(1);
        },

        'm': function(status_id) {
            System.views.openView(2);
        },

        'w': function(status_id) {
        }
    },

    'f': function(status_id) {
        if (TwitterService.status.get(status_id).favorited) {
            TwitterService.favorite.destroy(status_id);
        } else {
            TwitterService.favorite.create(status_id);
        }
    },

    't': function(status_id) {
        var status = TwitterService.status.get(status_id);

        if (System.settings.getValue('Misc', 'UseQT')) {
            TextArea.text = 'RT @' + status.user.screen_name + ': ' + status.text;
            TextArea.show();
            TextArea.setFocus();
        } else {
            if (System.showMessage('選択項目をリツイートします。よろしいですか？', '確認', 4) === 6) { // MB_YESNO = 4
                TwitterService.retweet.create(status_id);
            }
        }
    },

    'w': function(status_id) {
        var status = TwitterService.status.get(status_id);

        if (System.settings.getValue('Misc', 'UseQT')) {
            if (System.showMessage('選択項目をリツイートします。よろしいですか？', '確認', 4) === 6) { // MB_YESNO = 4
                TwitterService.retweet.create(status_id);
            }
        } else {
            TextArea.text = 'RT @' + status.user.screen_name + ': ' + status.text;
            TextArea.show();
            TextArea.setFocus();
        }
    },

    'c ctrl': function(status_id) {
        System.clipbord = TwitterService.status.get(status_id).text;
    }
    },
    _keyBinding_handlers = {};


function _keyBinding_parse_key(key) { // @param String:
                                      // @return Array:
    return key.toLowerCase().replace(/\s+/, ' ').split(',')
              .map(function(elm) {
        var result;

        elm = elm.trim().replace('comma', ',').split(' ');
        if (elm.length === 1) {
            result = [elm[0], 0];
        } else {
            result = [
                elm.filter(function(elm2) {
                    return elm2 !== 'shift' && elm2 !== 'alt' && elm2 !== 'ctrl';
                })[0],
                (elm.indexOf('shift') !== -1 ? 1 : 0) +
                (elm.indexOf('ctrl') !== -1 ? 2 : 0) +
                (elm.indexOf('alt') !== -1 ? 4 : 0)
            ];
        }
        return result;
    });
}


function _keyBinding_name_of_optionkeys(num) { // @param Number:
                                               // @return String:
    var result = [];

    if (num & 1) {result.push('shift');}
    if (num & 2) {result.push('ctrl');}
    if (num & 4) {result.push('alt');}
    return (result = result.join(' ')) ? result + ' ' : '';
}


function _keyBinding_build_key(parsed_key) { // @param Array:
                                             // @return String:
                                             //   Reverse _keyBinding_parse_key()'s result
    var result = [],
        i = -1,
        parsed_key_single, name_of_option_keys;

    while (parsed_key_single = parsed_key[++i]) {
        result.push(name_of_optionkeys = (_keyBinding_name_of_optionkeys(parsed_key_single[1]) ?
                        name_of_option_keys + ' ' :
                        '') +
                    parsed_key_single[0]);
    }
    return result.join(' ');
}


function _keyBinding_set_handler(key,         // @param String: Argument of _keyBinding_parse_key()
                                 handler,     // @param Function|Hash:
                                 reset_key) { // @param String='':
    var callback;

    key = _keyBinding_parse_key(key);
    if (handler instanceof Function) {
        callback = function(status_id) { //@param String:
            _keyBinding_set_handler(reset_key, _keyBinding_handlers[reset_key] ||
                                               _keyBinding_default_handlers[reset_key]);
        };
        System.addKeyBindingHandler(_keyBinding_VK_CODE[key[0]], key[1],
                                    reset_key ? callback : handler);
    } else {
        System.addKeyBindingHandler(_keyBinding_VK_CODE[key[0]], key[1],
                                    function(status_id) { //@param String:
            var key2;

            for (key2 in handler) {
                if (handler.hasOwnProperty(key2)) {
                    _keyBindingHandler_set_handler(key2[0], key2[1], handler[key2]);
                }
            }
        });
    }
}


function _keyBinding_init() {
    var _default = _keyBinding_default_handlers,
        key;

    for (key in _default) {
        if (_default.hasOwnProperty(key)) {
            _keyBinding_set_handler(key, _default[key]);
        }
    }
}


function keyBinding_add_handler(key,       // @param String: Argument of _keyBinding_parse_key()
                                handler) { // @param Function:
    var parsed_key = _keyBinding_parse_key(key);

    if (key.length === 1) {
        _keyBinding_handlers[_keyBinding_name_of_optionkeys(parsed_key[0][1]) +
                             parsed_key[0][0]] = handler;
        _keyBinding_set_handler(key, handler);
    } else if (key.length > 1) {
        _keyBinding_set_handler(key,
                                _keyBinding_handlers[
                                    _keyBinding_name_of_optionkeys(parsed_key[0][1]) +
                                    parsed_key[0][0]
                                ]);
    } else {
        debug_console_error('WrongArguments', ['keyBinding', 'keyBinding_add_hendler'], 'Wrong <key>.');
    }
}


function keyBinding_remove_handler(key,       // @param String: Argument of _keyBinding_parse_key()
                                   handler) { // @param Function:

}


Util.keyBinding = {
    add_handler: keyBinding_add_handler,
    remove_handler: keyBinding_remove_handler
};
