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
//{@test
(function() {
    var i = 100000;
    while (--i) {
        var num = Math.floor(Math.random() * Date.now()),
            sgn = Math.floor(Math.random() * 2) ? 1 : -1,
            d = new Date(sgn * num),
            s1 = toISOString.call(d),
            s2 = d.toISOString();
        
        if (s1 !== s2) {
            throw Error(s1 + '!==' + s2);
        }
    }
    return true;
}());
//}@test