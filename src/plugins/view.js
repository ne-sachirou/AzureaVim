AzureaUtil.mixin(AzureaVim.commands_list, {
    view: 'view',
    v: 'view',
    home: 'view home',
    'ほめ': 'view home',
    user: 'view user',
    'うせｒ': 'view user'
});
// :view option1 [option2]
// Azurea内のviewを移動します。
// option1は、移動先viewです。
// option1にuser, search, matchを指定した場合、option2を取ります。
// :v userで、option2を省略した場合は、指定statusから補完します。


AzureaVim.prototype.view = function() {
    switch (this.view.c1[this.command[1]]) {
    case 'home':
        System.views.openView(0);
        break;
    case 'mention':
        System.views.openView(1);
        break;
    case 'message':
        System.views.openView(2);
        break;
    case 'user':
        System.views.openView(5, this.command[2] || this.screen_name);
        break;
    case 'search':
        System.views.openView(4, this.command[2]);
        break;
    case 'favorite':
        System.views.openView(3);
        break;
    case 'match':
        System.views.openView(6, this.command[2]);
        break;
    case 'following':
        System.views.openView(8);
        break;
    case 'followers':
        System.views.openView(9);
        break;
    default:
        break;
    }
};
AzureaVim.prototype.view.c1 = {
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
    
    search: 'search',
    
    favorite: 'favorite',
    fav: 'favorite',
    f: 'favorite',
    
    match: 'match',
    
    following: 'following',
    follow: 'following',
    
    followers: 'followers',
    follower: 'followers',
    followed: 'followers'
};