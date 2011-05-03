function mixin(hash1,       // @param Hash: target
	           hash2,       // @param Hash: source
	           overwrite) { // @param Boolean=true: Force overwrite or not.
    var key;
    
    if (overwrite == null) { // null or undefined
        overwrite = true;
    }
    for (key in hash2) {
	    if (hash2.hasOwnProperty(key)) {
            if (overwrite || typeof hash1[key] === 'undefined') {
                hash1[key] = hash2[key];
            }
	    }
    }
}

Util.mixin = mixin;    
