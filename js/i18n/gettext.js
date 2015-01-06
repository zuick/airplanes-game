define( function( require ){
    var i18nData = require('i18n/data');
    var locale = 'ru';
    
    return function( key ){
        if( i18nData[locale] && i18nData[locale][key] ) return i18nData[locale][key];
        else return key;
    }
})


