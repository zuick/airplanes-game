define( function( require ){
    return function( game, x, y, angle ){
        var shild = game.add.sprite( x, y, "shine" );
        shild.angle = angle;
        shild.anchor.set( 0.5, 0.5 );
        
        shild.animations.add("shine");
        shild.animations.play("shine", 10, true);

        return shild;
    }
})


