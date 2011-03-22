function expandTemplate(template, // @param String: template
                        view) {   // @param Object: view
                                  // @return Hash: {text: expanded String,
                                  //                cursor: Number of cursor plase}
    var cursor,
        text = template.replace(/#{([^}]+?)}/g, function(m, figure) {
        with (view) {
            return eval(figure);
        }
    });
    
    text = text.split('#{}');
    if (text.length === 1) {
        cursor = 0;
        text = text[0];
    } else {
        cursor = text[0].length;
        text = text.join('');
    }
    return {
        'text': text,
        'cursor': cursor
    };
}


mixin(AzureaUtil.template, {
    'expand': expandTemplate
});