AzureaUtil.mixin(AzureaVim.codelist, {
});
//


System.addKeyBindingHandler(0x43, // VK_C
                            2, // Ctrl
                            function(status_id) { // @param String:
    var text = TwitterService.status.get(status_id).text;
    
    System.clipboard = text;
    AzureaUtil.yank.set(null, text);
});