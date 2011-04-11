// https://gist.github.com/841702
AzureaUtil = {
    mixin: {},
    ApiProxy: {},
    db: {},
    retweet: {},
    favorite: {},
    event: {},
    time: {},
    template: {},
    yank: {},
    notify: {}
};

(function() {
// @description Define ES5 Array.prototype
// @author ne_Sachirou http://c4se.sakura.ne.jp/profile/ne.html
// @date 2011
// @license Public Domain

Array.isArray || (Array.isArray = function(obj) { // @param Object:
                                                  // @param Boolean: obj is an Array or not
    return Object.prototype.toString.call(obj) === '[object Array]';
});

Array.prototype.every || (
Array.prototype.every = function(fun,   // @param Function:
                                 obj) { // @param Object: this in fun
                                        // @return Boolean:
    var i = this.length;
    
    while (i--) {
        if (typeof this[i] !== 'undefined' &&
            !fun.call(obj, this[i], i, this)) {
            return false;
        }
    }
    return true;
});

Array.prototype.filter || (Array.prototype.filter = function(fun,   // @param Function:
                                                             obj) { // @param Object: this in fun
                                                                    // @return Array:
    var arr = [],
        i = 0,
        len = this.length;
    
    for (; i < len; ++i) {
        if (typeof this[i] !== 'undefined' &&
            fun.call(obj, this[i], i, this)) {
            arr.push(this[i]);
        }
    }
    return arr;
});

Array.prototype.forEach || (Array.prototype.forEach = function(fun,   // @param Function:
                                                               obj) { // @param Object: this in fun
                                                                      // @return Array: this
    var i = this.length;
    
    while (i--) {
        if (typeof this[i] !== 'undefined') {
            fun.call(obj, this[i], i, this);
        }
    }
    return this;
});

Array.prototype.indexOf || (Array.prototype.indexOf = function (val,   // @param Object:
                                                                num) { // @param Number=0:
                                                                       // @return Number: not found = -1
    var i,
        len = this.length;
    
    num = num || 0;
    while (num < 0) {
        num += len - 1;
    }
    for(i = num; i < len; ++i) {
        if (this[i] === val) {
            return i;
        }
    }
    return -1;
});

Array.prototype.lastIndexOf || (Array.prototype.lastIndexOf = function(val,   // @param Object:
                                                                       num) { // @param Number=(this.length-1):
                                                                              // @return Number: not found = -1
    var i,
        len = this.length;
    
    if (typeof num === 'undefined') {
        num = len - 1;
    }
    while (num < 0) {
        num += len - 1;
    }
    i = num;
    for (; i >= 0; --i) {
        if (this[i] === val) {
            return i;
        }
    }
    return -1;
});

Array.prototype.map || (Array.prototype.map = function(fun,   // @param Function:
                                                       obj) { // @param Object: this in fun
                                                              // @return Array:
    var i = this.length,
        arr = new Array(i);
    
    while (i--) {
        if (typeof this[i] !== 'undefined') {
            arr[i] = fun.call(obj, this[i], i, this);
        }
    }
    return arr;
});

Array.prototype.reduce || (Array.prototype.reduce = function(fun,   // @param Function:
                                                             val) { // @param Object:
                                                                    // @return Object:
    var i = 0,
        len = this.length;
    
    if (typeof val === 'undefined') {
        val = this[0];
        i = 1;
    }
    for (; i < len; ++i) {
        if (typeof this[i] !== 'undefined') {
            val = fun.call(null, val, this[i], i, this);
        }
    }
    return val;
});

Array.prototype.reduceRight || (Array.prototype.reduceRight = function(fun,   // @param Function:
                                                                       val) { // @param Object:
                                                                              // @return Object:
    var i = this.length;
    
    if (typeof val !== 'undefined') {
        val = this[i];
        --i;
    }
    while (i--) {
        if (typeof this[i] !== 'undefined') {
            val = fun.call(null, val, this[i], i, this);
        }
    }
    return val;
});

Array.prototype.some || (Array.prototype.some = function(fun,   // @param Function:
                                                         obj) { // @param Object:
                                                                // @return Boolean:
    var i = this.length;
    
    while (i--) {
        if (typeof this[i] !== 'undefined' &&
            fun.call(obj, this[i], i, this)) {
            return true;
        }
    }
    return false;
});


// http://blog.stevenlevithan.com/archives/faster-trim-javascript
String.prototype.trim || (String.prototype.trim = function() { // @return String:
    var str = this.replace(/^\s\s*/, ''),
        ws = /\s/,
        i = str.length;
    
    while (ws.test(str.charAt(--i))) {
    };
    return str.slice(0, i + 1);
});


Object.keys || (Object.keys = function(obj) { // @param Object:
                                              // @return Array[String]:
    var key, result = [];
    
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            result.push(key);
        }
    }
    return result;
});


Date.now || (
Date.now = function() {
    return new Date().getTime();
});

function toISOString() {
    return (this.getUTCFullYear() < 1000 ?
            this.getUTCFullYear() < 100 ?
            this.getUTCFullYear() < 10 ?
            '000' :
            '00' :
            '0' :
            '') + this.getUTCFullYear() + '-' +
           (this.getUTCMonth() + 1 < 10 ? '0' : '') + (this.getUTCMonth() + 1) + '-' +
           (this.getUTCDate() < 10 ? '0' : '') + this.getUTCDate() + 'T' +
           (this.getUTCHours() < 10 ? '0' : '') + this.getUTCHours() + ':' +
           (this.getUTCMinutes() < 10 ? '0' : '') + this.getUTCMinutes() + ':' +
           (this.getUTCSeconds() < 10 ? '0' : '') + this.getUTCSeconds() + 'Z';
}
//{!@test
Date.prototype.toISOString || (Date.prototype.toISOString = toISOString);
//}!@test
/*
    http://www.JSON.org/json2.js
    2011-02-23

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html


    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.


    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/

/*jslint evil: true, strict: false, regexp: false */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

//var JSON;
//if (!JSON) {
    JSON = {};
//}

(function () {
    "use strict";

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf()) ?
                this.getUTCFullYear()     + '-' +
                f(this.getUTCMonth() + 1) + '-' +
                f(this.getUTCDate())      + 'T' +
                f(this.getUTCHours())     + ':' +
                f(this.getUTCMinutes())   + ':' +
                f(this.getUTCSeconds())   + 'Z' : null;
        };

        String.prototype.toJSON      =
            Number.prototype.toJSON  =
            Boolean.prototype.toJSON = function (key) {
                return this.valueOf();
            };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, //"
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string' ? c :
                '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0 ? '[]' : gap ?
                    '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' :
                    '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0 ? '{}' : gap ?
                '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' :
                '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function' ?
                    walk({'': j}, '') : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());
function mixin(hash1,       // @param Hash:
               hash2,       // @param Hash:
               overwrite) { // @param Boolean=true:
    var key;
    
    if (overwrite == null) { // null or undefined
        overwrite = true;
    }
    for (key in hash2) {
        if (overwrite || typeof hash1[key] === 'undefined') {
            hash1[key] = hash2[key];
        }
    }
}

