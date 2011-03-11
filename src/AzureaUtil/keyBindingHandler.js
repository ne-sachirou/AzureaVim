AzureaUtil.key = {};

// ======================================== key ========================================
var defaultKeyBindingHandler = [[], [], [], [], [], [], [], []],
    keyBindingHandler = [[], [], [], [], [], [], [], []];

// H
defaultKeyBindingHandler[0][0x48] = function(status_id) {
    //System.views.scrollTo()
}

// J
defaultKeyBindingHandler[0][0x4A] = function(status_id) {
    
}

// K
defaultKeyBindingHandler[0][0x4B] = function(status_id) {
    
}

// L
defaultKeyBindingHandler[0][0x4C] = function(status_id) {
    
}

// R
defaultKeyBindingHandler[0][0x52] = function(status_id) {
    var status = TwitterService.status.get(status_id),
        status_user_screen_name = status.user.screen_name;
    
    TextArea.text = '@' + status_user_screen_name + ' ';
    TextArea.in_reply_to_status_id = status_id;
    TextArea.show();
    TextArea.setFocus();
    TextArea.setCursor(status_user_screen_name.length + 2);
}

// T
defaultKeyBindingHandler[0][0x54] = function(status_id) {
    var status = TwitterService.status.get(status_id);
    
    if (System.settings.getValue('Misc', 'UseQT')) {
        TextArea.text = 'RT @' + status.user.screen_name + ': ' + status.text;
        TextArea.show();
        TextArea.setFocus();
    } else {
        //if (System.showMessage('確認', '選択項目をリツイートします。よろしいですか？', 0)) {
            TwitterService.retweet.create(status_id);
        //}
    }
}

// W
defaultKeyBindingHandler[0][0x57] = function(status_id) {
    var status = TwitterService.status.get(status_id);
    
    if (System.settings.getValue('Misc', 'UseQT')) {
        //if (System.showMessage('確認', '選択項目をリツイートします。よろしいですか？', 0)) {
            TwitterService.retweet.create(status_id);
        //}
    } else {
        TextArea.text = 'RT @' + status.user.screen_name + ': ' + status.text;
        TextArea.show();
        TextArea.setFocus();
    }
}

// G
defaultKeyBindingHandler[0][0x47] = function() {
    var handlers_list = {
        'F': function() {
            System.views.openFavorite();
            reset();
        },
        'W': function() {
            
            reset();
        }
    },
        key;
    
    function reset() {
        var key, list = handlers_list;
        
        for (key in list) {
            removeKeyBindingHandler(key.charCodeAt(0), 0, handlers_list[key]);
        }
    }
    
    for (key in handlers_list) {
        addKeyBindingHandler(key.charCodeAt(0), 0, handlers_list[key]);
    }
}

// M
defaultKeyBindingHandler[0][0x4D] = function() {
    System.views.callMore();
}

// Space
defaultKeyBindingHandler[0][0x20] = function() {
    System.views.callRefresh();
}

// /
defaultKeyBindingHandler[0][0xBF] = function() {
    System.views.quickFilter();
}

// 0
// F
defaultKeyBindingHandler[0][0x30] =
defaultKeyBindingHandler[0][0x46] = function(status_id) {
    if (TwitterService.status.get(status_id).favorite)
        TwitterService.favorite.destroy(status_id);
    } else {
        TwitterService.favorite.create(status_id);
    }
}

// 1
defaultKeyBindingHandler[0][0x31] = function() {
    System.views.openTimeline();
}

// 2
defaultKeyBindingHandler[0][0x32] = function() {
    System.views.openMention();
}

// 3
defaultKeyBindingHandler[0][0x33] = function() {
    System.views.openMessage();
}


function addKeyBindingHandler(vkcode,    // @param Number:
                              optionkey, // @param Number: Shift = 1
                                         //                Ctrl = 2
                                         //                Alt = 4
                              handler) { // @param Function:
    keyBindingHandler[optionkey][vkcode] = handler;
}


function removeKeyBindingHandle(vkcode,
                                optionkey){
    keyBindingHandler[optionkey][vkcode] = defaultKeyBindingHandler[optionkey][vkcode];
}


mixin(AzureaUtil.key, {
    'addKeyBindingHandle': addKeyBindingHandle,
    'removeKeyBindingHandle': removeKeyBindingHandle
});