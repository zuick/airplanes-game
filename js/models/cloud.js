define( function( require ){
    var getShadow = require('models/shadow');
    var config = require('config');
    
    return function( game, x, y, vx, vy, spriteKey ){
        this.original = game.add.sprite( x, y, spriteKey );
        this.original.anchor.setTo( 0.5, 0.5 );
        this.wasVisible = false; 
        
        game.physics.enable( this.original, Phaser.Physics.ARCADE);
        
        this.shadow = getShadow( game, x, y, config.clouds.height, spriteKey );
        
//        game.add.tween( this.original ).to( { angle: 360 } , 20000, Phaser.Easing.Linear.None, true, 0, Number.MAX_VALUE, false )
//        game.add.tween( this.shadow ).to( { angle: 360 } , 20000, Phaser.Easing.Linear.None, true, 0, Number.MAX_VALUE, false )
        
        this.setVelocity = function( x, y ){
            x = x * 100 / this.original.body.width;
            y = y * 100 / this.original.body.width;
            this.original.body.velocity.x = x;
            this.original.body.velocity.y = y;
            
            this.shadow.body.velocity.x = x;
            this.shadow.body.velocity.y = y;
        }
        
        this.setPosition = function( x, y ){
            this.original.body.x = x;
            this.original.body.y = y;
            
            this.shadow.setPosition( x, y );
        }
        
        this.destroy = function(){
            this.original.destroy();
            this.shadow.destroy();
            console.log("destroy cloud")
        }
        this.setVelocity( vx, vy );
    }
})