AzureaUtil.mixin = mixin;
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
var favorite_events_list = {
    preCreateFavorite: [],
    postCreateFavorite: [],
    preDestroyFavorite: [],
    postDestroyFavorite: []
};


function favorite_addEventListener(eventname,  // @param String: preCreateFavorite
                                               //                postCreateFavorite
                                               //                preDestroyFavorite
                                               //                postDestroyFavorite
                                   callback) { // @param Function: callback(Status Object)
                                               //                  When return true in preCreateRetweet or preDestroyFavorite,
                                               //                      stop to create or destroy favorite.
    var events_list = favorite_events_list[eventname],
        i = -1;
    
    if (events_list) {
        while (events_list[++i]) {
            if (events_list[i] === callback) {
                events_list.splice(i, 1);
            }
        }
        events_list.push(callback);
    }
}


function favorite_removeEventListener(eventname, // @param String: preCreateFavorite
                                                 //                postCreateFavorite
                                     callback) { // @param Function:
    var events_list = favorite_events_list[eventname],
        i = -1;
    
    while (events_list[++i]) {
        if (events_list[i] === callback) {
            events_list.splice(i, 1);
            break;
        }
    }
}


function favorite_create(status_id) { // @param String; status id
    var status = TwitterService.status.get(status_id),
        pre_create_list = favorite_events_list.preCreateFavorite,
        post_create_list = favorite_events_list.postCreateFavorite,
        is_create_fav = false,
        i = -1;
    
    while (pre_create_list[++i]) {
        is_create_fav = pre_create_list[i](status) || is_create_fav;
    }
    if (!is_create_fav) {
        TwitterService.favorite.create(status_id);
        i = -1;
        while (post_create_list[++i]) {
            post_create_list[i](status);
        }
    }
}


function favorite_destroy(status_id) { // @param String; status id
    var status = TwitterService.status.get(status_id),
        pre_destroy_list = favorite_events_list.preDestroyFavorite,
        post_destroy_list = favorite_events_list.postDestroyFavorite,
        is_destroy_fav = false,
        i = -1;
    
    while (pre_destroy_list[++i]) {
        is_destroy_fav = pre_destroy_list[i](status) || is_destroy_fav;
    }
    if (!is_destroy_fav) {
        TwitterService.favorite.destroy(status_id);
        i = -1;
        while (post_destroy_list[++i]) {
            post_destroy_list[i](status);
        }
    }
}


System.addKeyBindingHandler(0x46, // VK_F
                            0,
                            function(status_id) {
    if (TwitterService.status.get(status_id).favorited) {
        favorite_destroy(status_id);
    } else {
        favorite_create(status_id);
    }
});

mixin(AzureaUtil.favorite, {
    addEventListener: favorite_addEventListener,
    removeEventListener: favorite_removeEventListener,
    create: favorite_create,
    destroy: favorite_destroy
});
var retweet_events_list = {
    preCreateRetweet: [],
    postCreateRetweet: []
};


function retweet_addEventListener(eventname,  // @param String: preCreateRetweet
                                              //                postCreateRetweet
                                  callback) { // @param Function: callback(Status Object)
                                              //                  When return true in preCreateRetweet, stop to create retweet.
    var events_list = retweet_events_list[eventname],
        i = -1;
    
    if (events_list) {
        while (events_list[++i]) {
            if (events_list[i] === callback) {
                events_list.splice(i, 1);
            }
        }
        events_list.push(callback);
    }
}


function retweet_removeEventListener(eventname,  // @param String: preCreateRetweet
                                                 //                postCreateRetweet
                                     callback) { // @param Function:
    var events_list = retweet_events_list[eventname],
        i = -1;
    
    while (events_list[++i]) {
        if (events_list[i] === callback) {
            events_list.splice(i, 1);
            break;
        }
    }
}


function retweet_create(status_id) { // @param String; status id
    var status = TwitterService.status.get(status_id),
        pre_create_list = retweet_events_list.preCreateRetweet,
        post_create_list = retweet_events_list.postCreateRetweet,
        is_create_rt = false,
        i = -1;
    
    while (pre_create_list[++i]) {
        is_create_rt = pre_create_list[i](status) || is_create_rt;
    }
    if (!is_create_rt) {
        TwitterService.retweet.create(status_id);
        i = -1;
        while (post_create_list[++i]) {
            post_create_list[i](status);
        }
    }
}


System.addKeyBindingHandler(0x54, // VK_T
                            0,
                            function(status_id) {
    var status = TwitterService.status.get(status_id);
    
    if (System.settings.getValue('Misc', 'UseQT')) {
        TextArea.text = 'RT @' + status.user.screen_name + ': ' + status.text;
        TextArea.show();
        TextArea.setFocus();
    } else {
        if (System.showMessage('選択項目をリツイートします。よろしいですか？', '確認', 4) === 6) { // MB_YESNO = 4
            retweet_create(status_id);
        }
    }
});

System.addKeyBindingHandler(0x57, // VK_W
                            0,
                            function(status_id) {
    var status = TwitterService.status.get(status_id);
    
    if (System.settings.getValue('Misc', 'UseQT')) {
        if (System.showMessage('選択項目をリツイートします。よろしいですか？', '確認', 4) === 6) { // MB_YESNO = 4
            retweet_create(status_id);
        }
    } else {
        TextArea.text = 'RT @' + status.user.screen_name + ': ' + status.text;
        TextArea.show();
        TextArea.setFocus();
    }
});

mixin(AzureaUtil.retweet, {
    addEventListener: retweet_addEventListener,
    removeEventListener: retweet_removeEventListener,
    create: retweet_create
});
var interval_list = {};// {id: true}
    /*timeevent_list = (function() { // {id: [time, fun, i]}
    var timeevent_list = {},
        timeevent, i = -1;
    
    while (timeevent = getDbKey('TimeEvent' + (++i))) {
        timeevent_list[timeevent.substring(0, timeevent.indexOf(':'))] = [
            timeevent.substring(timeevent.indexOf(':') + 1, timeevent.indexOf('|')) - 0,
            eval('(function(){return ' + timeevent.substring(timeevent.indexOf('|') + 1) + '})()'),
            i
        ];
    }
    return timeevent_list;
}());*/


function setInterval(fun,  // @param Function:
                     ms) { // @param Number:
                           // @return Number:
    var id;
    
    function callback() {
        if (interval_list[id]) {
            fun();
            System.setTimeout(fun, ms);
        }
    }
    
    id = System.setTimeout(callback, ms);
    interval_list[id] = true;
    return id;
}

function clearInterval(id) { // @param Strings:
    delete timeinterval_list[id];
}


function setTimeevent(fun,  // @param String: Function = eval(String)
                      ms) { // @param Number: Date().getTime()
                            // @return Strings:
    var id, i = -1;
    
    function callback() {
        if (new RegExp('^' + id + ':').test(getDbKey('TimeEvent' + i))) {
            fun();
            deleteDbKey('TimeEvent' + i);
        }
    }
    
    while (getDbKey('TimeEvent' + (++i))) {
    }
    id = System.setTimeout(callback, ms - Date.getTime());
    setDbKey('TimeEvent' + i, id + ':' + ms + '|' + fun);
    return id;
}


