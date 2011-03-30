//{!@simple
var notify_proxy = new ApiProxy('gntp');

if (!getDbKey('NotifyUseGrowl')) {
    setDbKey('NotifyUseGrowl', '0');
}
//}!@simple


function notifyNative(text) { // @param String:
    System.isActive ? System.showNotice(text) :
                      System.showMessage(text, text, 0x100000);
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
                notifyNative(re.request.text);
            }
        } catch (err) {
            notifyNative(err.message + response.body);
        }
    });
}


function notify(text,     // @param String:
                title,    // @param String:
                icon,     // @param String: screen_name|profile_image_url
                sticky) { // @param Boolean=false:
    var use_growl = (System.systemInfo <= 2) && getDbKey('NotifyUseGrowl');
    
    try {
        if (use_growl) {
            notifyGrowl(title, text, icon, sticky);
        } else {
            notifyNative(text);
        }
    } catch (err) {
        notifyNative(text);
    }
}


AzureaUtil.notify = notify;