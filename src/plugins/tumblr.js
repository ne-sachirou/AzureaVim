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