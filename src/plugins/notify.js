AzureaUtil.mixin(AzureaVim.codelist, {
});
//

// https://gist.github.com/835993
(function() {

var MATCH = /さっちゃ|c4se|ももん|もんが|opera|azurea/i;

AzureaUtil.event.addEventListener('ReceiveFavorite',
                                  function(source,          // @param User Object:
                                           target,          // @param User Object:
                                           target_object) { // @param Status Object:
    AzureaUtil.notify('Favs@' + source.screen_name + ': ' + target_object.text,
                      'Favs',
                      source.screen_name,
                      false);
});

AzureaUtil.event.addEventListener('PreFilterProcessTimelineStatus',
                                  function(status) { // @param Ststus Object:
    if (status.text.indexOf(System.currentUser.screen_name) !== -1) {
        AzureaUtil.notify('Mention@' + status.user.screen_name + ': ' + status.text,
                          'Mention',
                          status.user.screen_name,
                          true);
    }
    if (MATCH.test(status.text)) {
        AzureaUtil.notify('Matched@' + status.user.screen_name + ': ' + status.text,
                          'Matched',
                          status.user.screen_name,
                          false);
    }
});

})();