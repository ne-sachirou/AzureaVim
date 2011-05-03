AzureaVim.add_commands({
    test: 'test',
    t: 'test',
    test2: 'test 2'
});

AzureaVim.prototype.test = function(option,  // @param Arrzy:
                                    input) { // @param String:
    System.alert('Test has done!\noption: ' + option + '\ninput: ' + input);
    return 'test';
};
