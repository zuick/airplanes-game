define( function( require ){
    var config = require('config');
    
    return function( game, x, y, vx, vy, settings ){
        var smoke = game.add.sprite( x, y, settings.spriteKey );  
        smoke.anchor.setTo( 0.5, 0.5 );
        smoke.angle = Math.floor( Math.random() * 180 );
        game.physics.enable( smoke, Phaser.Physics.ARCADE);
        smoke.body.velocity.x = vx;
        smoke.body.velocity.y = vy;
        smoke.body.damping = settings.damping;
        smoke.animations.add( 'smoke' );
        smoke.animations.play( 'smoke', settings.animationFrameRate, false, true );
        return smoke;
    }
})


