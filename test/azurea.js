(function(global) {

global.PreProcessTimelineStatus = function(status){};
global.PreFilterProcessTimelineStatus = function(status){};
global.PreSendUpdateStatus = function(status){};
global.PostSendUpdateStatus = function(){};
global.ReceiveFavorite = function(source, target, target_object){};

// Azurea Class
function Azurea() {
    this.textarea = '';
    this.in_reply_to_id = 0;
    this.notification;
    this.view = [
        [], // Timeline
        [], // Mention
        [], // Message
        [], // Favorite
        [], // Search
        [], // User
        [], // 抽出
        [], // List
        [], // Following
        []  // Followers
    ];
    this.current_view = 0;
    this.console = [];
}

Azurea.loadjs = function(features) { // @param Hash:
    var key, green, loaded = [],
        basepath = (function() {
        var script_nodes = document.getElementsByTagName('script'),
            i = 0, l = script_nodes.length;
        
        for (; i < l; ++i) {
            if(/feature\.js$/.test(script_nodes[i].src)) {
                return script_nodes[i].src.replace(/feature\.js$/, '');
            }
        }
        return '';
    })();
    
    function appendScript(path) { // @param String:
        var node;
        
        node = document.createElement('script');
        node.setAttribute('src', basepath + path);
        document.body.appendChild(node);
    }
    
    function loadjs(key) { // @param String:
        if (loaded.indexOf(key) === -1) {
            features[key].forEach(function(dependence) { // @param String:
                loadjs(dependence);
            });
            appendScript(key + '.js');
            loaded.push(key);
        }
    }
    
    for (key in features) {
        loadjs(key);
    }
}


Azurea.prototype = {
    get selected_status_id() {
        return System.view.selectedStatisId;
    },
    set selected_status_id(id) {
        System.view.selectedStatisId = id;
    },
    
    updateView: function(view_number) { // @param Number:
       var doc_view = document.getElementById('view'),
           html = '';
       
       if (this.current_view === view_number) {
            this.view[view_number].forEach(function(status) {
                html = '<li id="' + status.id + '"' + (status.id === this.selected_status_id ? ' class="selected"' : '') + '>' +
                       status.text +
                       '</li>' +
                       html;
            });
           doc_view.innerHTML = html;
       }
    },
    
    changeView: function(view_number) { // @param Number:
        if (this.current_view !== view_number) {
            this.current_view = view_number;
            this.updateView(view_number);
        }
    },
    
    notify: function(text) { // @param String:
        var doc_notify = uu.id('notify');
        
        Azurea.prototype.notify.timeout_id || clearTimeout(Azurea.prototype.notify.timeout_id);
        doc_notify.innerHTML = text;
        Azurea.prototype.notify.timeout_id = setTimeout(function() {
            doc_notify.innerHTML = '';
        }, 5000);
    },
    
    selectStatus: function(id) { // @param Strings: status id
        uu.query('#view li').forEach(function(node) {
            if (node.id === id) {
                node.className = 'selected';
                this.selected_status_id = id;
            } else {
                node.className = '';
            }
        });
    },
    
    sendStatus: function(text,                    // @param String:
                         in_reply_to_status_id) { // @param String:
        var is_notsend;
        
        is_notsend = PreSendUpdateStatus(new StatusUpdate(text, in_reply_to_status_id));
        if (!is_notsend) {
            this.view[0].push(new Status(text,
                                         Math.floor(new Date().getTime() * Math.random()).toString(),
                                         in_reply_to_status_id,
                                         new Date().getTime(),
                                         null,
                                         null,
                                         'Azurea for Test'));
            this.updateView(0);
            PostSendUpdateStatus();
        }
    },
    
    receiveEvent: function(type,    // @param String: status|faved
                           event) { // @param Hash:
        switch (type) {
        case 'status':
            PreProcessTimelineStatus(event.status);
            this.view[0].push(event.status);
            this.updateView(0);
            //PreFilterProcessTimelineStatus(event.status);
            break;
        case 'faved':
            ReceiveFavorite(event.source, event.target, event.target_object);
            break;
        }
    },
    
    pressKeys: function(string) { // @param String:
        
    }
};

global.Azurea = Azurea;
var azurea = new Azurea();
global.azurea = azurea;
uu.id('send').onclick = function() {
    azurea.sendStatus(document.getElementById('TextArea').value,
                      document.getElementById('in_reply_to_status_id').innerHTML);
}
uu.live('#view li', 'click', function(event) {
    azurea.selectStatus(event.target.id);
});

Azurea.ini = {
    Twitter: {
        ActiveProfileId: '0'
    },
    Proxy: {
        Port: '8080',
        UseIESetting: '1',
        UseProxy: '0'
    },
    Misc: {
        AskBeforePost: '0',
        AutoAppendHashtag: '0',
        BackgroundTiling: '0',
        ColorSchemeFile: 'DefaultThin.txt',
        DisableUnreadManagement: '1',
        EnableAutoRefresh: '0',
        EnableFlick: '0',
        ExpandAll: '0',
        ExpandComposeAreaSipOpened: '0',
        FitToIconHeight: '0',
        FontFace: 'TakaoExゴシック',
        FontSize: '9',
        InitialRefresh: '0',
        Interval: '1',
        NoPictures: '0',
        NoRefreshAfterPosted: '1',
        ReadCount: '40',
        SaveLogData: '1',
        ScrollToTop: '1',
        ShowComposeAlways: '1',
        ShowExitConfirmation: '0',
        SimpleMode: '0',
        TextColor: '12615680',
        UseQT: '0',
        UseSystemColor: '0'
    },
    Sound: {
        VibrateId: '1',
        VibrateNewMessage: '0',
        VibrateNewReply: '0'
    },
    Location: {
        DisableGPS: '1',
        UseCellTowerInfo: '0'
    },
    WindowMetrics: {
        Height: '700',
        Left: '524',
        Top: '0',
        Width: '500'
    },
    UserStream: {
        Enabled: '1'
    },
    Scripting: {
        AllowActiveXObject: '0'
    },
    Matches: {
        View0: 'http',
        View1: 'c4se'
    },
    Searches: {
        View0: '#c4se',
        View1: '#Opera'
    },
    Profile0: {
        Caption: 'Default',
        Highlight: 'c4se|Opera',
        Lists0: '4340928,ne_sachirou,uptodate',
        Lists1: '13000438,lotus_gate,kuragenohone',
        UserName: 'ne_sachirou',
        oauth_token: '',
        oauth_token_secret: ''
    },
    Profile1: {
        Caption: 'Test',
        Highlight: 'c4se|Opera',
        Lists0: '35720045,ne_sachirou,MomongaSentai',
        Lists1: '4835531,ne_sachirou,My favstar.fm list',
        UserName: 'lotus_gate',
        oauth_token: '',
        oauth_token_secret: ''
    }
};

global.System = {
    apiLevel: 11,
    clipboard: '',
    
    addContextMenuHandler: function(caption, // @param String:
                                    type,    // @param Number:
                                    fun) {   // @param Function(id:String[, string:String]):
        
    },
    
    addKeyBindingHandler: function(keycode,   // @param Number:
                                   optionkey, // @param Number:
                                   fun) {     // @param Function(id:String):
        
    },
    
    addGestureHandler: function(gesture, // @param Array[Number]:
                                fun) {   // @param Function:
        
    },
    
    addOpenUrlHandler: function(fun) { // @param Function(url:String):
        
    },
    
    alert: function(message) { // @param String:
        window.alert(message);
    },
    
    openUrl: function(url) { // @param String:
        console_show('window.open(' + url + ', null)');
    },
    
    showMessage: function(message, // @param String:
                          title,   // @param String:
                          type) {  // @param Number: http://msdn.microsoft.com/en-us/library/ms645505(v=vs.85).aspx
        window.confirm(message);
    },
    
    launchApplication: function(file,      // @param String:
                                option,    // @param String:
                                sw_show) { // @param Number:
        
    },
    
    inputBox: function(message,  // @param String:
                       text,     // @param String:
                       is_ime) { // @param Boolean:
                                 // @return String:
        return window.prompt(message, text);
    },
    
    showNotice: function(message) { // @param String:
        azurea.notify(message);
    },
    
    setActiveProfile: function(profile_number) { // @param Number:
        
    },
    
    systemInfo: function() { // @return Number: 0 = PC x86
                             //                 1 = PC x64
        return 0;
    },
    
    applicationPath: function() { // @return String:
        return 'C:\\Program Files\\AzureaWin\\Azurea.exe';
    },
    
    views: {
        selectedStatusId: 0,
        
        openUserTimeline: function() {
            
        },
        
        openSearch: function() {
            
        },
        
        openMatch: function() {
            
        },
        
        closeUserTimeline: function() {
            
        },
        
        closeAllUserTimeline: function() {
            
        },
        
        closeSearch: function() {
            
        },
        
        closeAllSearch: function() {
            
        },
        
        closeMatch: function() {
            
        },
        
        closeAllMatch: function() {
            
        },
        
        getUserTimelines: function() {
            
        },
        
        getSearches: function() {
            
        },
        
        getMatches: function() {
            
        },
        
        openTimeline: function() {
            
        },
        
        openMention: function() {
            
        },
        
        openMessage: function() {
            
        },
        
        openFavorite: function() {
            
        },
        
        openFollwoing: function() {
            
        },
        
        openFollowers: function() {
            
        },
        
        currentView: function() {
            
        },
        
        scrollTo: function() {
            
        },
        
        callRefresh: function() {
            
        },
        
        callMore: function() {
            
        },
        
        quickFilter: function() {
            
        }
    },
    settings: {
        getValue: function() {
            
        },
        
        setValue: function() {
            
        },
        
        reconfigure: function() {
            
        }
    }
};

global.TwitterService = {
    currentUser: Azurea.ini.Profile0.UserName,
    
    call: function() {
        
    },
    
    favorite: {
        create: function() {
            
        },
        
        destroy: function() {
            
        }
    },
    
    retweet: {
        create: function() {
            
        }
    },
    
    status: {
        update: function(status,                 // @param String:
                         in_reply_to_status_id) { // @param String:
            azurea.sendStatus(status, in_reply_to_status_id);
        },
        
        get: function() {
            
        },
        
        getUrls: function() {
            
        },
        
        getUsers: function() {
            
        },
        
        getHashes: function() {
            
        }
    }
};

(function() {
var _text, _in_reply_to_status_id;

global.TextArea = {
    get text() {
        return _text;
    },
    set text(text) {
        _text = text;
        document.getElementById('TextArea').value = text;
    },
    
    get in_reply_to_status_id() {
        return _in_reply_to_status_id;
    },
    set in_reply_to_status_id(in_reply_to_status_id) {
        _in_reply_to_status_id = in_reply_to_status_id;
        document.getElementById('in_reply_to_status_id').innerHTML = in_reply_to_status_id;
    },
    
    show: function() {},
    
    hide: function() {},
    
    setFocus: function() {
        
    },
    
    setCursor: function() {
        
    }
};
})();

global.Http = {
    downloadString: function() {
        
    },
    
    sendRequest: function() {
        
    },
    
    postRequest: function() {
        
    },
    
    postRequest2: function() {
        
    },
    
    sendRequestAsync: function() {
        
    },
    
    postRequestAsync: function() {
        
    }
};

global.HttpResponce = function() {
    this.header
    this.body
    this.statusCode
}

global.StatusUpdate = function(text,                  // @param String:
                               in_reply_to_status_id, // @param String='0':
                               geo) {                 // @param Geo Object:
    this.text = text;
    this.in_reply_to_status_id = in_reply_to_status_id || '0';
    this.geo = geo;
}

global.Status = function(text,                  // @param String:
                         id,                    // @param String:
                         in_reply_to_status_id, // @param String='0':
                         created_at,            // @param Number:
                         user,                  // @param User Object:
                         geo,                   // @param Geo Object:
                         source) {              // @param String:
    this.text = text;
    this.id = id;
    this.in_reply_to_status_id = in_reply_to_status_id || '0';
    this.favorite = azurea.view[3].indexOf(this) === -1 ? false : true;
    this.created_at = created_at;
    this.user = user;
    this.geo = geo;
    this.source = source;
}

global.Geo = function() {
    this.lat
    this.lon
}

global.User = function() {
    this.id
    this.name
    this.screen_name
    this.location
    this.description
    this.profile_image_url
    this.url
    this.protected_
}

})(window);