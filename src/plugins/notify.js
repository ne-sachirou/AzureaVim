AzureaUtil.mixin(AzureaVim.codelist, {});
//

// https://gist.github.com/835993
(function() {

var MATCH = /さっちゃ|c4se|ももん|もんが|opera|azurea/i;

AzureaUtil.event.addEventListener('ReceiveFavorite', function(source,          // @param User Object:
                                                              target,          // @param User Object:
                                                              target_object) { // @param Status Object:
    _notify('Favs@' + source.screen_name + ': ' + target_object.text, source.screen_name, false);
});

AzureaUtil.event.addEventListener('PreFilterProcessTimelineStatus', function(status) { // @param Ststus Object:
    if (status.text.indexOf(System.currentUser.screen_name) !== -1) {
        _notify('Mention@' + status.user.screen_name + ': ' + status.text, status.user.screen_name, true);
    }
    if (MATCH.test(status.text)) {
        _notify('Matched@' + status.user.screen_name + ': ' + status.text, status.user.screen_name, false);
    }
});

})();