define( function( require ){
    var config = require('config');
    
    return function( game, x, y, vx, vy ){
        var smoke = game.add.sprite( x, y, config.planes.smokeSpriteKey );  
        smoke.anchor.setTo( 0.5, 0.5 );
        smoke.angle = Math.floor( Math.random() * 180 );
        game.physics.enable( smoke, Phaser.Physics.ARCADE);
        smoke.body.velocity.x = vx;
        smoke.body.velocity.y = vy;
        smoke.animations.add( 'smoke', [0,1,2,3,4,5] );
        smoke.animations.play( 'smoke', 10, false, true );
        return smoke;
    }
})


