AzureaUtil.mixin(AzureaVim.commands_list, {
    eval: '_evaluate'
});


AzureaVim.prototype._evaluate = function() {
    this.command[1] = this.command.slice(1).join(' ');
    System.inputBox(this.command[1], eval(this.command[1]), false);
}