define( function( require ){
    var getShadow = require('models/shadow');
    var config = require('config');
    
    return function( game, x, y, spriteKey ){
        this.original = game.add.sprite( x, y, spriteKey );
        this.original.anchor.setTo( 0.5, 0.5 );
        game.physics.enable( this.original, Phaser.Physics.ARCADE);
        
        this.shadow = getShadow( game, x, y, config.clouds.height, spriteKey );
    }
})


