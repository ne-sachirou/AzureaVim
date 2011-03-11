AzureaUtil.mixin(AzureaVim.commands_list, {
    earthquake: 'earthquake',
    jisin: 'earthquake',
    'えあｒｔｈくあけ': 'earthquake',
    'じしｎ': 'earthquake'
});
// :earthquake [set option2]
// チャーハン諸島風地震なう機能です。Ctrl+↓で、設定した文を、時刻付きでpostします。
// option1にsetを入れた場合、option2に投稿文を設定します。


(function() {

var _message = System.settings.getValue('user.AzureaVim', 'EarthquakeMessage');

if (_message === '') {
    System.settings.setValue('user.AzureaVim', 'EarthquakeMessage', '地震なう');
    _message = '地震なう #{new Date().toString()}';
}


function _getMessage() { // @return String:
    return AzureaUtil.template.expand(_message).text;
}


function _setMessage(text) { // @param String:
                             // @return String:
    text = text || _message;
    System.settings.setValue('user.AzureaVim', 'EarthquakeMessage', text);
    _message = text;
    return text;
}


function setEarthquakeMessage() { // @return String:
    var text = System.inputBox('地震なう投稿文', _getMessage(), false);
    
    _setMessage(text);
    return text;
}


function postEarthquakeMessage() { // @return String:
    var text = _getMessage(),
        isDisableGPS = System.settings.getValue('Location', 'DisableGPS');
    
    if (isDisableGPS) {
        System.settings.setValue('Location', 'DisableGPS', '0');
    }
    TwitterService.status.update(text, 0);
    if (isDisableGPS) {
        System.settings.setValue('Location', 'DisableGPS', '1');
    }
    return text;
}


AzureaVim.prototype.earthquake = function() { // @return String:
    var result,
        isDisableGPS = System.settings.getValue('Location', 'DisableGPS');
    
    switch (this.command[1]) {
    case 'set':
        result = _setMessage(this.command[2]);
        break;
    default:
        AzureaUtil.event.addEventListener('PreSendUpdateStatus', postEarthquakeMessage);
        TwitterService.status.update(_getMessage(), 0);
        AzureaUtil.event.removeEventListener('PreSendUpdateStatus', postEarthquakeMessage);
        break;
    }
    return result;
}


System.addContextMenuHandler('地震なう設定', 0, setEarthquakeMessage);
System.addKeyBindingHandler(0x28, // VK_DOWN ↓
                            2, // Ctrl
                            function() {
    TwitterService.status.update(':earthquake', 0);
});

})();