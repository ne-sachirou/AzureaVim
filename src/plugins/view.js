AzureaUtil.mixin(AzureaVim.commands_list, {
    view: 'view',
    v: 'view',
    home: 'view home',
    user: 'view user'
});
// :view option1 [option2]
//


AzureaVim.prototype.view = function() {
    var c1 = {
        home: 'home',
        timeline: 'home',
        h: 'home',
        
        mention: 'mention',
        reply: 'mention',
        r: 'mention',
        m: 'mention',
        '@': 'mention',
        
        message: 'message',
        dm: 'message',
        d: 'message',
        
        user: 'user',
        u: 'user',
        
        favorite: 'favorite',
        fav: 'favorite',
        f: 'favorite',
        
        following: 'following',
        follow: 'following',
        
        followers: 'followers',
        follower: 'followers',
        followed: 'followers'
    },
        views = System.apiLevel >= 11 ? System.views : System;
    
    switch (c1[this.command[1]]) {
    case 'home':
        views.openTimeline();
        break;
    case 'mention':
        views.openMention();
        break;
    case 'message':
        views.openMessage();
        break;
    case 'user':
        views.openUserTimeline(this.command[2] || this.screen_name, false);
        break;
    case 'search':
        views.openSearch(this.command[2], false);
        break;
    case 'favorite':
        views.openFavorite();
        break;
    case 'match':
        views.openMatch(this.command[2], false);
        break;
    case 'following':
        views.openFollwoing();
        break;
    case 'followers':
        views.openFollowers();
        break;
    default:
        break;
    }
}