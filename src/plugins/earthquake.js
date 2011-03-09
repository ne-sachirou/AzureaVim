// ==AzureaScript==
// @name 地震なう
// @author http://c4se.sakura.ne.jp/profile/ne.html
// @date 2011-03-10
// @scriptUrl https://github.com/ne-sachirou/AzureaVim/raw/master/src/plugins/
// @license public domain
// ==/AzureaScript==

try {
    AzureaUtil.mixin(AzureaVim.commands_list, {
        earthquake: 'earthquake',
        e: 'earthquake',
        jisin: 'earthquake',
        'え': 'earthquake',
        'じしん': 'earthquake'
    });
} catch (err) {}
// :earthquake [set option2]
// チャーハン諸島風地震なう機能です。Ctrl+↓で、設定した文を、時刻付きでpostします。
// AzureaVim pluginとして丈でなく、単独のAzureaScriptとして使えます（其の場合コマンド機能は使用出来ません）。
// option1にsetを入れた場合、投稿文を設定します。


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


function postEarthquakeMessage() { // @return String:
    var text = _getMessage() + ' ' + (new Date()).toString();
    
    TwitterService.status.update(text, 0);
    return text;
}


System.addContextMenuHandler('地震なう設定', 0, setEarthquakeMessage);
System.addKeyBindingHandler(0x28, // VK_DOWN ↓
                            2, // Ctrl
                            postEarthquakeMessage);
try {
    AzureaVim.prototype.earthquake = function() { // @return String:
        var result;
        
        switch (this.command[1]) {
        case 'set':
            result = _setMessage(this.command[2]);
            break;
        default:
            result = postEarthquakeMessage();
            break;
        }
        return result;
    }
} catch (err) {}

})();