function clearTimeevent(id) { // @param Strings:
    var timeevent_list = dbKeys(/^TimeEvent\d+/),
        timeevent, i = -1;
    
    while (timeevent = timeevent_list[++i]) {
        if (new RegExp('^' + id + ':').test(getDbKey(timeevent))) {
            deleteDbKey('TimeEvent' + timeevent_list[id][1]);
        }
    }
}


mixin(AzureaUtil.time, {
    'setTimeout': function(callback, ms) {return System.setTimeout(callback, ms);},
    'clearTimeout': function(timer_id) {return System.clearTimeout(timer_id);},
    'setInterval': setInterval,
    'clearInterval': clearInterval/*,
    'setTimeevent': setTimeevent,
    'clearTimeevent': clearTimeevent*/
});
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
function getYank(name) { // @param String='':
                         // @return String:
    if (name) {
        name = name.charAt(0);
        if (/[0-9A-Za-z]/.test(name)) {
            name = '';
        }
    } else {
        name = '';
    }
    return getDbKey('Yank' + name);
}


function setYank(name,   // @param String='':
                 text) { // @param String:
                         // @return String:
    if (name) {
        name = name.charAt(0);
        if (/[0-9A-Za-z]/.test(name)) {
            name = '';
        }
    } else {
        name = '';
    }
    setDbKey('Yank' + name, text);
    return text;
}


mixin(AzureaUtil.yank, {
    'get': getYank,
    'set': setYank
});


function notifyNative(title,  // @param String:
                      text) { // @param String:
    System.isActive ? System.showNotice(text) :
                      System.showMessage(title, text, 0x100000);
}


function notifyGrowl(title,    // @param String:
                     text,     // @param Strong:
                     icon,     // @param String: screen_name|profile_image_url
                     sticky) { // @param Boolean=false:
    var option = {
        "title": title,
        "text": text,
        "sticky": sticky ? 'on' : null
    };
    
    option[/^https?:\/\/./.test(icon) ? 'icon_uri' : 'twitter_screen_name'] = icon;
    notify_proxy.submit(null,
                        option,
                        function(response) {
        try {
            var re = JSON.parse(response.body);
            
            if (re.error) {
                notifyNative(null, re.request.text);
            }
        } catch (err) {
            notifyNative(null, err.message + response.body);
        }
    });
}


function notify(text,     // @param String:
                title,    // @param String:
                icon,     // @param String: screen_name|profile_image_url
                sticky) { // @param Boolean=false:
    var use_growl = 
                    /*{@simple*/ false; /*}@simple*/
    
    try {
        if (use_growl) {
            notifyGrowl(title, text, icon, sticky);
        } else {
            notifyNative(title, text);
        }
    } catch (err) {
        notifyNative(title, text);
    }
}


AzureaUtil.notify = notify;
}());

/*
//function PreProcessTimelineStatuses() {}
function PreProcessTimelineStatus(status) {
    var listener = AzureaUtil.event.PreProcessTimelineStatus,
        i = -1;
    
    while (listener[++i]) {
        listener[i](status);
    }
}
function PreFilterProcessTimelineStatus(status) {
    var listener = AzureaUtil.event.PreFilterProcessTimelineStatus,
        i = -1, r, flag = false;
    
    while (listener[++i]) {
        r = listener[i](status);
        flag = flag || r;
    }
    return flag;
}
//function PostFilterProcessTimelineStatus() {}
//function PostProcessTimelineStatus() {}
//function PostProcessTimelineStatuses() {}
function PreSendUpdateStatus(status) {
    var listener = AzureaUtil.event.PreSendUpdateStatus,
        i = -1, r, flag = false;
    
    while (listener[++i]) {
        r = listener[i](status);
        flag = flag || r;
    }
    return flag;
}
function PostSendUpdateStatus() {
    var listener = AzureaUtil.event.PostSendUpdateStatus,
        i = -1;
    
    while (listener[++i]) {
        listener[i]();
    }
}
function ReceiveFavorite(source,
                         target,
                         target_object) {
    var listener = AzureaUtil.event.ReceiveFavorite,
        i = -1;
    
    while (listener[++i]) {
        listener[i](source, target, target_object);
    }
}
*/
//https://gist.github.com/833567
AzureaVim = {};

(function() {

var azvm_commands_list = {},
    selected_item;


function _focusInput(status_id) { // @param String: status id
    var selected_view = System.views.currentView,
        selected_item_id = selected_view.selectedItemId;
    
    selected_item = selected_view.getItem(selected_item_id);
    AzureaUtil.yank.set(null, TextArea.text);
    TextArea.text = ':';
    TextArea.in_reply_to_status_id = status_id;
    TextArea.show();
    TextArea.setFocus();
    TextArea.cursor = 1;
}


function _focusInputBox(status_id) { // @param String: status id
    var command_text = System.inputBox('command', '', true),
        azvm,
        selected_view = System.views.currentView,
        selected_item_id = selected_view.selectedItemId;
    
    selected_item = selected_view.getItem(selected_item_id);
    AzureaUtil.yank.set(null, command_text);
    azvm = new azvm_AzureaVim({
        text: ':' + command_text,
        in_reply_to_status_id: status_id || selected_view.selectedStatusId
    });
    azvm.run();
}


function _pearse(text) { // @reply String: command text
                        // @return Array:
    var command = [], match, regex = /[^\s"]+|\s+|"[^\\"]*(?:\\.[^\\"]*)*"/g; //"
    
    text = text.replace(/^\s+|\s+$/g, '');
    while (match = regex.exec(text)) {
        if (!/^\s/.test(match[0])) {
            command.push(match[0].replace(/^"|"$/g, ''));
        }
    }
    return command;
}


//AzureaVim Class
function azvm_AzureaVim(status) { //@param StatusUpdate Object:
    var TwitterService_status = TwitterService.status,
        status_id = status.in_reply_to_status_id,
        status_obj = TwitterService_status.get(status_id);
    
    this.item = selected_item;
    this.command_text = status.text.slice(1);
    this.command = _pearse(this.command_text);
    this.status_id = status_id;
    this.user = status_obj.user;
    this.screen_name = status_obj.user.screen_name;
    this.status = status_obj;
    this.status_text = status_obj.text;
    this.status_urls = [];
    this.status_hashes = [];
    this.status_users = [];
    TwitterService_status.getUrls(status_id, this.status_urls);
    TwitterService_status.getHashes(status_id, this.status_hashes);
    TwitterService_status.getUsers(status_id, this.status_users);
}


function azvm_run() {
    var _my_command = this.command,
        command = azvm_commands_list[this.command[0]];
    
    if (command) {
        if (command.indexOf(' ') !== -1) {
            _my_command.shift();
            _my_command = this.command = command.split(' ').concat(_my_command);
            command = _my_command[0];
        }
        this[command]();
    } else {
        System.showNotice(':' + _my_command[0] + ' command is undefined.');
    }
}


System.addKeyBindingHandler(0xBA, // VK_OEM_1 (:)
                            0,
                            _focusInput);
System.addKeyBindingHandler(0xBA, // VK_OEM_1 (:)
                            2, // Ctrl
                            _focusInputBox);
System.addContextMenuHandler(':vim', 0, _focusInputBox);
TwitterService.addEventListener('preSendUpdateStatus', function(status) { // @param StatusUpdate Object:
    var azvm, do_notpost = false;
    
    try {
        if (status.text === ':') {
            do_notpost = true;
            System.setTimeout(function() {
                TextArea.text = AzureaUtil.yank.get(null);
                TextArea.show();
            }, 10);
        }else if (/^(?::|：)/.test(status.text)) {
            do_notpost = true;
            AzureaUtil.yank.set(null, status.text);
            azvm = new azvm_AzureaVim(status);
            TextArea.text = '';
            TextArea.in_reply_to_status_id = 0;
            azvm.run();
        } else {
            AzureaUtil.yank.set(null, status.text);
        }
    } catch (e) {
        System.alert(e.name + ':\n' + e.message);
        do_notpost = true;
    }
    return do_notpost;
});
AzureaVim = azvm_AzureaVim;
AzureaVim.commands_list = azvm_commands_list;
AzureaVim.prototype = {
    run: azvm_run
};

}());
AzureaUtil.mixin(AzureaVim.commands_list, {
    unshorten: 'unshorten',
    'うんしょｒてｎ': 'unshorten'
});
// :unshorten [option1]
// untiny.meのAPIを使用して、短縮urlを伸展します。inputBox中に伸展urlを表示します。
// 受信tweetが含む短縮urlは、事前に非同期で伸展urlを取得し、キャッシュしています（UIをblockしません）。
// 二度目以降の受信時には、初めから、伸展したurlをstatusに表示します。
// option1は、指定tweetが含むurlの番号（0から始まる自然数）です。
// option1を省略した場合、0を使用します。

