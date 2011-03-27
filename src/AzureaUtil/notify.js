var notify_proxy = new ApiProxy('gntp');

function notifyNative(text) { // @param String:
    System.isActive ? System.showNotice(text) :
                      System.showMessage(text, text, 0x100000);
}


function notifyGrowl(title,        // @param String:
                     text,         // @param Strong:
                     screen_name,  // @param String:
                     sticky)     { // @param Boolean=false:
    notify_proxy.submit(null, {
        "title": title,
        "text": text,
        "twitter_screen_name": screen_name,
        "sticky": sticky ? 'on' : null
    },
                        function(response) {
        var re = JSON.parse(response.body);
        
        if (re.error) {
            notifyNative(re.request.text);
        }
    });
}


function notify(text,         // @param String:
                title,        // @param String:
                screen_name,  // @param String:
                sticky)     { // @param Boolean=false:
    var use_growl = (System.systemInfo <= 2);// && getDbKey('NotifyUseGrowl');
    
    try {
        if (use_growl) {
            notifyGrowl(title, text, screen_name, sticky);
        } else {
            notifyNative(text);
        }
    } catch (err) {
        notifyNative(text);
    }
}


AzureaUtil.notify = notify;