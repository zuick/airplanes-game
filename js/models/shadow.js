define( function( require ){
    
    var config = require('config');
    return function( game, x, y, spriteKey ){
        var shadow = game.add.sprite( x + config.shadows.dx, y + config.shadows.dy, spriteKey );
        shadow.anchor.setTo(0.5, 0.5);
        shadow.tint = config.shadows.tint;
        shadow.alpha = config.shadows.alpha;
        shadow.scale.setTo( config.shadows.scale );
        game.physics.enable( shadow, Phaser.Physics.ARCADE);
        
        return shadow;
    }
})


