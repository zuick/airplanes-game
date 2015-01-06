define( function( require ){
    var gettext = require('i18n/gettext');
    var config = require('config');
    
    return function( game, caption, x, y, alignCenter, state ){
        var btn = game.add.text( x, y, gettext(caption), config.menu.btnStyle );
        btn.inputEnabled = true;
        
        if( alignCenter ) btn.anchor.setTo( 0.5, 0.5 );    
        
        btn.events.onInputOver.add( function(){                        
            btn.setStyle( config.menu.btnStyleOver )
        }, this);
        
        btn.events.onInputOut.add( function(){
            btn.setStyle( config.menu.btnStyle )
        }, this);
        
        btn.events.onInputDown.add( function(){ game.state.start(state) });
        
        return btn;
    }
})


