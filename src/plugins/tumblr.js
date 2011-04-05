AzureaUtil.mixin(AzureaVim.commands_list, {
    tumblr: 'tumblr',
    'つｍｂｌｒ': 'tumblr'
});
// :tumblr [(when [(favorite | retweet) [option3]]) | (email [option2]) | (password [option2])]
//

(function() {

var email = AzureaUtil.db.get('TumblrEmail'),
    password = AzureaUtil.db.get('TumblrPassword'),
    when = {
    favorite: AzureaUtil.db.get('TumblrWhenFavorite'),
    retweet: AzureaUtil.db.get('TumblrWhenRetweet')
},
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
        }
    }
    
    Http.postRequestAsync('https://www.tumblr.com/api/authenticate',
                          'email=' + email +
                          '&password=' + password,
                          false,
                          callback);
}


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


function wtite_status_to_tumblr(status) { // @param Status Object:
    write_tumblr(email, password, 'quote',
                 {quote: status.text,
                  source: '<a href="http://twitter.com/' + status.user.screen_name + '/' + status.id + '"></a>'},
                 {generator: 'AzureaVim',
                  tags: ''}
                 function(response) {
        if (response.statusCode < 200 && 300 <= response.statusCode) {
            throw Error('plugins/tumblr: Cannot create post. (statusCode=' + response.statusCode + ')');
        }
    });
}


if (when.favorite) {
    AzureaUtil_favorite_addEventListener('postCreateFavorite', wtite_status_to_tumblr);
}
if (when.retweet) {
    AzureaUtil_retweet_addEventListener('postRetweetFavorite', wtite_status_to_tumblr);
}


function azvm_tumblr() {
    var when_opt;
    
    switch (azvm_tumblr.c1[this.command[1]]) {
    case 'when':
        when_opt = azvm_tumblr.c2[this.command[2]];
        if (!when_opt) {
            throw Error('plugins/tumblr: No such option as TumblrWhen ' + this.command[2]);
        }
        when[when_opt] = (this.command[3] || System.inputBox('TumblrWhen' + when_opt, when[when_opt])) === '0' ?
                          '0' :
                          '1';
        AzureaUtil.db.set('TumblrWhen' + when_opt, when[when_opt]);
        if (when.favorite) {
            AzureaUtil_favorite_addEventListener('postCreateFavorite', wtite_status_to_tumblr);
        } else {
            AzureaUtil_favorite_removeEventListener('postCreateFavorite', wtite_status_to_tumblr);
        }
        if (when.retweet) {
            AzureaUtil_retweet_addEventListener('postRetweetFavorite', wtite_status_to_tumblr);
        } else {
            AzureaUtil_retweet_removeEventListener('postRetweetFavorite', wtite_status_to_tumblr);
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
    default:
        if (!authenticated) {
            throw Error('plugins/tumblr: Authenticate your email & password.');
        }
        wtite_status_to_tumblr({
            text: this.status_text,
            id: this.status_id,
            user: {
                screen_name: this.screen_name
            }
        });
        break;
    }
}

azvm_tumblr.c1 = {
    when: 'when',
    email: 'email',
    password: 'password'
};

azvm_tumblr.c2 = {
    favorite: 'Favorite',
    fav: 'Favorite',
    f: : 'Favorite',
    retweet: 'Retweet',
    rt: 'Retweet'
};

AzureaVim.prototype.tumblr = azvm_tumblr;

})();