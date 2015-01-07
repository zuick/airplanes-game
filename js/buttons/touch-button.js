define( function( require ){
    return function( game, x, y, r, spriteKey, callback, context ){
        var btn = game.add.button( x, y, spriteKey, callback, context, 1, 0, 2); 
        btn.anchor.setTo( 0.5, 0.5 ); 
        btn.inputEnabled = true;
        btn.angle = r;
        return btn;
    }
})