// https://gist.github.com/835563
(function() {

var azvm_unshorten_services = [],
    azvm_unshorten_cashe = {
    'http://c4se.tk/': 'http://c4se.sakura.ne.jp/'
},
    azvm_postly_cashe = {
};


function resits_services(response) { // @param HttpResponce Object:
    azvm_unshorten_services = response.body.split(', ');
    azvm_unshorten_services.push('htn.to');
}
try {
    Http.sendRequestAsync('http://untiny.me/api/1.0/services/?format=text', true, resits_services);
} catch (err) {
}


function _isPossibleUnshorten(url) { // @param String: shortend URL
                                     // @return Boolean:
    var services = azvm_unshorten_services,
        i = services.length, is_possible = false;
    
    while (i--) {
        if (url.indexOf(services[i]) !== -1) {
            is_possible = true;
            break;
        }
    }
    return is_possible;
}


function _unshorten(url,     // @param String: shortened URL
                    async) { // @param Boolean=false:
                             // @return String: unshortened URL
    var cashe = azvm_unshorten_cashe, result = url;
    
    function callback_htnto(response) { // @param HttpResponce Object:
                                       // @return String:
        var result;
        
        response = response.header.match(/Location: ([^\n]+)\n/);
        cashe = response ? response[1] : url;
        result = response ? response[1] : url;
        cashe[url] = result;
        return result;
    }
    
    function callback(response) { // @param HttpResponce Object:
                                  // @return String:
        var result;
        
        result = /^error/.test(response.body) ? url : response.body;
        cashe[url] = result;
        return result;
    }
    
    if (cashe[url]) {
        result = cashe[url];
    } else if (url.indexOf('htn.to') !== -1) {
        if (async) {
            try {
                Http.sendRequestAsync(url, false, callback_htnto);
            } catch (err0) {
            }
        } else {
            try {
                result = callback_htly(Http.sendRequest(url, false));
            } catch (err1) {
            }
        }
    } else if (_isPossibleUnshorten(url)) {
        if (async) {
            try {
                Http.sendRequestAsync('http://untiny.me/api/1.0/extract/?url=' + url + '&format=text', false, callback);
            } catch (err2) {
            }
        } else {
            try {
                result = callback(Http.sendRequest('http://untiny.me/api/1.0/extract/?url=' + url + '&format=text', false));
            } catch (err3) {
            }
        }
    }
    return result;
}


function expand_postly(url,     // @param String: post.ly url
                       async) { // @param Boolean=false:
                                // @return String: post.ly text
    var cashe = azvm_postly_cashe,
        id = url.match(/^https?:\/\/post\.ly\/(.+)$/)[1],
        result = url;
    
    function callback(response) { // @param HttpResponce Object:
                                  // @return String:
        var text = response.body.match(/<body>([\s\S]*?)<\/body>/m)[1],
            _m;
        
        if (_m = text.match(/<!\[CDATA\[([\s\S]*?)\]\]>/m)) {
            text = _m[1].replace(/<\/(?:p|div|blockquote)>/g, '\n').replace(/<[\s\S]+?>/mg, '');
        }
        text += '\n' + url;
        cashe[id] = text;
        return text;
    }
    
    if (cashe[id]) {
        result = cashe[id];
    } else if (async) {
        try {
            Http.sendRequestAsync('http://posterous.com/api/getpost?id=' + id, false, callback);
        } catch (err0) {
        }
    } else {
        try {
            result = callback(Http.sendRequest('http://posterous.com/api/getpost?id=' + id, false));
        } catch (err1) {
        }
    }
    return result;
}


function azvm_unshorten() { // @return String: unshortened URL
    var url = this.status_urls[this.command[1] || 0],
        text;
    
    if (url.indexOf('post.ly') !== -1) {
        text = this.status_text.replace(url, expand_postly(url, false));
    } else {
        text = this.status_text.replace(url, _unshorten(url, false));
    }
    this.item.text = text;
}


TwitterService.addEventListener('preProcessTimelineStatus', function(status) { // @param Status Object:
    status.text = status.text.replace(/https?:\/\/[0-9A-Za-z._\-^~\/&%?]+/g,
                                      function(url) {
        var expanded;
        
        if (url.indexOf('post.ly') !== -1) {
            expanded = expand_postly(url, true);
        } else {
            expanded = _unshorten(url, true);
        }
        return expanded;
    });
});
AzureaVim.prototype.unshorten = azvm_unshorten;
AzureaVim.prototype.unshorten.unshorten = _unshorten;

}());
AzureaUtil.mixin(AzureaVim.commands_list, {
    open: 'open',
    o: 'open',
    'お': 'open',
    url: 'open url',
    'うｒｌ': 'open url'
});
// :open [option1 [option2]]
// Azurea内蔵のプレビューか、webブラウザで、urlを開きます。
// option1は、開くurlの種類（url, status, favstar等）です。
// option1を省略した場合、指定statusがurlを含めば0番目を、含まなければ、指定statusを開きます。

