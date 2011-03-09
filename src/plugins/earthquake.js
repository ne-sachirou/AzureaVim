// ==AzureaScript==
// @name 地震なう
// @author http://c4se.sakura.ne.jp/profile/ne.html
// @date 2011-03-09
// @scriptUrl https://github.com/ne-sachirou/AzureaVim/raw/master/src/plugins/
// @license public domain
// ==/AzureaScript==


(function() {

var _message = System.settings.getValue('user.Earthquake', 'Message');

if (_message === '') {
    System.settings.setValue('user.Earthquake', 'Message', '地震なう');
    _message = '地震なう';
}

function _getMessage() { // @return String:
    return _message;
}

function _setMessage(text) { // @param String:
                             // @return String:
    text = text || _message;
    System.settings.setValue('user.Earthquake', 'Message', text);
    _message = text;
    return text;
}


function setEarthquakeMessage() { // @return String:
    var text = System.inputBox('地震なう投稿文', _getMessage(), false);
    
    _setMessage(text);
    return text;
}


function postEarthquake() { // @return String:
    var text = _getMessage() + ' ' + (new Date()).toString();
    
    TwitterService.status.update(text, 0);
    return text;
}


System.addContextMenuHandler('地震なう設定', 0, setEarthquakeMessage);
System.addKeyBindingHandler(0x28, // VK_DOWN
                            2, // Ctrl
                            postEarthquake);


try {
    AzureaVim.prototype.earthquake = function() { // @return String:
        var result;
        
        switch (this.command[1]) {
        case 'set':
            result = setEarthquakeMessage();
            break;
        default:
            result = postEarthquake();
            break;
        }
        return result;
    }
    AzureaUtil.mixin(AzureaVim.commands_list, {
        earthquake: 'earthquake',
        e: 'earthquake'
    });
} catch (err) {}

})();