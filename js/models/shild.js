define( function( require ){
    return function( game, x, y, angle ){
        var shild = game.add.sprite( x, y, "shine" );
        shild.angle = angle;
        shild.anchor.set( 0.5, 0.5 )
        game.physics.enable( shild, Phaser.Physics.ARCADE);
        
        shild.animations.add("shine");
        shild.animations.play("shine", 10, true);
        
//        shild.alpha = 0;
//        var fadeIn = game.add.tween( shild ).to( { alpha: 1 }, 300, Phaser.Easing.Linear.None, true, 0, 0, false );
//        game.add.tween( shild ).to( { angle: 360 } , 8000, Phaser.Easing.Linear.None, true, 0, Number.MAX_VALUE, false );
//        fadeIn.onComplete.add( function(){
//            game.add.tween( shild.scale ).to( { x: 0.95, y: 0.95 }, 500, Phaser.Easing.Linear.None, true, 0, Number.MAX_VALUE, true );            
//        })
        
        return shild;
    }
})


