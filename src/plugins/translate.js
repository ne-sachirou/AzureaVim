AzureaUtil.mixin(AzureaVim.commands_list, {
    translate: 'translate',
    ja: 'translate ja'
});
// :translate [option1]
//

AzureaVim.prototype.translate = function() {
    if (!this.command[1]) {
        this.command[1] = 'ja';
    }
    Http.sendRequestAsync('https://www.googleapis.com/language/translate/v2?key=' +
                                     'AIzaSyCva1yUIFIBRqXOZDJ0nrbGbm0bz3FIksc' +
                                     '&q=' +
                                     encodeURI(this.status_text) +
                                     '&target=' + this.command[1],
                                     false,
                                     function(response) { // @param HttpResponce Object:
        if (response.statusCode !== 200) {
            throw Error('Google Translate API Error. statusCode is ' + response.statusCode + '.');
        }
        System.showMessage(response.body.match(/"translatedText"\s*:\s*"(.*)"/)[1],
                           response.body.match(/"detectedSourceLanguage"\s*:\s*"(.*)"/)[1] + '-> ',// + this.command[1],
                           0);
    });
}