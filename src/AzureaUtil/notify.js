//{!@simple
var notify_proxy = new ApiProxy('gntp');

if (!getDbKey('NotifyUseGrowl')) {
    setDbKey('NotifyUseGrowl', '0');
}
//}!@simple


function notifyNative(title,  // @param String:
                      text) { // @param String:
    System.isActive ? System.showNotice(text) :
                      System.showMessage(title, text, 0x100000);
}


function notifyGrowl(title,    // @param String:
                     text,     // @param Strong:
                     icon,     // @param String: screen_name|profile_image_url
                     sticky) { // @param Boolean=false:
    var option = {
        "title": title,
        "text": text,
        "sticky": sticky ? 'on' : null
    };
    
    option[/^https?:\/\/./.test(icon) ? 'icon_uri' : 'twitter_screen_name'] = icon;
    notify_proxy.submit(null,
                        option,
                        function(response) {
        try {
            var re = JSON.parse(response.body);
            
            if (re.error) {
                notifyNative(null, re.request.text);
            }
        } catch (err) {
            notifyNative(null, err.message + response.body);
        }
    });
}


function notify(text,     // @param String:
                title,    // @param String:
                icon,     // @param String: screen_name|profile_image_url
                sticky) { // @param Boolean=false:
    var use_growl = /*{!@simple*/ (System.systemInfo <= 2) && getDbKey('NotifyUseGrowl'); /*}!@simple*/
                    /*{@simple*/ false; /*}@simple*/
    
    try {
        if (use_growl) {
            notifyGrowl(title, text, icon, sticky);
        } else {
            notifyNative(title, text);
        }
    } catch (err) {
        notifyNative(title, text);
    }
}


AzureaUtil.notify = notify;