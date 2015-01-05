define( function( require ){
    var config = require('config');
    
    return function( game ){
        this.create = function(){
            var text = game.add.text( window.innerWidth / 2, window.innerHeight / 2, "Again?", config.menu.textStyle );
            text.anchor.setTo( 0.5, 0.5 );    
            text.inputEnabled = true;

            text.events.onInputDown.add( function(){ game.state.start("game") }, this);
        }    
    }
})


