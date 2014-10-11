define( function(){
    return function( game, x, y ){
        
        var turnLabel = game.add.sprite( x, y, "turn-label" );
        
        turnLabel.anchor.set( 0.5, 0.5 );
        turnLabel.alpha = 0;
        turnLabel.scale.setTo( 2 );
        
        turnLabel.fadeOut = function(){
            game.add.tween( this ).to( { alpha: 0 }, 300, Phaser.Easing.Linear.None, true, 0, 0, false );
            game.add.tween( this.scale ).to( { x: 2, y: 2 }, 300, Phaser.Easing.Linear.None, true, 0, 0, false );
        }
        
        turnLabel.fadeIn = function(){
            game.add.tween( this ).to( { alpha: 1 }, 300, Phaser.Easing.Linear.None, true, 0, 0, false );            
            game.add.tween( this.scale ).to( { x: 1, y: 1 }, 300, Phaser.Easing.Linear.None, true, 0, 0, false );
            game.add.tween( this ).to( { angle: 360 } , 8000, Phaser.Easing.Linear.None, true, 0, Number.MAX_VALUE, false );
        }
        
        return turnLabel;
    }
})


