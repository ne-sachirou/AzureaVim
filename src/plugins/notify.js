// ==AzureaScript==
// @author http://c4se.sakura.ne.jp/profile/ne.html
// @scriptUrl http://c4se.sakura.ne.jp/widgets/azurea/
// @date 2011-03-18
// @site https://gist.github.com/835993
// @license public domain
// ==/AzureaScript==


var HTTP_GNTP_SERVER = 'http://localhost:10080/gntp',
    USE_GROWL = true,
    MATCH = /さっちゃ|c4se|ももん|もんが|opera|azurea/i,
    _notify_native, _notify;

if (System.apiLevel >= 12) {
    _notify_native = function(text) { // @param String:
        System.isActive ? System.showNotice(text) :
                          System.showMessage(text, text, 0x100000);
    }
} else {
    _notify_native =  function(text) { // @param String:
        System.showNotice(text);
    }
}


function _notify_growl(title,        // @param String:
                       text,         // @param Strong:
                       screen_name,  // @param String:
                       sticky)     { // @param Boolean=false:
    System.postRequestAsync(HTTP_GNTP_SERVER,
                            'title=' + title +
                            '&text=' + text +
                            '&twitter_screen_name=' + screen_name +
                            (sticky ? '&sticky=on' : ''),
                            false,
                            function(response) {
        var re = eval(response.body);
        
        if (re.error) {
            System.alert(response.body);
            _notify_native(re.request.text);
        }
    });
}


function _notify(text,         // @param String:
                 screen_name,  // @param String:
                 sticky)     { // @param Boolean=false:
    //try {
        USE_GROWL ? _notify_growl('Faved', text, screen_name, sticky) : _notify_native(text);
    //} catch (err) {
    //    _notify_native(text);
    //}
}


function ReceiveFavorite(source,          // @param User Object:
                         target,          // @param User Object:
                         target_object) { // @param Status Object:
    _notify('Favs@' + source.screen_name + ': ' + target_object.text, source.screen_name, false);
}


function PreFilterProcessTimelineStatus(status) { // @param Ststus Object:
    if (status.text.indexOf(System.currentUser.screen_name) !== -1) {
        _notify('Mention@' + status.user.screen_name + ': ' + status.text, status.user.screen_name, true);
    }
    if (MATCH.test(status.text)) {
        _notify('Matched@' + status.user.screen_name + ': ' + status.text, status.user.screen_name, false);
    }
}