(function() {

var unshorten = AzureaVim.prototype.unshorten ?
                AzureaVim.prototype.unshorten.unshorten :
                function(url, async) {return url;};


function open(url) { // @param String: URI
    var previewurl;
    
    url = unshorten(url, true);
    previewurl = System.getPreviewUrl(url);
    if (previewurl) {
        System.showPreview(url, previewurl);
    } else {
        System.openUrl(url);
    }
}


function azvm_open() {
    var url;
    
    if (azvm_open.c1[this.command[1]]) {
        url = azvm_open.addresses[azvm_open.c1[this.command[1]]].call(this);
    } else {
        if (this.status_urls[0]) {
            url = this.status_urls[0];
        } else {
            url = 'https://twitter.com/' + this.screen_name + '/status/' + this.status_id;
        }
    }
    open(url);
};
azvm_open.c1 = {
    status: 'status',
    favstar: 'favstar',
    fav: 'favstar',
    f: 'favstar',
    favotter: 'favotter',
    favlook: 'favlook',
    twistar: 'twistar',
    favolog: 'favolog',
    twilog: 'twilog',
    user: 'user',
    u: 'user',
    url: 'url'
};
azvm_open.addresses = {
    status: function() {return 'https://twitter.com/' + this.screen_name + '/status/' + this.status_id;},
    favstar: function() {return 'http://favstar.fm/t/' + this.status_id;},
    favotter: function() {return 'http://favotter.net/status.php?id=' + this.status_id;},
    favlook: function() {return 'http://favlook.osa-p.net/status.html?status_id=' + this.status_id;},
    twistar: function() {return 'http://twistar.cc/' + this.screen_name + '/status/' + this.status_id;},
    twilog: function() {return 'http://twilog.org/' + (this.command[2] || this.screen_name);},
    user: function() {return 'http://twitter.com/' + (this.command[2] || this.screen_name);},
    url: function() {return this.status_urls[this.command[2] || 0];}
};

AzureaVim.prototype.open = azvm_open;

// https://gist.github.com/802965
System.addKeyBindingHandler(0xBE, // .
                            0,
                            function(status_id) {
    TwitterService.status.update(':o', status_id);
});

}());
AzureaUtil.mixin(AzureaVim.commands_list, {
    reply: 'reply',
    r: 'reply',
    'ｒ': 'reply',
    '@': 'reply',
    '＠': 'reply',
    quotetweet: 'reply quote',
    qt: 'reply quote',
    'ｑｔ': 'reply quote',
    mrt: 'reply mrt',
    'ｍｒｔ': 'reply mrt'
});
// :reply [option1 [option2 [option3]]]
// 指定tweetを元に、テンプレートに従ってTextAreaに記入する、QT用のコマンドです。
// 基本は、「:reply template "テンプレート" in_reply_toを付与するか否か」です。
// option1は、replyテンプレートの種類（template, all, qt, mrt等）です。
// option1を省略した場合、通常のreply（但しhashtagを引き継ぐ）テンプレートを選択します。


(function() {

function azvm_reply() {
    var has_in_reply_to,
        in_reply_to_status_id = this.status_id,
        expanded_template,
        redirect;
    
    function callback(response) {
        TextArea.text = expanded_template.text;
        TextArea.in_reply_to_status_id = (has_in_reply_to === true ? in_reply_to_status_id : 0);
        TextArea.show();
        TextArea.setFocus();
        TextArea.cursor = expanded_template.cursor;
    }
    
    if (this.command[1] === 'template') {
        has_in_reply_to = this.command[3] === 'true';
        expanded_template = AzureaUtil.template.expand(this.command[2], this);
        System.setTimeout(callback, 10);
    } else {
        redirect = azvm_reply.templates[azvm_reply.c1[this.command[1]]] ||
                   ["@#{screen_name} #{}#{status_hashes.length ? ' ' + status_hashes.join(' ') : ''}", true];
        if (typeof redirect === 'function') {
            redirect = redirect.call(this);
        }
        this.command = ['reply', 'template', redirect[0], redirect[1] ? 'true' : 'false'];
        azvm_reply.call(this);
    }
}

azvm_reply.c1 = {
    template: 'template',
    all: 'all',
    quote: 'quote',
    qt: 'quote',
    mrt: 'mrt',
    masirosiki: 'mrt'
};

azvm_reply.templates = {
    all: ["@#{screen_name + (status_users.length ? ' @' +status_users.join(' @') : '')} #{}", true],
    quote: ["@#{screen_name} #{} RT: #{status_text}", true],
    mrt: function() {
        var redirect;
        
        if (this.command[2] === 'f' || this.command[2] === 'fav' || this.command[2] === 'favstar') {
            redirect = ["#{} MRT: #{'http://favstar.fm/t/' + status_id}", false];
        } else {
            redirect = ["#{} MRT: #{'http://twitter.com/' + screen_name + '/status/' + status_id}", false];
        }
        return redirect;
    }
};

AzureaVim.prototype.reply = azvm_reply;


function reply(status_id) { // @param String:
                            // AzureaVim.prototype.replyと違い、同期処理で別途実装
    var status = TwitterService.status.get(status_id),
        status_user_screen_name = status.user.screen_name,
        status_hashtags = [];//status_hashtags = status.text.match(/#(?:(?:[A-Za-z0-9_]+)|(?:[^\s#]+_))/g);
    
    TwitterService.status.getHashes(status_id, status_hashtags);
    TextArea.text = '@' + status_user_screen_name + ' ' + (status_hashtags.length ? ' ' + status_hashtags.join(' ') : '');
    TextArea.in_reply_to_status_id = status_id;
    TextArea.show();
    TextArea.setFocus();
    TextArea.cursor = status_user_screen_name.length + 2;
}
System.addKeyBindingHandler(0x52, // VK_R
                            0,
                            reply);

}());
AzureaUtil.mixin(AzureaVim.commands_list, {
    retweet: 'retweet',
    rt: 'retweet',
    'ｒｔ': 'retweet'
});
// :retweet
// 指定statusをRetweetします。


AzureaVim.prototype.retweet = function() {
    AzureaUtil.retweet.create(this.status_id);
}
AzureaUtil.mixin(AzureaVim.commands_list, {
    settings: 'settings',
    setting: 'settings',
    'set': 'settings',
    'せｔ': 'settings',
    'get': 'settings',
    'げｔ': 'settings'
});
// :settings option1
// optinon1は、設定式です。
// 設定式は、
//     「iniセクション名::キー=値」
// 或いは
//     「iniセクション名::キー」
// の形を取ります。
// ex. :settings Misc :: FontSize
//     :settings Misc::EnableAutoRefresh=1
//
// :get option1
// option1は、設定式です。
// 設定式の「=値」は無視します。

AzureaVim.prototype.settings = function() {
    var figure, value;
    
    figure = this.command.slice(1).join('');
    figure = figure.split('::');
    figure = [figure[0]].concat(figure[1].split('='));
    if (/^(?:get|げｔ)/.test(this.command[0])) {
        figure.length = 2;
    }
    if (figure[2]) {
        System.settings.setValue(figure[0], figure[1], figure[2]);
        System.showNotice('Setting done: ' + figure[0] + '::' + figure[1] + '=' + figure[2]);
    } else {
        System.showNotice('Getting done: ' + figure[0] + '::' + figure[1] + '=' + System.settings.getValue(figure[0], figure[1]));
    }
    //System.settings.reconfigure();
}
AzureaUtil.mixin(AzureaVim.commands_list, {
    shindan: 'shindanmaker',
    'しんだｎ': 'shindanmaker'
});
// :shindan [option1]
// 該当statusが含む診断メーカーに問い合わせ、結果をTextAreaに記入します。
// option1は、診断する物の名前です。
// option1を省略した場合、自分のscreen nameで診断します。


