Azurea.loadjs({
    "AzureaVim": ["AzureaUtil/post"],
    
    "AzureaUtil/pre": [],
    "AzureaUtil/mixin": ["AzureaUtil/pre"],
    "AzureaUtil/ApiProxy": ["AzureaUtil/pre"],
    "AzureaUtil/db": ["AzureaUtil/pre", "AzureaUtil/mixin"],
    "AzureaUtil/event": ["AzureaUtil/pre", "AzureaUtil/mixin"],
    "AzureaUtil/time": ["AzureaUtil/pre", "AzureaUtil/mixin", "AzureaUtil/db", "AzureaUtil/event"],
    "AzureaUtil/event": ["AzureaUtil/pre", "AzureaUtil/mixin"],
    "AzureaUtil/template": ["AzureaUtil/pre", "AzureaUtil/mixin"],
    "AzureaUtil/yank": ["AzureaUtil/pre", "AzureaUtil/mixin", "AzureaUtil/db"],
    "AzureaUtil/notify": ["AzureaUtil/pre", "AzureaUtil/ApiProxy"],
    "AzureaUtil/post": ["AzureaUtil/pre", "AzureaUtil/event"],
    
    "plugins/open": ["AzureaVim", "plugins/unshorten"],
    "plugins/reply": ["AzureaVim"],
    "plugins/retweet": ["AzureaVim"],
    "plugins/settings": ["AzureaVim"],
    "plugins/shindan": ["AzureaVim", "plugins/unshorten"],
    "plugins/translate": ["AzureaVim"],
    "plugins/unshorten": ["AzureaVim"],
    "plugins/view": ["AzureaVim"],
    "plugins/earthquake": ["AzureaVim"],
    "plugins/delay": ["AzureaVim"],
    "plugins/debug": ["AzureaVim"]
});