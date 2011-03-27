AzureaUtil.mixin(AzureaVim.commands_list, {
    notify: 'notify'
});
// :notify (pattern|growl [option2])|(when option2 [option3])
// WM ToastやGrowl for Windows等、様々な通知を設定するコマンドです。
// option1がpatternの場合、option2に、statusにマッチする正規表現を指定します。
// 正規表現は、前後に/を置いた場合、後者の/の後にオプションを指定出来ます。
// ex1.
//     AzureaVim|azureaVim|Azureavim|azureavim|azvm
// ex2.
//     /AzureaVim|azvm/i
// option2は必ずしもダブルクオーテーションで囲む必要は有りません。
// option2を省略すると、inputBoxにて正規表現を取得・設定出来ます。
// option1がgrowlの場合、Growl for Windows (via ApiProxy.rb)を使用するか否かを指定します。
// WMでは、此の設定を無視し、常にfalseと扱います。
// option2を省略すると、inputBoxにて真偽値を取得・設定出来ます。
// option1がwhenの場合、option2にfaved|mention|matchedを指定し、
// 其々の場合に通知するかをoption3にて指定します。
// option3を省略すると、inputBoxにて真偽値を取得・設定出来ます。

// https://gist.github.com/835993
(function() {

var pattern = AzureaUtil.db.get('NotifyPattern'),
    option = AzureaUtil.db.get('NotifyPatternOption'),
    regex = null,
    when = {
    faved: AzureaUtil.db.get('NotifyWhenFaved'),
    mention: AzureaUtil.db.get('NotifyWhenMention'),
    matched: AzureaUtil.db.get('NotifyWhenMatched')
};

if (pattern) {
    regex = new RegExp(pattern, option);
}

function setMatchRegex(pattern,  // @param String='':
                       option) { // @param String='':
                                 // @return RegExp|null:
    option = option || '';
    if (pattern) {
        regex = new RegExp(pattern, option);
        AzureaUtil.db.set('NotifyPattern', pattern);
        AzureaUtil.db.set('NotifyPatternOption', option);
    } else {
        regex = null;
    }
    return regex;
}


AzureaVim.prototype.notify = function() {
    var pattern, option, when,
        c1 = {
        pattern: 'pattern',
        when: 'when',
        growl: 'growl',
        gntp: 'growl'
    },
        c2 = {
        faved: 'Faved',
        fav: 'Faved',
        f: 'Faved',
        
        mention: 'Mention',
        reply: 'Mention',
        r: 'Mention',
        '@': 'Mention',
        
        matched: 'Matched',
        match: 'Matched',
        m: 'Matched'
    };
    
    function _parse(pattern) { // @param String:
                               // @return Array: [pattern:String, option:String]
        var option, match = pattern.match(/^\/(.*)\/([a-zA-Z]*)$/);
        
        if (match) {
            pattern = match[1];
            option = match[2].toLowerCase();
        }
        return [pattern, option];
    }
    
    switch (c1[this.command[1]]) {
    case 'pattern':
        pattern = this.command.slice(2).join(' ');
        if (pattern) {
            pattern = _parse(pattern);
            option = pattern[1];
            pattern = pattern[0];
        } else {
            pattern = AzureaUtil.db.get('NotifyPattern');
            option = AzureaUtil.db.get('NotifyPatternOption');
            pattern = _parse(System.inputBox('tweetにマッチさせる正規表現',
                                             option ? '/' + pattern + '/' + option : pattern,
                                             false));
            option = pattern[1];
            pattern = pattern[0];
        }
        setMatchRegex(pattern, option);
        break;
    case 'when':
        when = c2[this.command[2]];
        AzureaUtil.db.set('NotifyWhen' + when,
                          (this.command[3] || System.inputBox(when, AzureaUtil.db.get('NotifyWhen' + when), true)) ? '1' : '0');
        break;
    case 'growl':
        AzureaUtil.db.set('NotifyUseGrowl',
                          (this.command[2] || System.inputBox('NotifyUseGrowl', AzureaUtil.db.get('NotifyUseGrowl'), true)) ? '1' : '0');
        break;
    }
};

AzureaUtil.event.addEventListener('ReceiveFavorite',
                                  function(source,          // @param User Object:
                                           target,          // @param User Object:
                                           target_object) { // @param Status Object:
    if (when.faved) {
        AzureaUtil.notify('Favs@' + source.screen_name + ': ' + target_object.text,
                          'Favs - AzureaVim',
                          source.profile_image_url,//source.screen_name,
                          false);
    }
});

AzureaUtil.event.addEventListener('PreFilterProcessTimelineStatus',
                                  function(status) { // @param Ststus Object:
    var _when = when,
        text = status.text,
        user = status.user;
    
    if (_when.mention && text.indexOf(TwitterService.currentUser.screen_name) !== -1) {
        AzureaUtil.notify('Mention@' + user.screen_name + ': ' + text,
                          'Mention - AzureaVim',
                          user.profile_image_url,//user.screen_name,
                          false);
    }
    if (_when.matched && regex && regex.test(text)) {
        AzureaUtil.notify('Matches@' + user.screen_name + ': ' + text,
                          'Matched - AzureaVim',
                          user.profile_image_url,//user.screen_name,
                          false);
    }
});

})();