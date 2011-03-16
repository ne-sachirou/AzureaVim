AzureaUtil.mixin(AzureaVim.commands_list, {
    eval: '_evaluate'
});
// :eval code
// 任意のAzureaScriptを実行し、返値をinputBoxで表示します。
// AzureaVimのグローバルスコープで実行されます。
// codeは空白を含められます。連続した空白は、一つの半角空白に置き換えられます。
// 自由に空白を含めたい場合は、ダブルクオーテーションでcode全体を囲って下さい。
// コマンドパーサーの制限として、ダブルクオーテーションで囲わないcodeの中では、
// ダブルクオーテーションを使用出来ません。（囲ったcode中では、エスケープして使
// 用出来ます。）


AzureaVim.prototype._evaluate = function() {
    this.command[1] = this.command.slice(1).join(' ');
    System.inputBox(this.command[1], eval(this.command[1]), false);
}