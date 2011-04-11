AzureaUtil.mixin(AzureaVim.commands_list, {
    earthquake: 'earthquake',
    jisin: 'earthquake',
    'えあｒｔｈくあけ': 'earthquake',
    'じしｎ': 'earthquake'
});
// :earthquake [set [option2]]
// チャーハン諸島風地震なう機能です。Ctrl+↓で、設定した文を、時刻付きでpostします。
// option1にsetを入れた場合、option2に投稿文を設定します。
// option2を省略した場合、inputBoxで、現在の設定投稿文を元に編集出来ます。


(function() {

if (!AzureaUtil.db.get('EarthquakeMessage')) {
    AzureaUtil.db.set('EarthquakeMessage', '地震なう #{Date()}');
}


function _getMessage(view) { // @param Hash:
                             // @return String:
    var result = AzureaUtil.db.get('EarthquakeMessage');
    
    if (view != null) { // not null or undefined
        result = AzureaUtil.template.expand(result, view).text;
    }
    return result;
}


function _setMessage(text) { // @param String:
                             // @return String:
    text = text || AzureaUtil.db.get('EarthquakeMessage');
    AzureaUtil.db.set('EarthquakeMessage', text);
    return text;
}


function setEarthquakeMessage() { // @return String:
    var text = System.inputBox('地震なう投稿文', _getMessage(), false);
    
    _setMessage(text);
    return text;
}


AzureaVim.prototype.earthquake = function() { // @return String:
    var result, geo;
    
    switch (this.command[1]) {
    case 'set':
        if (this.command[2]) {
            result = _setMessage(this.command[2]);
        } else {
            result = setEarthquakeMessage();
        }
        break;
    default:
        //if (GeoLocation.enabled) {
        //    geo = GeoLocation.current();
        //    this.geo = {
        //        lat: geo.latitude,
        //        lon: geo.longitude
        //    };
        //}
        TwitterService.status.update(_getMessage(this), 0);
        break;
    }
    return result;
}


System.addKeyBindingHandler(0x28, // VK_DOWN ↓
                            2, // Ctrl
                            function() {
    TwitterService.status.update(':earthquake', 0);
});

}());