// https://gist.github.com/831901
AzureaVim.prototype.shindanmaker = function() {
    var url, i = -1,
        _unshorten = this.unshorten ? this.unshorten.unshorten :
                                      function(url, async) {return url;};
    
    while (url = _unshorten(this.status_urls[++i], true)) {
        if (url.match('^http://shindanmaker.com/[0-9]+')) {
            break;
        }
    }
    if (url) {
        Http.postRequestAsync(url,
                              'u=' + encodeURI(this.command[1] || TwitterService.currentUser.screen_name),
                              false,
                              function(response) {
            response.body.match('<textarea.*?>(.*?)</textarea>');
            TextArea.text = RegExp.$1;
            TextArea.in_reply_to_status_id = 0;
            TextArea.show();
            TextArea.setFocus();
        });
    }
}
AzureaUtil.mixin(AzureaVim.commands_list, {
    translate: 'translate',
    ja: 'translate ja',
    'じゃ': 'translate ja'
});
// :translate [option1]
// Google翻訳APIで指定statusを翻訳します。
// option1は、翻訳先言語です。ISOの言語コードを指定します。
// option1がを省略した場合、jaへ翻訳します。

AzureaVim.prototype.translate = function() {
    var view = System.views.currentView,
        item = view.getItem(view.selectedItemId);
    
    function callback(response) { // @param HttpResponce Object:
        if (response.statusCode !== 200) {
            throw Error('Google Translate API Error. statusCode is ' + response.statusCode + '.');
        }
        item.text = response.body.match(/"translatedText"\s*:\s*"(.*)"/)[1];
        //response.body.match(/"detectedSourceLanguage"\s*:\s*"(.*)"/)[1] + '-> ' + this.command[1]
    }
    
    if (!this.command[1]) {
        this.command[1] = 'ja';
    }
    Http.sendRequestAsync('https://www.googleapis.com/language/translate/v2?key=' +
                          'AIzaSyCva1yUIFIBRqXOZDJ0nrbGbm0bz3FIksc' +
                          '&q=' +
                          encodeURI(this.status_text) +
                          '&target=' + this.command[1],
                          false,
                          callback);
}
AzureaUtil.mixin(AzureaVim.commands_list, {
    view: 'view',
    v: 'view',
    home: 'view home',
    'ほめ': 'view home',
    user: 'view user',
    'うせｒ': 'view user'
});
// :view option1 [option2]
// Azurea内のviewを移動します。
// option1は、移動先viewです。
// option1にuser, search, matchを指定した場合、option2を取ります。
// :v userで、option2を省略した場合は、指定statusから補完します。


AzureaVim.prototype.view = function() {
    switch (this.view.c1[this.command[1]]) {
    case 'home':
        System.views.openView(0);
        break;
    case 'mention':
        System.views.openView(1);
        break;
    case 'message':
        System.views.openView(2);
        break;
    case 'user':
        System.views.openView(5, this.command[2] || this.screen_name);
        break;
    case 'search':
        System.views.openView(4, this.command[2]);
        break;
    case 'favorite':
        System.views.openView(3);
        break;
    case 'match':
        System.views.openView(6, this.command[2]);
        break;
    case 'following':
        System.views.openView(8);
        break;
    case 'followers':
        System.views.openView(9);
        break;
    default:
        break;
    }
};
AzureaVim.prototype.view.c1 = {
    home: 'home',
    timeline: 'home',
    h: 'home',
    
    mention: 'mention',
    reply: 'mention',
    r: 'mention',
    m: 'mention',
    '@': 'mention',
    
    message: 'message',
    dm: 'message',
    d: 'message',
    
    user: 'user',
    u: 'user',
    
    search: 'search',
    
    favorite: 'favorite',
    fav: 'favorite',
    f: 'favorite',
    
    match: 'match',
    
    following: 'following',
    follow: 'following',
    
    followers: 'followers',
    follower: 'followers',
    followed: 'followers'
};
AzureaUtil.mixin(AzureaVim.commands_list, {
    earthquake: 'earthquake',
    jisin: 'earthquake',
    'えあｒｔｈくあけ': 'earthquake',
    'じしｎ': 'earthquake'
});
// :earthquake [set [option2]]
// チャーハン諸島風地震なう機能です。Ctrl+↓で、設定した文を、時刻付きでpostします。
// option1にsetを入れた場合、option2に投稿文を設定します。
// option2を省略した場合、inputBoxで、現在の設定投稿文を元に編集出来ます。


(function() {

if (!AzureaUtil.db.get('EarthquakeMessage')) {
    AzureaUtil.db.set('EarthquakeMessage', '地震なう #{Date()}');
}


function _getMessage(view) { // @param Hash:
                             // @return String:
    var result = AzureaUtil.db.get('EarthquakeMessage');
    
    if (view != null) { // not null or undefined
        result = AzureaUtil.template.expand(result, view).text;
    }
    return result;
}


function _setMessage(text) { // @param String:
                             // @return String:
    text = text || AzureaUtil.db.get('EarthquakeMessage');
    AzureaUtil.db.set('EarthquakeMessage', text);
    return text;
}


function setEarthquakeMessage() { // @return String:
    var text = System.inputBox('地震なう投稿文', _getMessage(), false);
    
    _setMessage(text);
    return text;
}


AzureaVim.prototype.earthquake = function() { // @return String:
    var result, geo;
    
    switch (this.command[1]) {
    case 'set':
        if (this.command[2]) {
            result = _setMessage(this.command[2]);
        } else {
            result = setEarthquakeMessage();
        }
        break;
    default:
        //if (GeoLocation.enabled) {
        //    geo = GeoLocation.current();
        //    this.geo = {
        //        lat: geo.latitude,
        //        lon: geo.longitude
        //    };
        //}
        TwitterService.status.update(_getMessage(this), 0);
        break;
    }
    return result;
}


System.addKeyBindingHandler(0x28, // VK_DOWN ↓
                            2, // Ctrl
                            function() {
    TwitterService.status.update(':earthquake', 0);
});

}());
AzureaUtil.mixin(AzureaVim.commands_list, {
    delay: 'delay',
    'でぁｙ': 'delay'
});
// :delay option1 option2
// 指定時間後にstatus updateします。
// option1はポストする時間です。
//   ^(?:(?:(\d{4})-)?(\d{1,2})-(\d{1,2}) )?(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?$
// 形式を記述した場合、setTimeeventを使い、指定時後にポストします。
// setTimeeventは、Azureaのセッションを越えて設定を保存、実行します（再起動しても有効です）。
// 其れ以外の記述であった場合、単一の数値と見做して、setTimeoutで指定時間経過後にpostします。
// option1が空白を含む場合、ダブルクオーテーションで囲って下さい。
// option2は、ポストする文です。空白を含められます。
// AzureaVimの仕様上、option2が:から始まる場合、AzureaVimのコマンドとして、該当コマンドが実行されます。
// 遅延投稿時のin_reply_to_status_idは、:delay実行時の物を使用します。

