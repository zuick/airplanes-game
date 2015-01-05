define( function( require ){
    var config = require('config');
    var getShadow = require('models/shadow');
    
    return function Rocket( game, x, y, r, planeSpriteKey ){
        this.original = game.add.sprite( x, y, config.rockets.spriteKey );        
        game.physics.enable( this.original, Phaser.Physics.ARCADE);
        
        this.shadow = getShadow( game, x, y, config.planes.height, config.rockets.spriteKey );
        
        this.original.anchor.setTo(0.5, 0.5);
        this.planeSpriteKey = planeSpriteKey;
        
        this.rotate = function( a ){
            this.original.angle = a;
            this.shadow.angle = a;
        }
        
        this.setVelocity = function( x, y ){
            this.original.body.velocity.x = x;
            this.original.body.velocity.y = y;
            
            this.shadow.body.velocity.x = x;
            this.shadow.body.velocity.y = y;            
        }
        
        this.setPosition = function( x, y ){
            this.original.body.x = x;
            this.original.body.y = y;
            
            this.shadow.setPosition( x, y )
        }
                
        
        this.getFromOriginal = function( propertyName ){
            return function(){
                return this.original[ propertyName ];
            }.bind(this)
        }
        
        this.bringToTop = function(){
            this.original.bringToTop();
        }
        
        
        
        this.destroy = function(){
            this.original.destroy();
            this.shadow.destroy();           
        }
                
        
        this.changeAngle = function( angle ){
            this.original.angle += angle;
            this.shadow.angle += angle;
        }
        
        this.__defineGetter__("body", this.getFromOriginal('body') )
        this.__defineGetter__("scale", this.getFromOriginal('scale') )
        this.__defineGetter__("angle", this.getFromOriginal('angle') )
        this.__defineGetter__("x", this.getFromOriginal('x') )
        this.__defineGetter__("y", this.getFromOriginal('y') )                
        
        this.rotate( r );
    }
} )


