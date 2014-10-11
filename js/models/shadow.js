define( function( require ){
    
    var config = require('config');
    return function( game, x, y, h, spriteKey ){
        var offset = { x: config.shadows.dx * h, y: config.shadows.dy * h };
        var shadow = game.add.sprite( x + offset.x, y + offset.y, spriteKey );
        shadow.offset = offset;
        shadow.anchor.setTo(0.5, 0.5);
        shadow.tint = config.shadows.tint;
        shadow.alpha = config.shadows.alpha;
        shadow.scale.setTo( config.shadows.scale );
        game.physics.enable( shadow, Phaser.Physics.ARCADE);
        
        shadow.setPosition = function( x, y ){
            this.x = x + this.offset.x;
            this.y = y + this.offset.y;
        }
        return shadow;
    }
})