(function() {

if (AzureaUtil.db.get('DelayUseTwitDelay')) {
    AzureaUtil.db.set('DelayUseTwitDelay', '0');
}

function postTwitDelay(text,       // @param String:
                       time,       // @param String: RFC2822
                       callback) { // @param Function:
    Http.postRequestAsync('http://twitdelay.appspot.com/api/post',
                          'user_id=' + TwitterService.currentUser.id +
                          '&api_key=' + AzureaUtil.db.get('DelayTwitDelayApiKey') +
                          '&status=' + text +
                          '&at=' + time,
                          false,
                          callback);
}


AzureaVim.prototype.delay = function() {
    var regex_date = /^(?:(?:(\d{4})-)?(\d{1,2})-(\d{1,2}) )?(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?$/,
        m1, d, type;
    
    if (m1 = this.command[1].match(regex_date)) {
        var d = new Date();
        m1[1] && d.setFullYear(m1[1]);
        m1[2] && d.setMonth(m1[2] - 1);
        m1[3] && d.setDate(m1[3]);
        d.setHours(m1[4]);
        d.setMinutes(m1[5]);
        d.setSeconds(0);
        m1[6] && d.setSeconds(m1[6]);
        this.command[1] = d.getTime();
        type = 2;
        this.command[2] = this.command.slice(2).join(' ');
    } else {
        this.command[1] = new Date().getTime() + (this.command[1] - 0);
        type = 1;
        this.command[2] = this.command.slice(2).join(' ');
    }
    if (AzureaUtil.db.get('DelayUseTwitDelay')) {
        d = new Date(this.command[1]);
        postTwitDelay(this.command[2],
                      d.getUTCDate() + ' ' + d.getUTCMonth() + ' ' + d.getUTCFullYear() + ' ' + d.getUTCHours() + ':' + d.getUTCMinutes() + ':' + d.getUTCSeconds() + ' +0000',
                      function() {});
    } else {
        if (type === 1) {
            System.setTimeout((function(obj) {
                return function() {
                    TwitterService.status.update(obj.command[2], obj.status_id);
                }
            })(this),
                                       this.command[1] - new Date().getTime());
        } else {
            AzureaUtil.time.setTimeevent('function() {TwitterService.status.update("' + this.command[2] + '", "' + this.status_id + '");}',
                                         this.command[1]);
        }
    }
}

}());
AzureaUtil.mixin(AzureaVim.codelist, {
});
//


System.addKeyBindingHandler(0x43, // VK_C
                            2, // Ctrl
                            function(status_id) { // @param String:
    var text = TwitterService.status.get(status_id).text;
    
    System.clipboard = text;
    AzureaUtil.yank.set(null, text);
});
AzureaUtil.mixin(AzureaVim.commands_list, {
    notify: 'notify'
});
// :notify (pattern|growl [option2])|(when option2 [option3])
// WM ToastやGrowl for Windows等、様々な通知を設定するコマンドです。
// option1がpatternの場合、option2に、statusにマッチする正規表現を指定します。
// 正規表現は、前後に/を置いた場合、後者の/の後にオプションを指定出来ます。
// ex1.
//     AzureaVim|azureaVim|Azureavim|azureavim|azvm
// ex2.
//     /AzureaVim|azvm/i
// option2は必ずしもダブルクオーテーションで囲む必要は有りません。
// option2を省略すると、inputBoxにて正規表現を取得・設定出来ます。
// option1がgrowlの場合、Growl for Windows (via ApiProxy.rb)を使用するか否かを指定します。
// WMでは、此の設定を無視し、常にfalseと扱います。
// option2を省略すると、inputBoxにて真偽値を取得・設定出来ます。
// option1がwhenの場合、option2にfaved|mention|matchedを指定し、
// 其々の場合に通知するかをoption3にて指定します。
// option3を省略すると、inputBoxにて真偽値を取得・設定出来ます。

// https://gist.github.com/835993
(function() {

var pattern = AzureaUtil.db.get('NotifyPattern'),
    option = AzureaUtil.db.get('NotifyPatternOption'),
    regex = null,
    when = {
    Faved: AzureaUtil.db.get('NotifyWhenFaved'),
    Mention: AzureaUtil.db.get('NotifyWhenMention'),
    Matched: AzureaUtil.db.get('NotifyWhenMatched')
};

if (pattern) {
    regex = new RegExp(pattern, option);
}

function setMatchRegex(pattern,  // @param String='':
                       option) { // @param String='':
                                 // @return RegExp|null:
    option = option || '';
    if (pattern) {
        regex = new RegExp(pattern, option);
        AzureaUtil.db.set('NotifyPattern', pattern);
        AzureaUtil.db.set('NotifyPatternOption', option);
    } else {
        regex = null;
    }
    return regex;
}


function azvm_notify() {
    var pattern, option, when_opt;
    
    function _parse(pattern) { // @param String:
                               // @return Array: [pattern:String, option:String]
        var option, match = pattern.match(/^\/(.*)\/([a-zA-Z]*)$/);
        
        if (match) {
            pattern = match[1];
            option = match[2].toLowerCase();
        }
        return [pattern, option];
    }
    
    switch (azvm_notify.c1[this.command[1]]) {
    case 'pattern':
        pattern = this.command.slice(2).join(' ');
        if (pattern) {
            pattern = _parse(pattern);
            option = pattern[1];
            pattern = pattern[0];
        } else {
            pattern = AzureaUtil.db.get('NotifyPattern');
            option = AzureaUtil.db.get('NotifyPatternOption');
            pattern = _parse(System.inputBox('tweetにマッチさせる正規表現',
                                             option ? '/' + pattern + '/' + option : pattern,
                                             false));
            option = pattern[1];
            pattern = pattern[0];
        }
        setMatchRegex(pattern, option);
        break;
    case 'when':
        when_opt = azvm_notify.c2[this.command[2]];
        if (!when_opt) {
            throw Error('plugins/notify: No such option as NotifyWhen ' + this.command[2]);
        }
        when[when_opt] = (this.command[3] || System.inputBox('NotifyWhen' + when_opt, when[when_opt], true)) === '0' ?
                          '0' :
                          '1';
        AzureaUtil.db.set('NotifyWhen' + when_opt, when[when_opt]);
        break;
    case 'growl':
        AzureaUtil.db.set('NotifyUseGrowl',
                          (this.command[2] || System.inputBox('NotifyUseGrowl', AzureaUtil.db.get('NotifyUseGrowl'), true)) === '0' ?
                          '0' :
                          '1');
        break;
    }
}

azvm_notify.c1 = {
    pattern: 'pattern',
    when: 'when',
    growl: 'growl',
    gntp: 'growl'
};

azvm_notify.c2 = {
    faved: 'Faved',
    fav: 'Faved',
    f: 'Faved',
    
    mention: 'Mention',
    reply: 'Mention',
    r: 'Mention',
    '@': 'Mention',
    
    matched: 'Matched',
    match: 'Matched',
    m: 'Matched'
};

AzureaVim.prototype.notify = azvm_notify;

TwitterService.addEventListener('receiveFavorite',
                                function(source,          // @param User Object:
                                         target,          // @param User Object:
                                         target_object) { // @param Status Object:
    if (when.Faved) {
        AzureaUtil.notify('Favs@' + source.screen_name + ': ' + target_object.text,
                          'Favs - AzureaVim',
                          source.profile_image_url,
                          false);
    }
});

TwitterService.addEventListener('preFilterProcessTimelineStatus',
                                function(status) { // @param Ststus Object:
    var _when = when,
        text = status.text,
        user = status.user;
    
    if (_when.Mention && text.indexOf(TwitterService.currentUser.screen_name) !== -1) {
        AzureaUtil.notify('Mention@' + user.screen_name + ': ' + text,
                          'Mention - AzureaVim',
                          user.profile_image_url,
                          false);
    }
    if (_when.Matched && regex && regex.test(text)) {
        AzureaUtil.notify('Matches@' + user.screen_name + ': ' + text,
                          'Matched - AzureaVim',
                          user.profile_image_url,
                          false);
    }
});

}());
AzureaUtil.mixin(AzureaVim.commands_list, {
    tumblr: 'tumblr',
    'つｍｂｌｒ': 'tumblr'
});
// :tumblr [(when [(favorite | retweet) [option3]]) | (email [option2]) | (password [option2]) | (tags [option2])]
//

(function() {

var email = AzureaUtil.db.get('TumblrEmail'),
    password = AzureaUtil.db.get('TumblrPassword'),
    when = {
    Favorite: AzureaUtil.db.get('TumblrWhenFavorite') || '0',
    Retweet: AzureaUtil.db.get('TumblrWhenRetweet') || '0'
},
    tags = AzureaUtil.db.get('TumblrTags'),
    authenticated = false,
    AzureaUtil_favorite_addEventListener = AzureaUtil.favorite.addEventListener,
    AzureaUtil_favorite_removeEventListener = AzureaUtil.favorite.removeEventListener,
    AzureaUtil_retweet_addEventListener = AzureaUtil.retweet.addEventListener,
    AzureaUtil_retweet_removeEventListener = AzureaUtil.retweet.removeEventListener;


function authenticate_tumblr(email,      // @param String:
                             password) { // @param String:
    function callback(response) {
        if (200 <= response.statusCode || response.statusCode < 300) {
            authenticated = true;
        } else {
            authenticated = false;
        }
    }
    
    Http.postRequestAsync('https://www.tumblr.com/api/authenticate',
                          'email=' + email +
                          '&password=' + password,
                          false,
                          callback);
}
authenticate_tumblr(email, password);


function write_tumblr(email,      // @param String:
                      password,   // @param String:
                      type,       // @param String:
                      post,       // @param Hash:
                      option,     // @param Hash=null:
                      callback) { // @param Function: callback(HttpResponce Object)
    function hash_to_poststring(hash) { // @param Hash:
                                        // @return String:
        var key, result = [];
        
        for (key in hash) {
            if (hash.hasOwnProperty(key)) {
                result.push(key + '=' + encodeURI(hash[key]));
            }
        }
        return result.join('&');
    }
    
    Http.postRequestAsync('https://www.tumblr.com/api/write',
                          'email=' + email +
                          '&password=' + password +
                          '&type=' + type +
                          '&' + hash_to_poststring(post) +
                          (option ? '&' + hash_to_poststring(option) : ''),
                          false,
                          callback);
}


function write_status_to_tumblr(status) { // @param Status Object:
    if (!status.user.protected_) {
        write_tumblr(email, password, 'quote',
                     {quote: status.text,
                      source: '<a href="http://twitter.com/' +
                              status.user.screen_name + '/status/' +
                              status.id +'">Twitter/@' +
                              status.user.name + ': </a>'},
                     {generator: 'AzureaVim',
                      tags: tags},
                     function(response) {
            if (response.statusCode < 200 && 300 <= response.statusCode) {
                throw Error('plugins/tumblr: Cannot create post. (statusCode=' + response.statusCode + ')');
            }
        });
    } else {
        throw Error('plugins/tumblr: ' + status.user.screen_name + ' is protected_.');
    }
}


if (when.Favorite === '1') {
    AzureaUtil_favorite_addEventListener('postCreateFavorite', write_status_to_tumblr);
}
if (when.Retweet === '1') {
    AzureaUtil_retweet_addEventListener('postRetweetFavorite', write_status_to_tumblr);
}


function azvm_tumblr() {
    var when_opt;
    
    switch (azvm_tumblr.c1[this.command[1]]) {
    case 'when':
        when_opt = azvm_tumblr.c2[this.command[2]];
        if (!when_opt) {
            throw Error('plugins/tumblr: No such option as TumblrWhen ' + this.command[2]);
        }
        when[when_opt] = (this.command[3] || System.inputBox('TumblrWhen' + when_opt, when[when_opt], true)) === '1' ?
                          '1' :
                          '0';
        AzureaUtil.db.set('TumblrWhen' + when_opt, when[when_opt]);
        if (when.Favorite === '1') {
            AzureaUtil_favorite_addEventListener('postCreateFavorite', write_status_to_tumblr);
        } else {
            AzureaUtil_favorite_removeEventListener('postCreateFavorite', write_status_to_tumblr);
        }
        if (when.Retweet === '1') {
            AzureaUtil_retweet_addEventListener('postCreateRetweet', write_status_to_tumblr);
        } else {
            AzureaUtil_retweet_removeEventListener('postCreateRetweet', write_status_to_tumblr);
        }
        break;
    case 'email':
        email = this.command[2] || System.inputBox('TumblrEmail', email, true);
        AzureaUtil.db.set('TumblrEmail', email);
        authenticate_tumblr(email, password);
        break;
    case 'password':
        password = this.command[2] || System.inputBox('TumblrPassword', password, true);
        AzureaUtil.db.set('TumblrPassword', password);
        authenticate_tumblr(email, password);
        break;
    case 'tags':
        tags = this.command[2] || System.inputBox('TumblrTags', tags, false);
        AzureaUtil.db.set('TumblrTags', tags);
        break;
    default:
        if (!authenticated) {
            throw Error('plugins/tumblr: Authenticate your email & password.');
        }
        write_status_to_tumblr(this.status);
        break;
    }
}

azvm_tumblr.c1 = {
    when: 'when',
    email: 'email',
    password: 'password',
    tags: 'tags',
    tag: 'tags'
};

azvm_tumblr.c2 = {
    favorite: 'Favorite',
    fav: 'Favorite',
    f: 'Favorite',
    retweet: 'Retweet',
    rt: 'Retweet'
};

AzureaVim.prototype.tumblr = azvm_tumblr;

}());
