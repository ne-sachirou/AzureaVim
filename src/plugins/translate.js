AzureaUtil.mixin(AzureaVim.commands_list, {
    translate: 'translate',
    ja: 'translate ja',
    'じゃ': 'translate ja'
});
// :translate [option1]
// Google翻訳APIで指定statusを翻訳します。
// option1は、翻訳先言語です。ISOの言語コードを指定します。
// option1がを省略した場合、jaへ翻訳します。

AzureaVim.prototype.translate = function() {
    var view = System.views.currentView,
        item = view.getItem(view.selectedItemId);
    
    function callback(response) { // @param HttpResponce Object:
        if (response.statusCode !== 200) {
            throw Error('Google Translate API Error. statusCode is ' + response.statusCode + '.');
        }
        item.text = response.body.match(/"translatedText"\s*:\s*"(.*)"/)[1];
        //response.body.match(/"detectedSourceLanguage"\s*:\s*"(.*)"/)[1] + '-> ' + this.command[1]
    }
    
    if (!this.command[1]) {
        this.command[1] = 'ja';
    }
    Http.sendRequestAsync('https://www.googleapis.com/language/translate/v2?key=' +
                          'AIzaSyCva1yUIFIBRqXOZDJ0nrbGbm0bz3FIksc' +
                          '&q=' +
                          encodeURI(this.status_text) +
                          '&target=' + this.command[1],
                          false,
                          callback);
}