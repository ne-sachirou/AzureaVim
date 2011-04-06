var retweet_events_list = {
    preCreateRetweet: [],
    postCreateRetweet: []
};


function retweet_addEventListener(eventname,  // @param String: preCreateRetweet
                                              //                postCreateRetweet
                                  callback) { // @param Function: callback(Status Object)
                                              //                  When return true in preCreateRetweet, stop to create retweet.
    var events_list = retweet_events_list[eventname],
        i = -1;
    
    if (events_list) {
        while (events_list[++i]) {
            if (events_list[i] === callback) {
                events_list.splice(i, 1);
            }
        }
        events_list.push(callback);
    }
}


function retweet_removeEventListener(eventname,  // @param String: preCreateRetweet
                                                 //                postCreateRetweet
                                     callback) { // @param Function:
    var events_list = retweet_events_list[eventname],
        i = -1;
    
    while (events_list[++i]) {
        if (events_list[i] === callback) {
            events_list.splice(i, 1);
            break;
        }
    }
}


function retweet_create(status_id) { // @param String; status id
    var status = TwitterService.status.get(status_id),
        pre_create_list = retweet_events_list.preCreateRetweet,
        post_create_list = retweet_events_list.postCreateRetweet,
        is_create_rt = false,
        i = -1;
    
    while (pre_create_list[++i]) {
        is_create_rt = pre_create_list[i](status) || is_create_rt;
    }
    if (!is_create_rt) {
        TwitterService.retweet.create(status_id);
        i = -1;
        while (post_create_list[++i]) {
            post_create_list[i](status);
        }
    }
}


System.addKeyBindingHandler(0x54, // VK_T
                            0,
                            function(status_id) {
    var status = TwitterService.status.get(status_id);
    
    if (System.settings.getValue('Misc', 'UseQT')) {
        TextArea.text = 'RT @' + status.user.screen_name + ': ' + status.text;
        TextArea.show();
        TextArea.setFocus();
    } else {
        if (System.showMessage('選択項目をリツイートします。よろしいですか？', '確認', 4) === 6) { // MB_YESNO = 4
            retweet_create(status_id);
        }
    }
});

System.addKeyBindingHandler(0x57, // VK_W
                            0,
                            function(status_id) {
    var status = TwitterService.status.get(status_id);
    
    if (System.settings.getValue('Misc', 'UseQT')) {
        if (System.showMessage('選択項目をリツイートします。よろしいですか？', '確認', 4) === 6) { // MB_YESNO = 4
            retweet_create(status_id);
        }
    } else {
        TextArea.text = 'RT @' + status.user.screen_name + ': ' + status.text;
        TextArea.show();
        TextArea.setFocus();
    }
});

mixin(AzureaUtil.retweet, {
    addEventListener: retweet_addEventListener,
    removeEventListener: retweet_removeEventListener,
    create: retweet_create
});