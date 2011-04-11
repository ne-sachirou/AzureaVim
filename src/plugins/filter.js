AzureaUtil.mixin(AzureaVim.commands_list, {
});
//

(function() {

var filters = [], i = -1;
while (AzureaUtil.db.get('Filter' + ++i)) {
    filters.push(eval(AzureaUtil.db.get('Filter' + i)));
}


function attach_filters(status) {
    
}


function azvm_filter() {
    
}

AzureaVim.prototype.filter = azvm_filter;

TwitterService.addEventListener('preFilterProcessTimelineStatus', attach_filters);

}());